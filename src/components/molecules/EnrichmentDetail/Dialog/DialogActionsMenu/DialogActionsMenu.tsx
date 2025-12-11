import { Box, Divider, Icon, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { StyledTextField } from '@/components/atoms';
import { StyledProviderBadges, StyledTabButton } from './base';

import { EXPORTS_MENUS } from './data';
import { useActionsMenuSearch } from './hooks';

import { StyledActionItem, StyledCollapseMenuContainer } from '../Common';

import {
  ActiveTypeEnum,
  useProspectTableStore,
  useWorkEmailStore,
} from '@/stores/enrichment';

import { TableColumnMenuActionEnum } from '@/types/enrichment/table';
import { ActionsTypeKeyEnum } from '@/types';

import ICON_ARROW_LINE_RIGHT from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_arrow_line_right.svg';
import ICON_LIGHTING from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_lighting.svg';
import ICON_SHARE from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_share.svg';
import ICON_SUGGESTION_BLUE from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_suggestions_blue.svg';
import ICON_TARGET from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_target.svg';
import ICON_SPARK from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle.svg';
import ICON_SPARK_BLACK from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle_outline.svg';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';
import { Search } from '@mui/icons-material';
import { useGeneratePrompt } from '@/hooks/useGeneratePrompt';

type TabType = 'suggestions' | 'enrichments' | 'exports';

export const DialogActionsMenu: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('suggestions');
  const closeDialog = useProspectTableStore((state) => state.closeDialog);
  const openDialog = useProspectTableStore((state) => state.openDialog);
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
  } = useWorkEmailStore(
    useShallow((state) => ({
      setActiveType: state.setActiveType,
      setDialogHeaderName: state.setDialogHeaderName,
      setWaterfallDescription: state.setWaterfallDescription,
      setAllIntegrations: state.setAllIntegrations,
      setValidationOptions: state.setValidationOptions,
    })),
  );

  const { debouncedSetSearch, hasSearchValue, resetSearch, searchResults } =
    useActionsMenuSearch(enrichments);

  const onTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const onClickToClose = () => {
    closeDialog();
    resetSearch();
    setActiveTab('suggestions');
  };

  // const { generatePrompt: generateJson } = useGeneratePrompt(
  //   setSchemaStr,
  //   (objStr) => {
  //     setIsLoading(false);
  //     setSchemaJson(objStr);
  //     setTimeout(() => {
  //       setTab('configure');
  //     }, 0);
  //   },
  // );
  // const { generatePrompt, isThinking } = useGeneratePrompt(
  //   setText,
  //   async (text) => {
  //     setPrompt(text);
  //     await generateJson('/sdr/ai/generate', {
  //       module: 'JSON_SCHEMA_WITH_PROMPT',
  //       params: {
  //         prompt: text,
  //       },
  //     });
  //   },
  // );

  return (
    <Stack
      gap={1.5}
      sx={{
        bgcolor: 'white',
        width: '100%',
        height: '100%',
        px: 3,
      }}
    >
      {/* Header */}
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
          onClick={onClickToClose}
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
          <Icon
            component={ICON_ARROW_LINE_RIGHT}
            sx={{ width: 20, height: 20 }}
          />
        </Box>
      </Stack>

      <StyledTextField
        onChange={(e) => {
          debouncedSetSearch(e.target.value);
        }}
        placeholder={'Search...'}
        size={'small'}
        slotProps={{
          input: {
            startAdornment: (
              <Search sx={{ fontSize: 20, color: 'text.secondary' }} />
            ),
          },
        }}
      />

      {hasSearchValue ? (
        <Stack flex={1} gap={1.5} minHeight={0} overflow={'auto'} pb={1.75}>
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
                    item.source === 'enrichments' &&
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
                    item.source === 'enrichments' ? (
                      <Image
                        alt={'Provider'}
                        height={16}
                        src={item.logoUrl}
                        width={16}
                      />
                    ) : (
                      <Icon
                        component={(item as any).icon}
                        sx={{ width: 16, height: 16 }}
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
          <Stack flexDirection={'row'} gap={1.25}>
            <StyledTabButton
              icon={
                <Icon component={ICON_TARGET} sx={{ width: 20, height: 20 }} />
              }
              isActive={activeTab === 'suggestions'}
              label={'Suggestions'}
              onClick={() => onTabClick('suggestions')}
            />
            <StyledTabButton
              icon={
                <Icon
                  component={ICON_LIGHTING}
                  sx={{ width: 20, height: 20 }}
                />
              }
              isActive={activeTab === 'enrichments'}
              label={'Enrichments'}
              onClick={() => onTabClick('enrichments')}
            />
            <StyledTabButton
              icon={
                <Icon component={ICON_SHARE} sx={{ width: 20, height: 20 }} />
              }
              isActive={activeTab === 'exports'}
              label={'Exports'}
              onClick={() => onTabClick('exports')}
            />
          </Stack>
          <Divider sx={{ borderColor: 'border.default' }} />
          {/* <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon />
        <Typography variant={'body3'}>View all enrichments</Typography>
      </Stack> */}

          {/* Content */}
          <Stack flex={1} gap={1.5} minHeight={0} overflow={'auto'} pb={1.75}>
            {activeTab === 'suggestions' && (
              <>
                {/* Suggestions Section */}
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
                      {(suggestionsLoading
                        ? Array(6).fill(null)
                        : suggestions.slice(0, 6)
                      ).map((item, index) => (
                        <StyledActionItem
                          badges={
                            item?.waterfallConfigs?.length && (
                              <StyledProviderBadges
                                maxCount={3}
                                providers={(item?.waterfallConfigs ?? []).map(
                                  (config: { logoUrl: string }) =>
                                    config.logoUrl,
                                )}
                              />
                            )
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
                          loading={suggestionsLoading}
                          onClick={() => {
                            if (item?.key === ActionsTypeKeyEnum.ai_template) {
                              alert(ActionsTypeKeyEnum.ai_template);
                            }
                            openDialog(TableColumnMenuActionEnum.work_email);
                            setDialogHeaderName(item?.name ?? '');
                            setWaterfallDescription(item?.description ?? '');
                            setActiveType(ActiveTypeEnum.add);
                            setAllIntegrations(item?.waterfallConfigs ?? []);
                            setValidationOptions(item?.validations ?? null);
                          }}
                          title={item?.name ?? ''}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </StyledCollapseMenuContainer>

                {/* Atlas Intelligence Section */}
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
                    onClick={() =>
                      openDialog(TableColumnMenuActionEnum.web_research)
                    }
                    title={'Describe Atlas your task'}
                  />
                </StyledCollapseMenuContainer>
              </>
            )}

            {activeTab === 'enrichments' && (
              <Stack gap={1.5}>
                {enrichments.map((item, index) => (
                  <StyledCollapseMenuContainer
                    key={item?.categoryKey ?? `enrichment-${index}`}
                    title={item?.categoryName ?? ''}
                  >
                    <Stack gap={1.5}>
                      {(item?.actions ?? []).map((action, actionIndex) => (
                        <StyledActionItem
                          badges={
                            action?.waterfallConfigs?.length && (
                              <StyledProviderBadges
                                maxCount={3}
                                providers={(action?.waterfallConfigs ?? []).map(
                                  (config: { logoUrl: string }) =>
                                    config.logoUrl,
                                )}
                              />
                            )
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
                          onClick={() => {
                            if (
                              action?.key === ActionsTypeKeyEnum.ai_template
                            ) {
                              alert(ActionsTypeKeyEnum.ai_template);
                            }
                            openDialog(TableColumnMenuActionEnum.work_email);
                            setDialogHeaderName(action?.name ?? '');
                            setWaterfallDescription(action?.description ?? '');
                            setActiveType(ActiveTypeEnum.add);
                            setAllIntegrations(action?.waterfallConfigs ?? []);
                            setValidationOptions(action?.validations ?? null);
                          }}
                          title={action?.name ?? ''}
                        />
                      ))}
                    </Stack>
                  </StyledCollapseMenuContainer>
                ))}
              </Stack>
            )}

            {activeTab === 'exports' && (
              <Stack gap={1.5}>
                {EXPORTS_MENUS.map((item, index) => (
                  <StyledActionItem
                    description={item.description}
                    icon={
                      <Icon
                        component={item.icon}
                        sx={{ width: 16, height: 16 }}
                      />
                    }
                    key={`export-${index}`}
                    onClick={() => {}}
                    title={item.title}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
