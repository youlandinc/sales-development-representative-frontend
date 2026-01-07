import { debounce } from '@mui/material';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

export interface SearchItemType {
  name: string;
  description: string;
}

export const useLocalSearch = <T extends SearchItemType>(
  items: T[],
  options?: { preserveOriginalOrder?: boolean },
) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [text, setText] = useState('');

  // Debounced search value setter
  const debouncedSetSearch = useMemo(() => {
    return debounce((value: string) => {
      setSearchValue(value);
    }, 300);
  }, []);

  // Fuse.js search instance
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ['name', 'description'],
        threshold: 0.4,
        includeScore: true,
      }),
    [items],
  );

  // Search results
  const searchResults = useMemo(() => {
    if (searchValue.trim() === '') {
      return [] as T[];
    }

    const fuseResults = fuse.search(searchValue);

    // If preserveOriginalOrder is true, sort by original array order
    if (options?.preserveOriginalOrder) {
      const matchedItems = new Set(fuseResults.map((result) => result.item));
      return items.filter((item) => matchedItems.has(item));
    }

    // Default: sort by relevance
    return fuseResults.map((result) => result.item);
  }, [fuse, searchValue, items, options?.preserveOriginalOrder]);

  // Whether has search content
  const hasSearchValue = searchValue.trim() !== '';

  // Reset search
  const resetSearch = () => {
    setSearchValue('');
    setText('');
  };

  const onTextChange = (value: string) => {
    setText(value);
    debouncedSetSearch(value);
  };

  return {
    searchValue,
    debouncedSetSearch,
    searchResults,
    hasSearchValue,
    resetSearch,
    text,
    setText,
    onTextChange,
  };
};
