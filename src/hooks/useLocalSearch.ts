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

  // 防抖设置搜索值
  const debouncedSetSearch = useMemo(() => {
    return debounce((value: string) => {
      setSearchValue(value);
    }, 300);
  }, []);

  // Fuse.js 搜索实例
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ['name', 'description'],
        threshold: 0.4,
        includeScore: true,
      }),
    [items],
  );

  // 搜索结果
  const searchResults = useMemo(() => {
    if (searchValue.trim() === '') {
      return [] as T[];
    }

    const fuseResults = fuse.search(searchValue);

    // 如果需要保持原始顺序，则按照原始数组的顺序重新排序
    if (options?.preserveOriginalOrder) {
      const matchedItems = new Set(fuseResults.map((result) => result.item));
      return items.filter((item) => matchedItems.has(item));
    }

    // 默认按照相关度排序
    return fuseResults.map((result) => result.item);
  }, [fuse, searchValue, items, options?.preserveOriginalOrder]);

  // 是否有搜索内容
  const hasSearchValue = searchValue.trim() !== '';

  // 重置搜索
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
