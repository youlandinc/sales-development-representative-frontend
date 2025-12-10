import { debounce } from '@mui/material';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

import { EXPORTS_MENUS } from '../data';

export interface SearchItemType {
  name: string;
  description: string;
  logoUrl: string;
  waterfallConfigs: Array<{ logoUrl: string }>;
  onClick: () => void;
  source: 'enrichments' | 'exports';
  icon?: any;
}

export interface EnrichmentGroupType {
  title: string;
  list: Array<{
    name: string;
    description: string;
    logoUrl: string;
    waterfallConfigs: Array<{ logoUrl: string }>;
    onClick: () => void;
  }>;
}

export const useActionsMenuSearch = (
  enrichmentGroups: EnrichmentGroupType[],
) => {
  const [searchValue, setSearchValue] = useState<string>('');

  // 防抖设置搜索值
  const debouncedSetSearch = useMemo(() => {
    return debounce((value: string) => {
      setSearchValue(value);
    }, 300);
  }, []);

  // 扁平化所有可搜索项目
  const flatSearchItems = useMemo(() => {
    const items: SearchItemType[] = [];

    // 添加 enrichments 数据
    enrichmentGroups.forEach((group) => {
      group.list.forEach((item) => {
        items.push({
          ...item,
          source: 'enrichments',
        });
      });
    });

    // 添加 exports 数据
    EXPORTS_MENUS.forEach((item) => {
      items.push({
        name: item.title,
        description: item.description,
        logoUrl: '',
        waterfallConfigs: [],
        onClick: () => {},
        source: 'exports',
        icon: item.icon,
      });
    });

    return items;
  }, [enrichmentGroups]);

  // Fuse.js 搜索实例
  const fuse = useMemo(
    () =>
      new Fuse(flatSearchItems, {
        keys: ['name', 'description'],
        threshold: 0.4,
        includeScore: true,
      }),
    [flatSearchItems],
  );

  // 搜索结果
  const searchResults = useMemo(() => {
    if (searchValue.trim() === '') {
      return [];
    }
    return fuse.search(searchValue).map((result) => result.item);
  }, [fuse, searchValue]);

  // 是否有搜索内容
  const hasSearchValue = searchValue.trim() !== '';

  // 重置搜索
  const resetSearch = () => {
    setSearchValue('');
  };

  return {
    searchValue,
    debouncedSetSearch,
    searchResults,
    hasSearchValue,
    resetSearch,
  };
};
