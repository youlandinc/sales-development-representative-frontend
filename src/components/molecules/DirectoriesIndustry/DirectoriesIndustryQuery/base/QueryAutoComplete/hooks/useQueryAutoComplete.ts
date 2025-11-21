import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type AutoCompleteOption = {
  inputValue?: string;
  label: string;
};

type RawOption = {
  key?: string;
  label: string;
  value?: string;
  inputValue?: string;
};

interface UseQueryAutoCompleteParams {
  url?: string | null;
  staticOptions?: Array<RawOption | AutoCompleteOption>;
  value?: string | string[] | null;
  multiple?: boolean;
  onFormChange:
    | ((newValue: string[]) => void)
    | ((newValue: string | null) => void);
}

export const useQueryAutoComplete = ({
  url,
  staticOptions = [],
  value,
  multiple,
  onFormChange,
}: UseQueryAutoCompleteParams) => {
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!url && staticOptions.length > 0) {
      const formattedOptions = staticOptions.map((item) => ({
        label: item.label,
        inputValue: ('value' in item ? item.value : item.label) || item.label,
      }));
      setOptions(formattedOptions);
    }
  }, [url, staticOptions]);

  const onSearch = useCallback(
    async (inputValue: string) => {
      if (!url) {
        return;
      }

      // 清除之前的定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // 输入太短时清空选项
      if (!inputValue || inputValue.length < 2) {
        setOptions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // 防抖：300ms 后执行搜索
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const searchUrl = `${url}?q=${encodeURIComponent(inputValue)}`;
          const res = await fetch(searchUrl);
          const data = await res.json();

          const items = Array.isArray(data) ? data : data.data || [];
          const formattedOptions = items.map((item: any) => ({
            label: item.label || item.name || item.value || String(item),
            inputValue: item.value || item.label || item.name || String(item),
          }));
          setOptions(formattedOptions);
        } catch (error) {
          console.error('Failed to search options:', error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [url],
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const autocompleteValue = useMemo(() => {
    if (multiple) {
      const valueArray = (value as string[]) ?? [];
      // 对于 freeSolo 模式，需要将不在 options 中的值也转换为对象
      return valueArray.map((val) => {
        const existingOption = options.find((opt) => opt.inputValue === val);
        if (existingOption) {
          return existingOption;
        }
        // freeSolo 模式：创建临时选项对象
        return {
          label: val,
          inputValue: val,
        };
      });
    }
    if (!value) {
      return null;
    }
    // 单选模式：优先从 options 查找，找不到则创建临时对象（freeSolo）
    const existingOption = options.find((opt) => opt.inputValue === value);
    if (existingOption) {
      return existingOption;
    }
    // freeSolo 模式：返回临时对象
    return {
      label: value as string,
      inputValue: value as string,
    };
  }, [value, multiple, options]);

  const onGetOptionLabel = useCallback(
    (option: string | AutoCompleteOption): string => {
      if (typeof option === 'string') {
        return option;
      }
      return option.label || '';
    },
    [],
  );

  const onIsOptionEqualToValue = useCallback(
    (
      option: string | AutoCompleteOption,
      value: string | AutoCompleteOption,
    ): boolean => {
      if (!option || !value) {
        return false;
      }
      if (typeof option === 'string' && typeof value === 'string') {
        return option === value;
      }
      return (
        (option as AutoCompleteOption).inputValue ===
        (value as AutoCompleteOption).inputValue
      );
    },
    [],
  );

  const onValueChange = useCallback(
    (_: any, newValue: any) => {
      if (multiple) {
        const items = newValue as Array<string | AutoCompleteOption>;
        const values = items
          .map((item) => (typeof item === 'string' ? item : item.inputValue))
          .filter((v): v is string => !!v);

        // 统计每个值出现的次数
        const valueCounts = new Map<string, number>();
        values.forEach((v) => {
          valueCounts.set(v, (valueCounts.get(v) || 0) + 1);
        });

        // 找出重复出现的值（count > 1），说明用户想 toggle 移除
        const duplicates = Array.from(valueCounts.entries())
          .filter(([_, count]) => count > 1)
          .map(([val]) => val);

        if (duplicates.length > 0) {
          // 有重复值，移除所有重复的值（toggle 行为）
          const uniqueValues = values.filter((v) => !duplicates.includes(v));
          (onFormChange as (newValue: string[]) => void)?.(uniqueValues);
        } else {
          // 无重复，正常去重
          const uniqueValues = Array.from(new Set(values));
          (onFormChange as (newValue: string[]) => void)?.(uniqueValues);
        }
      } else if (newValue) {
        const value =
          typeof newValue === 'string'
            ? newValue
            : (newValue as AutoCompleteOption).inputValue;
        (onFormChange as (newValue: string | null) => void)?.(value || null);
      } else {
        (onFormChange as (newValue: string | null) => void)?.(null);
      }
    },
    [multiple, onFormChange],
  );

  const onInputValueChange = useCallback(
    (_: any, inputValue: string, reason: string) => {
      if (reason === 'input' && url) {
        onSearch(inputValue);
      }
    },
    [url, onSearch],
  );

  return {
    options,
    loading,

    autocompleteValue,

    onValueChange,
    onInputValueChange,
    onGetOptionLabel,
    onIsOptionEqualToValue,
  };
};
