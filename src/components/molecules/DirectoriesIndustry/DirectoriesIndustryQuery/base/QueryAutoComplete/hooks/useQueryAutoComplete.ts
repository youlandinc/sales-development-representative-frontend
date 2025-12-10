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

interface UseQueryAutoCompleteParams {
  url?: string | null;
  staticOptions?: RawOption[];
  value?: string | string[] | null;
  multiple?: boolean;
  freeSolo?: boolean;
  isAuth?: boolean;
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

export const useQueryAutoComplete = ({
  url,
  staticOptions = [],
  value,
  multiple = false,
  freeSolo = false,
  isAuth = true,
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
  const debouncedInputValue = useDebounce(inputValue, 300);
  const hasStatic = staticOptions.length > 0;
  const hasDynamic = !!url;

  useEffect(() => {
    if (hasStatic && !hasDynamic) {
      setOptions(staticOptions.map(normalizeOption));
    }
  }, [hasStatic, hasDynamic, staticOptions]);

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

  useEffect(() => {
    if (hasStatic && hasDynamic && !inputValue && open) {
      setOptions(staticOptions.map(normalizeOption));
      // Reset pagination when showing static options
      setPageNumber(1);
      setHasMore(true);
    }
  }, [hasStatic, hasDynamic, inputValue, open, staticOptions]);

  // Reset pagination when keyword changes
  useEffect(() => {
    if (hasDynamic) {
      setPageNumber(1);
      setHasMore(true);
    }
  }, [debouncedInputValue, hasDynamic]);

  // Fetch options (page 1)
  useEffect(() => {
    const shouldSearch =
      hasDynamic &&
      open &&
      (!hasStatic || (hasStatic && debouncedInputValue !== ''));

    if (!shouldSearch) {
      setLoading(false);
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    const requestUrl = `${url}?keyword=${encodeURIComponent(debouncedInputValue)}&pageNumber=1`;

    get(requestUrl, { signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) {
          return;
        }
        const responseData = res.data;
        const items = Array.isArray(responseData)
          ? responseData
          : responseData?.data || [];

        const mappedOptions = items.map((item: any) => ({
          label: item.label || item.name || item.value || String(item),
          inputValue: item.value || item.label || item.name || String(item),
          key: item.key,
          remark: item?.remark,
        }));
        setOptions(mappedOptions);
        setHasMore(items.length >= PAGE_SIZE);
      })
      .catch((error: any) => {
        if (error?.code !== 'ERR_CANCELED') {
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
  }, [debouncedInputValue, url, open, hasStatic, hasDynamic]);

  const loadNextPage = useCallback(() => {
    if (!hasDynamic || !hasMore || isLoadingMore || loading) {
      return;
    }

    const nextPage = pageNumber + 1;
    const controller = new AbortController();

    setIsLoadingMore(true);
    const requestUrl = `${url}?keyword=${encodeURIComponent(inputValue)}&pageNumber=${nextPage}`;

    get(requestUrl, { signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) {
          return;
        }
        const responseData = res.data;
        const items = Array.isArray(responseData)
          ? responseData
          : responseData?.data || [];

        const mappedOptions = items.map((item: any) => ({
          label: item.label || item.name || item.value || String(item),
          inputValue: item.value || item.label || item.name || String(item),
          key: item.key,
          remark: item?.remark,
        }));

        setOptions((prev) => [...prev, ...mappedOptions]);
        setPageNumber(nextPage);
        setHasMore(items.length >= PAGE_SIZE);
      })
      .catch((error: any) => {
        if (error?.code !== 'ERR_CANCELED') {
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
  }, [hasStatic, hasDynamic]);

  const onCloseToReset = useCallback(() => {
    setOpen(false);
    // Reset pagination when menu closes
    setPageNumber(1);
    setHasMore(true);
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
      } else if (reason === 'clear') {
        setInputValue('');
      }
    },
    [],
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
