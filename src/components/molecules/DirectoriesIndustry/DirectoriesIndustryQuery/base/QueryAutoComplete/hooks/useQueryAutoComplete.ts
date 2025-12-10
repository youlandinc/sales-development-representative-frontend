import type { UIEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDebounce } from '@/hooks';
import { get } from '@/request/request';
import { UTypeOf } from '@/utils/UTypeOf';

export type AutoCompleteOption = {
  inputValue: string;
  key: string;
  label: string;
  remark?: string | null;
};

type RawOption = {
  key: string;
  label: string;
  value?: string;
  remark?: string | null;
};

type ApiResponseItem = {
  key?: string;
  label?: string;
  name?: string;
  value?: string;
  remark?: string | null;
};

interface UseQueryAutoCompleteParams {
  url?: string | null;
  staticOptions?: RawOption[];
  value?: string | string[] | null;
  multiple?: boolean;
  freeSolo?: boolean;
  isAuth?: boolean;
  requestParams?: Record<string, string[]>; // Cascade params: { state: ["CA", "NY"] }
  onFormChange:
    | ((newValue: string[]) => void)
    | ((newValue: string | null) => void);
}

const PAGE_SIZE = 20;

const normalizeOption = (item: RawOption): AutoCompleteOption => ({
  label: item.label,
  key: item.key,
  inputValue: item.value || item.label,
  remark: item?.remark,
});

const valueToOption = (val: string): AutoCompleteOption => ({
  label: val,
  key: val,
  inputValue: val,
});

const optionToValue = (opt: string | AutoCompleteOption): string =>
  UTypeOf.isString(opt) ? opt : opt.inputValue;

/**
 * Extract items array from API response (handles both direct array and nested data)
 */
const extractItemsFromResponse = (responseData: unknown): ApiResponseItem[] => {
  if (Array.isArray(responseData)) {
    return responseData;
  }
  if (
    UTypeOf.isObject(responseData) &&
    Array.isArray((responseData as { data?: unknown }).data)
  ) {
    return (responseData as { data: ApiResponseItem[] }).data;
  }
  return [];
};

/**
 * Map API response items to AutoCompleteOption format
 */
const mapApiResponseToOptions = (
  items: ApiResponseItem[],
): AutoCompleteOption[] =>
  items.map((item) => ({
    label: item.label || item.name || item.value || String(item),
    inputValue: item.value || item.label || item.name || String(item),
    key: item.key || item.value || item.label || String(item),
    remark: item.remark,
  }));

/**
 * Build URL with query params, supporting array values
 * e.g. { state: ["CA", "NY"] } => state=CA&state=NY
 */
const buildUrlWithParams = (
  baseUrl: string,
  keyword: string,
  pageNumber: number,
  requestParams?: Record<string, string[]>,
): string => {
  const params = new URLSearchParams();
  params.set('keyword', keyword);
  params.set('pageNumber', String(pageNumber));

  if (requestParams) {
    Object.entries(requestParams).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach((val) => {
          if (val !== undefined && val !== null && val !== '') {
            params.append(key, String(val));
          }
        });
      }
    });
  }

  return `${baseUrl}?${params.toString()}`;
};

