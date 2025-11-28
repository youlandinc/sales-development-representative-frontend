import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  forkJoin,
  from,
  merge,
  of,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  scan,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';

import {
  buildAdditionalRequestParams,
  buildFinalData,
  buildSearchRequestParams,
  DirectoriesFormValues,
} from '@/utils/directories';
import {
  _fetchDirectoriesAdditionalConfig,
  _fetchPreviewBody,
  _fetchPreviewHeader,
} from '@/request/directories';
import { HIERARCHICAL_CONFIG_BIZ_IDS } from '@/constants/directories';

// Re-export for convenience
export type { DirectoriesFormValues } from '@/utils/directories';

/**
 * Directories Data Flow Service
 *
 * Data flow pipeline:
 * A (formValues) → debounce 500ms → B (additionalDetails) → C (finalData) → debounce 300ms → D (preview)
 * Note: B layer does NOT have debounce (DEBOUNCE_TIME.ADDITIONAL is reserved but unused)
 *
 * A: Form values (from Zustand store)
 * B: Additional details configuration (fetched based on A, can be manually edited)
 * C: Final combined data = A + B (used for preview requests)
 * D: Preview data (header + body, fetched in parallel using forkJoin)
 *
 * Key features:
 * - Automatic cancellation of outdated requests via switchMap
 * - Manual edits priority: User edits persist until A changes
 * - Loading states: Separate tracking for additional details and preview
 * - Debouncing: Prevents excessive API calls during rapid user interactions
 */
class DirectoriesDataFlow {
  // ========================================
  // Configuration
  // ========================================
  /**
   * Debounce time configuration (in milliseconds)
   * - FORM_VALUES: Delay before triggering additional details request after form changes
   * - ADDITIONAL: Not used currently, reserved for future additional details debouncing
   * - FINAL_DATA: Delay before triggering preview request, prevents rapid checkbox toggling
   */
  private readonly DEBOUNCE_TIME = {
    FORM_VALUES: 500,
    ADDITIONAL: 500,
    FINAL_DATA: 300,
  };

  // ========================================
  // Data Source A: Form Values
  // ========================================
  /**
   * Raw form values stream (no debounce)
   * Updated immediately when user interacts with form controls
   *
   * 扁平配置: { bizId, formValues }
   * 层级配置: { bizId, institutionType, entityType, formValues }
   */
  private formValuesRaw$ = new BehaviorSubject<DirectoriesFormValues>({
    bizId: '',
    formValues: {},
  });

