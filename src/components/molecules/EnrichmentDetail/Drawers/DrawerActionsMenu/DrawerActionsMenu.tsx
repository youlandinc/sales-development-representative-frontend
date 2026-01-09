import { Divider, Stack, SxProps, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

import { StyledTextField } from '@/components/atoms';
import { StyledActionItem } from '@/components/molecules/EnrichmentDetail/Drawers/Common';
import {
  ActionsMenuHeader,
  EnrichmentsContent,
  ExportsContent,
  StyledProviderBadges,
  SuggestionsContent,
  TabsBar,
} from './base';

import { useLocalSearch } from '@/components/molecules/EnrichmentDetail/hooks';
import { useDrawerActionsMenu, useExport } from './hooks';

import {
  useEnrichmentTableStore,
  useWebResearchStore,
} from '@/stores/enrichment';
import {
  TabTypeEnum,
  useActionsStore,
} from '@/stores/enrichment/useActionsStore';

import type { SuggestionItem } from '@/types/enrichment/drawerActions';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

import { DrawersIconConfig } from '../DrawersIconConfig';
import { DialogExportInProgress } from './base/DialogExportInProgress';

// ============ Styles ============

const scrollContainerStyles: SxProps = {
  flex: 1,
  gap: 1.5,
  minHeight: 0,
  overflow: 'auto',
  pb: 1.75,
};

// ============ Main Component ============
interface DrawerActionsMenuProps {
  tableId: string;
}

export const DrawerActionsMenu: FC<DrawerActionsMenuProps> = ({ tableId }) => {
  const { EXPORTS_MENUS, visible, close } = useExport();

  // Store selectors
  const { closeDialog, openDialog } = useEnrichmentTableStore(
    useShallow((state) => ({
      closeDialog: state.closeDialog,
      openDialog: state.openDialog,
    })),
  );

  const { suggestions, suggestionsLoading, enrichments, tabType, setTabType } =
    useActionsStore(
      useShallow((store) => ({
        suggestions: store.suggestionsList,
        suggestionsLoading: store.suggestionsLoading,
        enrichments: store.enrichmentsList,
        tabType: store.tabType,
        setTabType: store.setTabType,
      })),
    );

  const { allClear } = useWebResearchStore(
    useShallow((state) => ({
      allClear: state.allClear,
    })),
  );

  const { onItemClick } = useDrawerActionsMenu();

  // 扁平化所有可搜索项目
  const flatSearchItems = useMemo(() => {
    const items: (SuggestionItem & { icon?: any; onClick?: () => void })[] = [];

    // 添加 enrichments 数据
    enrichments.forEach((group) => {
      group.actions.forEach((item) => {
        items.push(item);
      });
    });

    // 添加 suggestions 数据
    suggestions.forEach((item) => {
      items.push(item);
    });

    // 添加 exports 数据
    EXPORTS_MENUS.forEach((item) => {
      items.push({
        actionKey: `export-${item.title}`,
        key: `export-${item.title}`,
        name: item.title,
        description: item.description,
        logoUrl: '',
        estimatedScore: '',
        shortDescription: null,
        waterfallConfigs: [],
        validations: null,
        icon: item.icon,
        onClick: item.onClick,
      });
    });
    // 按 name 去重，过滤掉空项
    return Array.from(
      new Map(
        items.filter((item) => Boolean(item)).map((item) => [item.name, item]),
      ).values(),
    );
  }, [enrichments, suggestions, EXPORTS_MENUS]);

  const {
    debouncedSetSearch,
    hasSearchValue,
    resetSearch,
    searchResults,
    text,
    setText,
  } = useLocalSearch<SuggestionItem & { icon?: any; onClick?: () => void }>(
    flatSearchItems,
  );

  // Event handlers with useCallback
  const onTabClick = useCallback(
    (tab: TabTypeEnum) => {
      setTabType(tab);
    },
    [setTabType],
  );

  const onClickToClose = useCallback(() => {
    closeDialog();
    resetSearch();
    allClear();
    setTabType(TabTypeEnum.suggestions);
  }, [closeDialog, resetSearch, allClear, setTabType]);

  const onAtlasClick = useCallback(() => {
    openDialog(TableColumnMenuActionEnum.ai_agent);
  }, [openDialog]);

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setText(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch, setText],
  );

  // Search input adornment (memoized to prevent re-renders)
  const searchAdornment = useMemo(
    () => <DrawersIconConfig.ActionMenuSearch size={20} sx={{ mr: '4px' }} />,
    [],
  );
  const clearEndAdornment = useMemo(
    () => (
      <DrawersIconConfig.Close
        className={'icon_clear'}
        onClick={() => resetSearch()}
        size={20}
        sx={{ width: 0, cursor: 'pointer' }}
      />
    ),
    [resetSearch],
  );

  return (
    <Stack gap={1.5} sx={{ bgcolor: 'white', width: '100%', height: '100%' }}>
      <Stack gap={1.5} px={3}>
        <ActionsMenuHeader onClose={onClickToClose} />
        <StyledTextField
          onChange={onSearchChange}
          placeholder={'Search...'}
          size={'small'}
          slotProps={{
            input: {
              startAdornment: searchAdornment,
              endAdornment: clearEndAdornment,
            },
          }}
          sx={{
            '&:hover .icon_clear': {
              width: 20,
            },
          }}
          value={text}
        />
      </Stack>

      {hasSearchValue ? (
        <Stack sx={scrollContainerStyles}>
          {searchResults.length === 0 ? (
            <Typography
              color={'text.secondary'}
              fontSize={12}
              textAlign={'center'}
            >
              No results found.
            </Typography>
          ) : (
            <Stack flex={1} gap={1.5} minHeight={0} overflow={'auto'} px={3}>
              {searchResults.map((item, index) => (
                <StyledActionItem
                  badges={
                    (item.waterfallConfigs?.length ?? 0) > 0 ? (
                      <StyledProviderBadges
                        maxCount={3}
                        providers={(item.waterfallConfigs ?? []).map(
                          (config) => config.logoUrl,
                        )}
                      />
                    ) : undefined
                  }
                  description={item.description}
                  icon={
                    item.logoUrl ? (
                      <Image
                        alt={item.logoUrl}
                        height={16}
                        src={item.logoUrl}
                        width={16}
                      />
                    ) : (
                      item.icon && (
                        <item.icon style={{ width: 16, height: 16 }} />
                      )
                    )
                  }
                  key={`search-${index}`}
                  onClick={() =>
                    item?.onClick ? item?.onClick() : onItemClick(item)
                  }
                  title={item.name}
                />
              ))}
            </Stack>
          )}
        </Stack>
      ) : (
        <Stack flex={1} gap={1.5} minHeight={0}>
          <Stack gap={1.5} px={3}>
            <TabsBar activeTab={tabType} onTabClick={onTabClick} />
            <Divider sx={{ borderColor: 'border.default' }} />
          </Stack>

          <Stack px={3} sx={scrollContainerStyles}>
            {tabType === TabTypeEnum.suggestions && (
              <SuggestionsContent
                loading={suggestionsLoading}
                onAtlasClick={onAtlasClick}
                onItemClick={onItemClick}
                suggestions={suggestions}
              />
            )}

            {tabType === TabTypeEnum.enrichments && (
              <EnrichmentsContent
                enrichments={enrichments}
                onItemClick={onItemClick}
              />
            )}

            {tabType === TabTypeEnum.exports && (
              <ExportsContent tableId={tableId} />
            )}
          </Stack>
        </Stack>
      )}
      <DialogExportInProgress
        onClose={close}
        open={visible}
        tableId={tableId}
      />
    </Stack>
  );
};
