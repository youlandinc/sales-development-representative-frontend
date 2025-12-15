import { debounce } from '@mui/material';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

export interface SearchItemType {
  name: string;
  description: string;
}

export const useLocalSearch = <T extends SearchItemType>(items: T[]) => {
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
    return fuse.search(searchValue).map((result) => result.item);
  }, [fuse, searchValue]);

  // 是否有搜索内容
  const hasSearchValue = searchValue.trim() !== '';

  // 重置搜索
  const resetSearch = () => {
    setSearchValue('');
    setText('');
  };

  return {
    searchValue,
    debouncedSetSearch,
    searchResults,
    hasSearchValue,
    resetSearch,
    text,
    setText,
  };
};