  /**
   * Debounced form values stream (500ms delay)
   * Prevents excessive API calls during rapid form changes
   * Uses deep equality check to avoid redundant emissions
   */
  public formValuesDebounced$ = this.formValuesRaw$.pipe(
    debounceTime(this.DEBOUNCE_TIME.FORM_VALUES),
    distinctUntilChanged(
      (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  // ========================================
  // Data Source B: Additional Details
  // ========================================
  /**
   * B1: API-triggered stream
   * Automatically fetches additional details configuration when A (form values) changes
   * Uses switchMap to cancel outdated requests
   */
  private additionalFromA$ = this.formValuesDebounced$.pipe(
    filter((values) => {
      if (!values.bizId || Object.keys(values.formValues).length === 0) {
        return false;
      }

      // Hierarchical config: requires institutionType + entityType
      if (HIERARCHICAL_CONFIG_BIZ_IDS.includes(values.bizId)) {
        return !!values.institutionType && !!values.entityType;
      }

      // Flat config: only requires bizId + formValues
      return true;
    }),
    tap(() => {
      // Set loading state immediately when A changes
      this.loadingAdditionalSubject.next(true);
    }),
    switchMap((data) => {
      // Capture A's snapshot to ensure correct A-B pairing
      const formValuesKey = JSON.stringify(data);
      const requestData = buildAdditionalRequestParams(data);

      return from(_fetchDirectoriesAdditionalConfig(requestData)).pipe(
        map(({ data }) => ({
          source: 'api' as const,
          data: Array.isArray(data) ? data : [], // Ensure return array
          formValuesKey, // Attach A's key for later matching
        })),
        catchError(
          this._handleError({
            source: 'api' as const,
            data: [], // Keep consistent with success response, return empty array
            formValuesKey,
          }),
        ),
        tap(() => {
          // Clear loading state when B arrives
          this.loadingAdditionalSubject.next(false);
        }),
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /**
   * B2: User-triggered stream
   * Emits when user manually edits additional details (e.g., toggling checkboxes)
   * Has higher priority than B1 until A changes
   */
  private additionalManualEdit$ = new BehaviorSubject<any>(null);

  /**
   * B Combined: Merge B1 (API) and B2 (manual edits)
   * Uses scan to implement priority logic:
   * - When A changes: Reset manual edits, use new API data
   * - When user edits: Keep manual edits, ignore API updates
   * - When no manual edits: Use latest API data
   */
  private additionalCombined$ = merge(
    this.additionalFromA$,
    this.additionalManualEdit$.pipe(
      filter((data) => data !== null),
      map((data) => ({
        source: 'manual' as const,
        data,
        formValuesKey: null as string | null,
      })),
    ),
  ).pipe(
    scan<
      any,
      {
        source: 'api' | 'manual';
        data: any;
        hasManualEdit: boolean;
        formValuesKey: string | null;
      }
    >(
      (acc, curr) => {
        // Case 1: API response - always apply, reset manual edit flag
        if (curr.source === 'api') {
          return {
            source: curr.source,
            data: curr.data,
            hasManualEdit: false,
            formValuesKey: curr.formValuesKey || acc.formValuesKey,
          };
        }

        // Case 2: User manual edit - only possible when loading = false
        if (curr.source === 'manual') {
          return {
            source: curr.source,
            data: curr.data,
            hasManualEdit: true,
            formValuesKey: acc.formValuesKey,
          };
        }

        return acc;
      },
      {
        source: 'api' as const,
        data: [], // Initial value as empty array, consistent with API response format
        hasManualEdit: false,
        formValuesKey: null,
      },
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /**
   * Public stream for additional details (API data only)
   * Filters out manual edits - only emits when new API data arrives
   * Used by Zustand to update the configuration structure
   */
  public additionalDebounced$ = this.additionalCombined$.pipe(
    filter((result) => result.source === 'api'),
    map((result) => result.data),
  );

  // ========================================
  // Data source C: Final combined data = A + B
  // ========================================
  // Architecture notes:
  // 1. switchMap: Resubscribe when A changes to avoid incorrect combination of old B + new A
  // 2. combineLatest: Inner observer monitors B and loading, can be triggered by manual B edits
  // 3. filter: Block when loading=true or formValuesKey mismatch
  public finalData$ = this.formValuesDebounced$.pipe(
    switchMap((formData) => {
      // Validate required fields
      if (!formData.bizId || Object.keys(formData.formValues).length === 0) {
        return EMPTY;
      }

      // Hierarchical config: requires institutionType + entityType
      if (HIERARCHICAL_CONFIG_BIZ_IDS.includes(formData.bizId)) {
        if (!formData.institutionType || !formData.entityType) {
          return EMPTY;
        }
      }

      // Capture current A's key for matching with B
      const currentFormValuesKey = JSON.stringify(formData);

      return combineLatest([
        this.additionalCombined$,
        this.loadingAdditionalSubject,
      ]).pipe(
        filter(([result, isLoading]) => {
          // Block if still loading B
          if (isLoading) {
            return false;
          }

          // Allow initial state (before first B arrives)
          if (!result.formValuesKey) {
            return true;
          }

          // Ensure B matches current A (prevent old B + new A mismatch)
          return result.formValuesKey === currentFormValuesKey;
        }),
        map(([result]) => {
          // Combine A + B into final request payload
          const additional = result.data;
          return buildFinalData(formData, additional);
        }),
      );
    }),
    /**
     * Final debounce (300ms) to prevent excessive preview requests
     * Reasons:
     * 1. Prevents rapid firing when user quickly toggles multiple checkboxes
     * 2. Ensures data stability before triggering Zustand updates and component re-renders
     * Note: Can be removed if immediate response to manual edits is required
     */
    debounceTime(this.DEBOUNCE_TIME.FINAL_DATA),
    distinctUntilChanged(
      (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  // ========================================
  // Data Source D: Preview Data (Header + Body)
  // ========================================
  /**
   * Preview data stream
   * Fetches table header and body in parallel using forkJoin
   * Triggered whenever C (finalData) changes
   */
  public preview$ = this.finalData$.pipe(
    filter((data) => data !== null),
    tap(() => {
      //console.log('🔄 Loading Preview (Header ∥ Body)...');
      this.loadingPreviewSubject.next(true);
    }),
    switchMap((finalData) => {
      // Flatten finalData into flat request payload
      const requestData = buildSearchRequestParams(finalData);

      // Parallel requests for header and body
      return forkJoin({
        header: from(_fetchPreviewHeader(requestData)).pipe(
          map(({ data }) => data || []),
          catchError(this._handleError([])),
        ),
        body: from(_fetchPreviewBody(requestData)).pipe(
          map(
            ({ data }) =>
              data || {
                findCount: 0,
                defaultPreviewCount: 0,
                maxImportCount: 0,
                findList: [],
              },
          ),
          catchError(
            this._handleError({
              findCount: 0,
              defaultPreviewCount: 0,
              maxImportCount: 0,
              findList: [],
            }),
          ),
        ),
      }).pipe(
        tap(() => {
          // Clear loading state when both header and body arrive
          this.loadingPreviewSubject.next(false);
        }),
        catchError((error) => {
          this.loadingPreviewSubject.next(false);
          return this._handleError({
            header: [],
            body: {
              findCount: 0,
              defaultPreviewCount: 0,
              maxImportCount: 0,
              findList: [],
            },
          })(error);
        }),
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  // ========================================
  // Loading State Management
  // ========================================
  /**
   * Internal subjects for loading states
   * Not directly exposed - use public observables below
   */
  private loadingAdditionalSubject = new BehaviorSubject<boolean>(false);
  private loadingPreviewSubject = new BehaviorSubject<boolean>(false);

  /**
   * Public read-only observables for loading states
   * Consumed by Zustand store to update UI
   */
  public isLoadingAdditional$ = this.loadingAdditionalSubject.asObservable();
  public isLoadingPreview$ = this.loadingPreviewSubject.asObservable();

  // ========================================
  // Public Methods
  // ========================================
  /**
   * Update form values (A)
   * Called by Zustand when user interacts with form controls
   * Triggers the entire data flow pipeline
   *
   * 扁平配置: { bizId, formValues }
   * 层级配置: { bizId, institutionType, entityType, formValues }
   */
  updateFormValues(data: DirectoriesFormValues) {
    this.formValuesRaw$.next(data);
  }

  /**
   * Manually update additional details (B2)
   * Called by Zustand when user edits additional details (e.g., checkbox toggle)
   * Triggers manual edit flow, bypassing API
   */
  updateAdditionalManually(data: any) {
    this.additionalManualEdit$.next(data);
  }

  /**
   * Reset all data flows to initial state
   * Called when user navigates away or explicitly resets the form
   */
  reset() {
    this.formValuesRaw$.next({
      bizId: '',
      formValues: {},
    });
    this.additionalManualEdit$.next(null);
    this.loadingAdditionalSubject.next(false);
    this.loadingPreviewSubject.next(false);
  }

  // ========================================
  // Private Helper Methods
  // ========================================

  /**
   * Generic error handler for API requests
   * Returns a fallback value when request fails
   */
  private _handleError<T>(fallbackValue: T) {
    return (error: any) => {
      //eslint-disable-next-line
      console.error('❌ API request failed:', error);
      return of(fallbackValue);
    };
  }
}

export const directoriesDataFlow = new DirectoriesDataFlow();
