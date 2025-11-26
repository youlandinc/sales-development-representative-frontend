import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDebounce } from '@/hooks';
import { get } from '@/request/request';
import { UTypeOf } from '@/utils/UTypeOf';

export type AutoCompleteOption = {
  inputValue: string;
  label: string;
};

type RawOption = {
  key?: string;
  label: string;
  value?: string;
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

const normalizeOption = (item: RawOption): AutoCompleteOption => ({
  label: item.label,
  inputValue: item.value || item.label,
});

const valueToOption = (val: string): AutoCompleteOption => ({
  label: val,
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
  const [inputValue, setInputValue] = useState(() => {
    if (!multiple && value) {
      return UTypeOf.isString(value) ? value : '';
    }
    return '';
  });
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
    }
  }, [hasStatic, hasDynamic, inputValue, open, staticOptions]);

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
    const requestUrl = `${url}?keyword=${encodeURIComponent(debouncedInputValue)}`;

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
        }));
        setOptions(mappedOptions);
      })
      .catch((error: any) => {
        if (error?.code !== 'ERR_CANCELED') {
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

  const autocompleteValue = useMemo(() => {
    if (multiple) {
      return ((value as string[]) ?? []).map(
        (val) =>
          options.find((opt) => opt.inputValue === val) || valueToOption(val),
      );
    }
    if (!value) {
      return null;
    }
    return (
      options.find((opt) => opt.inputValue === value) ||
      valueToOption(value as string)
    );
  }, [value, multiple, options]);

  const onOpenToTrigger = useCallback(() => {
    setOpen(true);
  }, []);

  const onCloseToReset = useCallback(() => {
    setOpen(false);
    if (!multiple && value) {
      const selectedOption = options.find((opt) => opt.inputValue === value);
      setInputValue(selectedOption?.label || (value as string));
    } else if (!multiple) {
      setInputValue('');
    }
    if (multiple) {
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

      if (multiple) {
        const values = (newValue as AutoCompleteOption[])
          .map(optionToValue)
          .filter((v): v is string => !!v);
        (onFormChange as (v: string[]) => void)(Array.from(new Set(values)));
        setInputValue('');
      } else {
        const val = newValue
          ? optionToValue(newValue as AutoCompleteOption)
          : null;
        (onFormChange as (v: string | null) => void)(val || null);
        setInputValue((newValue as AutoCompleteOption)?.label || '');
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
    onOpenToTrigger,
    onCloseToReset,
    onChangeToUpdateValue,
    onInputChangeToSearch,
    onGetOptionLabel,
    onIsOptionEqualToValue,
  };
};
