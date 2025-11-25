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

  // Initialize static options when no URL provided
  useEffect(() => {
    if (!url && staticOptions.length > 0) {
      const formattedOptions = staticOptions.map((item) => ({
        label: item.label,
        inputValue: ('value' in item ? item.value : item.label) || item.label,
      }));
      setOptions(formattedOptions);
    }
  }, [url, staticOptions]);

  /**
   * Search options via API with debouncing (300ms)
   * Only triggers when input length >= 2
   */
  const onSearch = useCallback(
    async (inputValue: string) => {
      if (!url) {
        return;
      }

      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Clear options if input is too short
      if (!inputValue || inputValue.length < 2) {
        setOptions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Debounce: Execute search after 300ms
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

  // Cleanup: Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Convert value to autocomplete option format
   * Supports freeSolo mode: creates temporary objects for values not in options
   */
  const autocompleteValue = useMemo(() => {
    if (multiple) {
      const valueArray = (value as string[]) ?? [];
      // For freeSolo mode, convert values not in options to objects
      return valueArray.map((val) => {
        const existingOption = options.find((opt) => opt.inputValue === val);
        if (existingOption) {
          return existingOption;
        }
        // FreeSolo mode: Create temporary option object
        return {
          label: val,
          inputValue: val,
        };
      });
    }
    if (!value) {
      return null;
    }
    // Single mode: Find in options first, create temporary object if not found (freeSolo)
    const existingOption = options.find((opt) => opt.inputValue === value);
    if (existingOption) {
      return existingOption;
    }
    // FreeSolo mode: Return temporary object
    return {
      label: value as string,
      inputValue: value as string,
    };
  }, [value, multiple, options]);

  /**
   * Get display label for option
   * Handles both string and object formats
   */
  const onGetOptionLabel = useCallback(
    (option: string | AutoCompleteOption): string => {
      if (typeof option === 'string') {
        return option;
      }
      return option.label || '';
    },
    [],
  );

  /**
   * Check if two options are equal
   * Compares by inputValue for objects, direct comparison for strings
   */
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

  /**
   * Handle value change
   * Multiple mode: Supports toggle behavior (clicking selected item removes it)
   * Single mode: Updates with new value or null
   */
  const onValueChange = useCallback(
    (_: any, newValue: any) => {
      if (multiple) {
        const items = newValue as Array<string | AutoCompleteOption>;
        const values = items
          .map((item) => (typeof item === 'string' ? item : item.inputValue))
          .filter((v): v is string => !!v);

        // Count occurrences of each value
        const valueCounts = new Map<string, number>();
        values.forEach((v) => {
          valueCounts.set(v, (valueCounts.get(v) || 0) + 1);
        });

        // Find duplicates (count > 1), indicating user wants to toggle/remove
        const duplicates = Array.from(valueCounts.entries())
          .filter(([_, count]) => count > 1)
          .map(([val]) => val);

        if (duplicates.length > 0) {
          // Has duplicates, remove all duplicate values (toggle behavior)
          const uniqueValues = values.filter((v) => !duplicates.includes(v));
          (onFormChange as (newValue: string[]) => void)?.(uniqueValues);
        } else {
          // No duplicates, normal deduplication
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

  /**
   * Handle input value change
   * Triggers search only when reason is 'input' and URL is provided
   */
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
