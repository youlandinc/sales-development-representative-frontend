import { debounce } from '@mui/material';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

import {
  EnrichmentItem,
  SuggestionItem,
} from '@/types/enrichment/drawerActions';

import { useExport } from '../hooks';

export interface SearchItemType {
  name: string;
  description: string;
  logoUrl: string;
  waterfallConfigs: Array<{ logoUrl: string }> | null;
  onClick?: () => void;
  source: 'enrichments' | 'suggestions' | 'exports';
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const useActionsMenuSearch = (
  enrichmentGroups: EnrichmentItem[],
  suggestionList: SuggestionItem[],
) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [text, setText] = useState('');

  const { EXPORTS_MENUS } = useExport();

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
      group.actions.forEach((item) => {
        items.push({
          ...item,
          source: 'enrichments',
        });
      });
    });

    // 添加 suggestions 数据
    suggestionList.forEach((item) => {
      items.push({ ...item, source: 'suggestions' });
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

    // 按 name 去重
    const uniqueItems = Array.from(
      new Map(items.map((item) => [item.name, item])).values(),
    );
    return uniqueItems;
  }, [EXPORTS_MENUS, enrichmentGroups, suggestionList]);

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
    return fuse
      .search(searchValue)
      .map((result) => result.item) as unknown as SuggestionItem[];
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