export const useQueryAutoComplete = ({
  url,
  staticOptions = [],
  value,
  multiple = false,
  freeSolo = false,
  isAuth = true,
  requestParams,
  onFormChange,
}: UseQueryAutoCompleteParams) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Cache selected options to preserve label when option is from API search
  const selectedOptionsRef = useRef<Map<string, AutoCompleteOption>>(new Map());
  const [inputValue, setInputValue] = useState(() => {
    if (!multiple && value) {
      return UTypeOf.isString(value) ? value : '';
    }
    return '';
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const loadMoreControllerRef = useRef<AbortController | null>(null);
  const debouncedInputValue = useDebounce(inputValue, 300);

  // Mode detection via useMemo (replaces useEffect #1)
  const { hasStatic, hasDynamic, normalizedStaticOptions } = useMemo(
    () => ({
      hasStatic: staticOptions.length > 0,
      hasDynamic: !!url,
      normalizedStaticOptions: staticOptions.map(normalizeOption),
    }),
    [staticOptions, url],
  );

  // Effect #1: Sync inputValue from external value prop (props sync)
  useEffect(() => {
    if (open) {
      return;
    }
    if (!multiple && value) {
      const option = options.find((opt) => opt.inputValue === value);
      setInputValue(option?.label || (value as string));
    } else if (!multiple && !value) {
      setInputValue('');
    }
  }, [value, multiple, open, options]);

  // Effect #2: Main search logic (merged #3, #4, #6)
  useEffect(() => {
    // Pure static mode: set options directly
    if (hasStatic && !hasDynamic) {
      setOptions(normalizedStaticOptions);
      return;
    }

    // Mixed mode with empty input: show static options
    if (hasStatic && hasDynamic && !debouncedInputValue && open) {
      setOptions(normalizedStaticOptions);
      setPageNumber(1);
      setHasMore(true);
      setLoading(false);
      return;
    }

    // Dynamic search condition
    const shouldSearch =
      hasDynamic &&
      open &&
      (!hasStatic || (hasStatic && debouncedInputValue !== ''));

    if (!shouldSearch) {
      setLoading(false);
      return;
    }

    // Reset pagination for new search
    setPageNumber(1);
    setHasMore(true);

    // Cancel any pending requests (both main search and loadMore)
    abortControllerRef.current?.abort();
    loadMoreControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setIsLoadingMore(false);
    // Clear old results - in mixed mode, static options only show when input is empty
    // When searching (input not empty), behavior is same as pure dynamic mode
    setOptions([]);

    const requestUrl = buildUrlWithParams(
      url!,
      debouncedInputValue,
      1,
      requestParams,
    );

    get(requestUrl, { signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) {
          return;
        }
        const items = extractItemsFromResponse(res.data);
        setOptions(mapApiResponseToOptions(items));
        setHasMore(items.length >= PAGE_SIZE);
      })
      .catch((error: unknown) => {
        if ((error as { code?: string })?.code !== 'ERR_CANCELED') {
          // eslint-disable-next-line no-console
          console.error('Failed to search options:', error);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
    // Note: requestParams reference may change on each render, but content is typically stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedInputValue,
    url,
    open,
    hasStatic,
    hasDynamic,
    normalizedStaticOptions,
  ]);

  const loadNextPage = useCallback(() => {
    if (!hasDynamic || !hasMore || isLoadingMore || loading) {
      return;
    }

    // Cancel previous loadMore request if still pending
    loadMoreControllerRef.current?.abort();
    const controller = new AbortController();
    loadMoreControllerRef.current = controller;

    const nextPage = pageNumber + 1;
    setIsLoadingMore(true);

    const requestUrl = buildUrlWithParams(
      url!,
      inputValue,
      nextPage,
      requestParams,
    );

    get(requestUrl, { signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) {
          return;
        }
        const items = extractItemsFromResponse(res.data);
        const newOptions = mapApiResponseToOptions(items);

        setOptions((prev) => [...prev, ...newOptions]);
        setPageNumber(nextPage);
        setHasMore(items.length >= PAGE_SIZE);
      })
      .catch((error: unknown) => {
        if ((error as { code?: string })?.code !== 'ERR_CANCELED') {
          // eslint-disable-next-line no-console
          console.error('Failed to load more options:', error);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingMore(false);
        }
      });
  }, [
    hasDynamic,
    hasMore,
    isLoadingMore,
    loading,
    pageNumber,
    url,
    inputValue,
    requestParams,
  ]);

  const onListboxScroll = useCallback(
    (event: UIEvent<HTMLUListElement>) => {
      const listbox = event.currentTarget;
      const isNearBottom =
        listbox.scrollTop + listbox.clientHeight >= listbox.scrollHeight - 50;

      if (isNearBottom && hasMore && !isLoadingMore && !loading) {
        loadNextPage();
      }
    },
    [hasMore, isLoadingMore, loading, loadNextPage],
  );

  const autocompleteValue = useMemo(() => {
    const cache = selectedOptionsRef.current;

    if (multiple) {
      return ((value as string[]) ?? []).map((val) => {
        // Priority: cache > current options > fallback
        const cached = cache.get(val);
        if (cached) {
          return cached;
        }
        return (
          options.find((opt) => opt.inputValue === val) || valueToOption(val)
        );
      });
    }

    if (!value) {
      return null;
    }

    const cached = cache.get(value as string);
    if (cached) {
      return cached;
    }
    return (
      options.find((opt) => opt.inputValue === value) ||
      valueToOption(value as string)
    );
  }, [value, multiple, options]);

  const onOpenToTrigger = useCallback(() => {
    // Do not open menu when no options source (pure input mode)
    if (!hasStatic && !hasDynamic) {
      return;
    }
    setOpen(true);

    // Reset for dynamic search
    if (hasDynamic) {
      setLoading(true);
      // Clear old results - Effect #2 will set static options if inputValue is empty
      // or fetch new results if inputValue is not empty
      setOptions([]);
    }
  }, [hasStatic, hasDynamic]);

  const onCloseToReset = useCallback(() => {
    setOpen(false);
    // Cancel any pending requests
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    loadMoreControllerRef.current?.abort();
    loadMoreControllerRef.current = null;
    // Reset state when menu closes
    setLoading(false);
    setPageNumber(1);
    setHasMore(true);
    setIsLoadingMore(false);
    if (!multiple && value) {
      const selectedOption = options.find((opt) => opt.inputValue === value);
      setInputValue(selectedOption?.label || (value as string));
    } else {
      setInputValue('');
    }
  }, [multiple, value, options]);

  const onChangeToUpdateValue = useCallback(
    (
      _: unknown,
      newValue: AutoCompleteOption | AutoCompleteOption[] | null,
    ) => {
      if (!isAuth) {
        return;
      }

      const cache = selectedOptionsRef.current;

      if (multiple) {
        const opts = newValue as AutoCompleteOption[];
        // Update cache with selected options
        cache.clear();
        opts.forEach((opt) => {
          if (opt.inputValue) {
            cache.set(opt.inputValue, opt);
          }
        });

        const values = opts.map(optionToValue).filter((v): v is string => !!v);
        (onFormChange as (v: string[]) => void)(Array.from(new Set(values)));
        setInputValue('');
      } else {
        const opt = newValue as AutoCompleteOption | null;
        // Update cache with selected option
        cache.clear();
        if (opt?.inputValue) {
          cache.set(opt.inputValue, opt);
        }

        const val = opt ? optionToValue(opt) : null;
        (onFormChange as (v: string | null) => void)(val);
        setInputValue(opt?.label || '');
      }
    },
    [multiple, isAuth, onFormChange],
  );

  const onInputChangeToSearch = useCallback(
    (_: unknown, newInputValue: string, reason: string) => {
      if (reason === 'input') {
        setInputValue(newInputValue);
        // Show loading immediately when user types (event-driven, replaces useEffect #5)
        // Only for dynamic mode: show loading before debounce completes
        const shouldShowLoading =
          hasDynamic && (!hasStatic || (hasStatic && newInputValue !== ''));
        if (shouldShowLoading) {
          // Cancel any pending loadMore request immediately
          // New search will start after debounce, old pagination results should not pollute new results
          loadMoreControllerRef.current?.abort();
          loadMoreControllerRef.current = null;
          setIsLoadingMore(false);
          setLoading(true);
          // Clear old results - mixed mode only shows static options when input is empty
          setOptions([]);
        }
      } else if (reason === 'clear') {
        setInputValue('');
      }
    },
    [hasDynamic, hasStatic],
  );

  const onGetOptionLabel = useCallback(
    (option: string | AutoCompleteOption): string =>
      UTypeOf.isString(option) ? option : option.label || '',
    [],
  );

  const onIsOptionEqualToValue = useCallback(
    (option: AutoCompleteOption, val: AutoCompleteOption): boolean =>
      option.inputValue === val.inputValue,
    [],
  );

  return {
    open,
    options,
    loading,
    inputValue,
    autocompleteValue,
    isLoadingMore,
    onOpenToTrigger,
    onCloseToReset,
    onChangeToUpdateValue,
    onInputChangeToSearch,
    onGetOptionLabel,
    onIsOptionEqualToValue,
    onListboxScroll,
  };
};
