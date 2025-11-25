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
  _fetchDirectoriesAdditionalConfig,
  _fetchPreviewBody,
  _fetchPreviewHeader,
} from '@/request/directories';
import { DirectoriesBizIdEnum } from '@/types/directories';

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
   */
  private formValuesRaw$ = new BehaviorSubject<{
    bizId: DirectoriesBizIdEnum | '';
    institutionType: string;
    entityType: string;
    formValues: Record<string, any>;
  }>({
    bizId: '',
    institutionType: '',
    entityType: '',
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
    filter(
      (values) =>
        !!values.bizId &&
        !!values.institutionType &&
        !!values.entityType &&
        Object.keys(values.formValues).length > 0,
    ),
    tap(() => {
      // Set loading state immediately when A changes
      this.loadingAdditionalSubject.next(true);
    }),
    switchMap((data) => {
      // Capture A's snapshot to ensure correct A-B pairing
      const formValuesKey = JSON.stringify(data);
      const requestData = this._assembleAdditionalRequest(data);

      return from(_fetchDirectoriesAdditionalConfig(requestData)).pipe(
        map(({ data }) => ({
          source: 'api' as const,
          data: data || null,
          formValuesKey, // Attach A's key for later matching
        })),
        catchError(
          this._handleError({
            source: 'api' as const,
            data: {},
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
        data: null,
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
      // Validate A completeness - skip if missing required fields
      if (
        !formData.bizId ||
        !formData.institutionType ||
        !formData.entityType ||
        Object.keys(formData.formValues).length === 0
      ) {
        return EMPTY;
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
          return this._assembleFinalData(formData, additional);
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
      const requestData = this._assemblePreviewRequest(finalData);

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
   */
  updateFormValues(data: {
    bizId: DirectoriesBizIdEnum | '';
    institutionType: string;
    entityType: string;
    formValues: Record<string, any>;
  }) {
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
   * Get flattened request params from finalData
   * Used by import API which needs the same format as preview request
   */
  getFlattenedParams(finalData: any): Record<string, any> {
    return this._assemblePreviewRequest(finalData);
  }

  /**
   * Reset all data flows to initial state
   * Called when user navigates away or explicitly resets the form
   */
  reset() {
    this.formValuesRaw$.next({
      bizId: '',
      institutionType: '',
      entityType: '',
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
   * Check if a value is considered empty
   * Empty values: null, undefined, empty string, empty array
   */
  private _isEmptyValue(value: any): boolean {
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    );
  }

  /**
   * Merge non-empty fields from source into target object
   * Excludes specified keys (e.g., 'additionalFields')
   * Only copies fields that are not empty
   */
  private _mergeNonEmptyFields(
    target: Record<string, any>,
    source: Record<string, any>,
    excludeKeys: string[] = [],
  ): void {
    Object.keys(source).forEach((key) => {
      if (excludeKeys.includes(key)) {
        return;
      }
      const value = source[key];
      if (!this._isEmptyValue(value)) {
        target[key] = value;
      }
    });
  }

  /**
   * Generic error handler for API requests
   * Returns a fallback value when request fails
   * Logs error to console (commented out for production)
   */
  private _handleError<T>(fallbackValue: T) {
    return (error: any) => {
      //eslint-disable-next-line
      console.error('❌ API request failed:', error);
      return of(fallbackValue);
    };
  }

  /**
   * Assemble preview request payload from finalData (C)
   * Flattens nested structure into flat key-value pairs:
   * Input: { query: { bizId, entityType, FIRM: {...} }, additionalDetails: {...} }
   * Output: { bizId, entityType, ...FIRM fields, ...additionalDetails }
   * Excludes empty values only
   */
  private _assemblePreviewRequest(finalData: any): any {
    if (!finalData || !finalData.query) {
      return {};
    }

    const { query, additionalDetails } = finalData;
    const { bizId, institutionType, entityType } = query;

    const requestData: any = {
      bizId,
      institutionType,
      entityType,
    };

    // Flatten current entityType's fields
    const entityData = query[entityType] || {};
    this._mergeNonEmptyFields(requestData, entityData);

    // Flatten additional details fields (include additionalFields array)
    if (additionalDetails && typeof additionalDetails === 'object') {
      this._mergeNonEmptyFields(requestData, additionalDetails);
    }

    return requestData;
  }

  /**
   * Assemble additional details request payload from form values (A)
   * Extracts only the current entityType's fields from nested formValues
   * Input: { bizId, entityType: 'FIRM', formValues: { FIRM: {...}, EXECUTIVE: {...} } }
   * Output: { bizId, entityType: 'FIRM', ...FIRM fields }
   */
  private _assembleAdditionalRequest(data: {
    bizId: DirectoriesBizIdEnum | '';
    institutionType: string;
    entityType: string;
    formValues: Record<string, any>;
  }) {
    const { bizId, institutionType, entityType, formValues } = data;

    const entityData = formValues[entityType] || {};

    const requestData: any = {
      bizId,
      institutionType,
      entityType,
    };

    this._mergeNonEmptyFields(requestData, entityData);

    return requestData;
  }

  /**
   * Assemble final combined data (C) from A + B
   * Output structure:
   * {
   *   query: { bizId, institutionType, entityType, ...all formValues },
   *   additionalDetails: { additionalFields: ['key1'], ...values },
   *   timestamp: number
   * }
   */
  private _assembleFinalData(
    formData: {
      bizId: DirectoriesBizIdEnum | '';
      institutionType: string;
      entityType: string;
      formValues: Record<string, any>;
    },
    additional: any,
  ) {
    const processedAdditional = this._processAdditionalDetails(additional);

    return {
      query: {
        bizId: formData.bizId,
        institutionType: formData.institutionType,
        entityType: formData.entityType,
        ...formData.formValues,
      },
      additionalDetails: processedAdditional,
      timestamp: Date.now(),
    };
  }

  /**
   * Process additional details data into standardized format
   * Supports two input formats:
   * 1. Dual-state format (from manual edits): { checkbox: {key: true/false}, values: {key: value} }
   * 2. Array format (from API): [...config items]
   *
   * Output format: { additionalFields: ['checkedKey1', 'checkedKey2'], ...otherValues }
   * - additionalFields: Array of checked checkbox keys
   * - Other fields: Values from SELECT inputs
   */
  private _processAdditionalDetails(additional: any): any {
    if (!additional || typeof additional !== 'object') {
      return { additionalFields: [] };
    }

    // Handle dual-state format (manual edits)
    if ('checkbox' in additional && 'values' in additional) {
      const { checkbox, values } = additional;

      const additionalFieldsKeys = Object.entries(checkbox)
        .filter(([, value]) => value === true)
        .map(([key]) => key);

      return {
        additionalFields: additionalFieldsKeys,
        ...values,
      };
    }

    // Handle array format (initial API data)
    if (Array.isArray(additional)) {
      return { additionalFields: [] };
    }

    // Unknown format - return empty
    return { additionalFields: [] };
  }
}

export const directoriesDataFlow = new DirectoriesDataFlow();
