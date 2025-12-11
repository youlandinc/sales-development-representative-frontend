import {
  Box,
  Divider,
  Fade,
  Icon,
  Stack,
  SxProps,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { FC, memo, useCallback, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { StyledTextField } from '@/components/atoms';
import { StyledProviderBadges, StyledTabButton } from './base';

import { useActionsMenuSearch, useExport } from './hooks';

import { StyledActionItem, StyledCollapseMenuContainer } from '../Common';

import {
  ActiveTypeEnum,
  useProspectTableStore,
  useWebResearchStore,
  useWorkEmailStore,
} from '@/stores/enrichment';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';

import { TableColumnMenuActionEnum } from '@/types/enrichment/table';
import { ActionsTypeKeyEnum } from '@/types';

import ICON_ARROW_LINE_RIGHT from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_arrow_line_right.svg';
import ICON_LIGHTING from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_lighting.svg';
import ICON_SHARE from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_share.svg';
import ICON_SUGGESTION_BLUE from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_suggestions_blue.svg';
import ICON_TARGET from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_target.svg';
import ICON_SPARK from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle.svg';
import ICON_SPARK_BLACK from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle_outline.svg';
import ICON_SEARCH from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_search.svg';
import ICON_CLOSE from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_close.svg';

import type {
  EnrichmentItem,
  SuggestionItem,
} from '@/types/enrichment/drawerActions';
import type {
  IntegrationAction,
  IntegrationActionValidation,
} from '@/types/enrichment/integrations';

// ============ Types ============
type TabType = 'suggestions' | 'enrichments' | 'exports';

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

// ============ Sub Components ============
interface DialogHeaderProps {
  onClose: () => void;
}
interface TabsBarProps {
  activeTab: TabType;
  onTabClick: (tab: TabType) => void;
}
interface SuggestionsContentProps {
  suggestions: SuggestionItem[];
  loading: boolean;
  onItemClick: (item: SuggestionItem) => void;
  onAtlasClick: () => void;
}
interface EnrichmentsContentProps {
  enrichments: EnrichmentItem[];
  onItemClick: (action: SuggestionItem) => void;
}

const DialogHeader: FC<DialogHeaderProps> = memo(({ onClose }) => (
  <Stack
    alignItems={'center'}
    flexDirection={'row'}
    justifyContent={'space-between'}
    pt={3}
  >
    <Typography fontSize={16} fontWeight={600} lineHeight={1.2}>
      Actions
    </Typography>
    <Box
      onClick={onClose}
      sx={{
        border: '1px solid',
        borderColor: 'border.default',
        borderRadius: 2,
        p: 0.75,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'background.active',
        },
      }}
    >
      <Icon component={ICON_ARROW_LINE_RIGHT} sx={{ width: 20, height: 20 }} />
    </Box>
  </Stack>
));

const TabsBar: FC<TabsBarProps> = memo(({ activeTab, onTabClick }) => (
  <Stack flexDirection={'row'} gap={1.25}>
    <StyledTabButton
      icon={<Icon component={ICON_TARGET} sx={{ width: 20, height: 20 }} />}
      isActive={activeTab === 'suggestions'}
      label={'Suggestions'}
      onClick={() => onTabClick('suggestions')}
    />
    <StyledTabButton
      icon={<Icon component={ICON_LIGHTING} sx={{ width: 20, height: 20 }} />}
      isActive={activeTab === 'enrichments'}
      label={'Enrichments'}
      onClick={() => onTabClick('enrichments')}
    />
    <StyledTabButton
      icon={<Icon component={ICON_SHARE} sx={{ width: 20, height: 20 }} />}
      isActive={activeTab === 'exports'}
      label={'Exports'}
      onClick={() => onTabClick('exports')}
    />
  </Stack>
));

const SuggestionsContent: FC<SuggestionsContentProps> = memo(
  ({ suggestions, loading, onItemClick, onAtlasClick }) => {
    const displayItems = useMemo(
      () => (loading ? Array(6).fill(null) : suggestions.slice(0, 6)),
      [loading, suggestions],
    );

    return (
      <>
        <StyledCollapseMenuContainer
          gap={1}
          icon={ICON_SUGGESTION_BLUE}
          title={'Suggestions'}
        >
          <Stack gap={1.5}>
            <Typography color={'text.secondary'} variant={'body3'}>
              Tasks Atlas recommends based on your current table
            </Typography>
            <Stack gap={1.5}>
              {displayItems.map((item, index) => (
                <StyledActionItem
                  badges={
                    item?.waterfallConfigs?.length ? (
                      <StyledProviderBadges
                        maxCount={3}
                        providers={(item.waterfallConfigs ?? []).map(
                          (config: { logoUrl: string }) => config.logoUrl,
                        )}
                      />
                    ) : undefined
                  }
                  description={
                    item?.shortDescription ?? item?.description ?? ''
                  }
                  icon={
                    <Image
                      alt={'Provider'}
                      height={16}
                      src={item?.logoUrl ?? ''}
                      width={16}
                    />
                  }
                  key={`suggestion-${index}`}
                  loading={loading}
                  onClick={() => onItemClick(item)}
                  title={item?.name ?? ''}
                />
              ))}
            </Stack>
          </Stack>
        </StyledCollapseMenuContainer>

        <StyledCollapseMenuContainer
          icon={ICON_SPARK}
          title={
            <Typography fontSize={14} fontWeight={600} lineHeight={1.2}>
              Atlas Intelligence
            </Typography>
          }
        >
          <StyledActionItem
            description={
              'Atlas handles custom research, data cleaning, and reasoning from free-form instructions.'
            }
            icon={
              <Icon
                component={ICON_SPARK_BLACK}
                sx={{ width: 20, height: 20 }}
              />
            }
            onClick={onAtlasClick}
            title={'Describe Atlas your task'}
          />
        </StyledCollapseMenuContainer>
      </>
    );
  },
);

const EnrichmentsContent: FC<EnrichmentsContentProps> = memo(
  ({ enrichments, onItemClick }) => (
    <Stack gap={1.5}>
      {enrichments.map((item, index) => (
        <StyledCollapseMenuContainer
          key={item?.categoryKey ?? `enrichment-${index}`}
          title={
            <Typography fontSize={14} fontWeight={500} lineHeight={1.4}>
              {item?.categoryName ?? ''}
            </Typography>
          }
        >
          <Stack gap={1.5}>
            {(item?.actions ?? []).map((action, actionIndex) => (
              <StyledActionItem
                badges={
                  action?.waterfallConfigs?.length ? (
                    <StyledProviderBadges
                      maxCount={3}
                      providers={(action.waterfallConfigs ?? []).map(
                        (config: { logoUrl: string }) => config.logoUrl,
                      )}
                    />
                  ) : undefined
                }
                description={action?.description ?? ''}
                icon={
                  <Image
                    alt={'Provider'}
                    height={16}
                    src={action?.logoUrl ?? ''}
                    width={16}
                  />
                }
                key={`action-${index}-${actionIndex}`}
                onClick={() => onItemClick(action)}
                title={action?.name ?? ''}
              />
            ))}
          </Stack>
        </StyledCollapseMenuContainer>
      ))}
    </Stack>
  ),
);

const ExportsContent: FC = memo(() => {
  const { EXPORTS_MENUS } = useExport();
  return (
    <Stack gap={1.5}>
      {EXPORTS_MENUS.map((item, index) => (
        <StyledActionItem
          description={item.description}
          icon={<Icon component={item.icon} sx={{ width: 16, height: 16 }} />}
          key={`export-${index}`}
          onClick={item.onClick}
          title={item.title}
        />
      ))}
    </Stack>
  );
});

// ============ Main Component ============

export const DialogActionsMenu: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('suggestions');

  // Store selectors
  const { closeDialog, openDialog, columns } = useProspectTableStore(
    useShallow((state) => ({
      closeDialog: state.closeDialog,
      openDialog: state.openDialog,
      columns: state.columns,
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

  const { runGeneratePrompt, setGenerateText, setGenerateSchemaStr, allClear } =
    useWebResearchStore(
      useShallow((state) => ({
        runGeneratePrompt: state.runGeneratePrompt,
        setGenerateText: state.setGenerateText,
        setGenerateSchemaStr: state.setGenerateSchemaStr,
        allClear: state.allClear,
      })),
    );

  const {
    debouncedSetSearch,
    hasSearchValue,
    resetSearch,
    searchResults,
    text,
    setText,
  } = useActionsMenuSearch(enrichments, suggestions);

  // Memoized column names
  const columnNames = useMemo(
    () => columns.map((item) => item.fieldName).join(','),
    [columns],
  );

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
      await runGeneratePrompt('/sdr/ai/generate', {
        module: 'COLUMN_ENRICHMENT_PROMPT',
        params: {
          userInput: templatePrompt,
          columns: columnNames,
        },
      });
    },
    [
      allClear,
      columnNames,
      openDialog,
      runGeneratePrompt,
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
        onClickToAiTemplate(`Name:${item.name}Description:${description}`);
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
                    item.logoUrl && (
                      <Image
                        alt={item.logoUrl}
                        height={16}
                        src={item.logoUrl}
                        width={16}
                      />
                    )
                  }
                  key={`search-${index}`}
                  onClick={item.onClick}
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
