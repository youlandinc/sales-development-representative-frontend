import { Divider, Icon, Stack, SxProps, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, useCallback, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { StyledTextField } from '@/components/atoms';
import {
  DialogHeader,
  EnrichmentsContent,
  ExportsContent,
  StyledProviderBadges,
  SuggestionsContent,
  TabsBar,
  type TabType,
} from './base';
import { StyledActionItem } from '../Common';

import { useExport } from './hooks';
import { useLocalSearch } from '@/hooks';

import {
  ActiveTypeEnum,
  useProspectTableStore,
  useWebResearchStore,
  useWorkEmailStore,
} from '@/stores/enrichment';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';

import { ActionsTypeKeyEnum } from '@/types';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';
import type {
  IntegrationAction,
  IntegrationActionValidation,
} from '@/types/enrichment/integrations';
import type { SuggestionItem } from '@/types/enrichment/drawerActions';

import ICON_SEARCH from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_search.svg';
import ICON_CLOSE from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_close.svg';

// ============ Types ============
interface ActionItemClickParams {
  name: string;
  description: string;
  waterfallConfigs: IntegrationAction[] | null;
  validations: IntegrationActionValidation[] | null;
}

// ============ Styles ============

const scrollContainerStyles: SxProps = {
  flex: 1,
  gap: 1.5,
  minHeight: 0,
  overflow: 'auto',
  pb: 1.75,
};

// ============ Main Component ============

export const DialogActionsMenu: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('suggestions');
  const { EXPORTS_MENUS } = useExport();

  // Store selectors
  const { closeDialog, openDialog } = useProspectTableStore(
    useShallow((state) => ({
      closeDialog: state.closeDialog,
      openDialog: state.openDialog,
    })),
  );

  const { suggestions, suggestionsLoading, enrichments } = useActionsStore(
    useShallow((store) => ({
      suggestions: store.suggestionsList,
      suggestionsLoading: store.suggestionsLoading,
      enrichments: store.enrichmentsList,
    })),
  );

  const {
    setActiveType,
    setDialogHeaderName,
    setWaterfallDescription,
    setAllIntegrations,
    setValidationOptions,
    integrationMenus,
  } = useWorkEmailStore(
    useShallow((state) => ({
      setActiveType: state.setActiveType,
      setDialogHeaderName: state.setDialogHeaderName,
      setWaterfallDescription: state.setWaterfallDescription,
      setAllIntegrations: state.setAllIntegrations,
      setValidationOptions: state.setValidationOptions,
      integrationMenus: state.integrationMenus,
    })),
  );

  const {
    runGenerateAiModel,
    setGenerateText,
    setGenerateSchemaStr,
    allClear,
  } = useWebResearchStore(
    useShallow((state) => ({
      runGenerateAiModel: state.runGenerateAiModel,
      setGenerateText: state.setGenerateText,
      setGenerateSchemaStr: state.setGenerateSchemaStr,
      allClear: state.allClear,
    })),
  );

  // 扁平化所有可搜索项目
  const flatSearchItems = useMemo(() => {
    const items: (SuggestionItem & { icon?: any })[] = [];

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
      });
    });

    // 按 name 去重
    return Array.from(new Map(items.map((item) => [item.name, item])).values());
  }, [enrichments, suggestions, EXPORTS_MENUS]);

  const {
    debouncedSetSearch,
    hasSearchValue,
    resetSearch,
    searchResults,
    text,
    setText,
  } = useLocalSearch<SuggestionItem & { icon?: any }>(flatSearchItems);

  // Event handlers with useCallback
  const onTabClick = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const onClickToClose = useCallback(() => {
    closeDialog();
    resetSearch();
    setActiveTab('suggestions');
  }, [closeDialog, resetSearch]);

  const onClickToAiTemplate = useCallback(
    async (templatePrompt: string) => {
      setGenerateText('');
      setGenerateSchemaStr('');
      allClear();
      openDialog(TableColumnMenuActionEnum.web_research);
      await runGenerateAiModel('/aiResearch/generate/stream', {
        params: {
          userInput: templatePrompt,
        },
      });
    },
    [
      allClear,
      openDialog,
      runGenerateAiModel,
      setGenerateSchemaStr,
      setGenerateText,
    ],
  );

  const onClickToActionItem = useCallback(
    (params: ActionItemClickParams) => {
      openDialog(TableColumnMenuActionEnum.work_email);
      setDialogHeaderName(params.name);
      setWaterfallDescription(params.description);
      setActiveType(ActiveTypeEnum.add);
      setAllIntegrations(params.waterfallConfigs ?? []);
      setValidationOptions(params.validations);
    },
    [
      openDialog,
      setActiveType,
      setAllIntegrations,
      setDialogHeaderName,
      setValidationOptions,
      setWaterfallDescription,
    ],
  );

  const onIntegrationItemClick = useCallback(
    (item: SuggestionItem) => {
      if (item?.key === ActionsTypeKeyEnum.ai_template) {
        const description =
          (item.description ?? '') || (item.shortDescription ?? '');
        onClickToAiTemplate(`Name:${item.name},Description:${description}`);
        return;
      }
      const integration = integrationMenus.find((i) => i.key === item.key);
      onClickToActionItem({
        name: integration?.name ?? '',
        description: integration?.description ?? '',
        waterfallConfigs: integration?.waterfallConfigs ?? null,
        validations: integration?.validations ?? null,
      });
    },
    [onClickToActionItem, onClickToAiTemplate, integrationMenus],
  );

  const onAtlasClick = useCallback(() => {
    openDialog(TableColumnMenuActionEnum.web_research);
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
    () => <Icon component={ICON_SEARCH} sx={{ width: 20, height: 20 }} />,
    [],
  );
  const clearEndAdornment = useMemo(
    () => (
      <Icon
        className={'icon_clear'}
        component={ICON_CLOSE}
        onClick={() => resetSearch()}
        sx={{ height: 20, width: 0, cursor: 'pointer' }}
      />
    ),
    [resetSearch],
  );

  return (
    <Stack
      gap={1.5}
      sx={{ bgcolor: 'white', width: '100%', height: '100%', px: 3 }}
    >
      <DialogHeader onClose={onClickToClose} />

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
            <Stack flex={1} gap={1.5} minHeight={0} overflow={'auto'}>
              {searchResults.map((item, index) => (
                <StyledActionItem
                  badges={
                    (item.waterfallConfigs?.length ?? 0) > 0 ? (
                      <StyledProviderBadges
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
                        <Icon
                          component={item.icon}
                          sx={{ width: 16, height: 16 }}
                        />
                      )
                    )
                  }
                  key={`search-${index}`}
                  onClick={() => onIntegrationItemClick(item)}
                  title={item.name}
                />
              ))}
            </Stack>
          )}
        </Stack>
      ) : (
        <Stack flex={1} gap={1.5} minHeight={0}>
          <TabsBar activeTab={activeTab} onTabClick={onTabClick} />
          <Divider sx={{ borderColor: 'border.default' }} />

          <Stack sx={scrollContainerStyles}>
            {activeTab === 'suggestions' && (
              <SuggestionsContent
                loading={suggestionsLoading}
                onAtlasClick={onAtlasClick}
                onItemClick={onIntegrationItemClick}
                suggestions={suggestions}
              />
            )}

            {activeTab === 'enrichments' && (
              <EnrichmentsContent
                enrichments={enrichments}
                onItemClick={onIntegrationItemClick}
              />
            )}

            {activeTab === 'exports' && <ExportsContent />}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
