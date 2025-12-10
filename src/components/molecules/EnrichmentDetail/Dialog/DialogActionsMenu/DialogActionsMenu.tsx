import { Box, Divider, Icon, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, useMemo, useState } from 'react';

import { StyledProviderBadges, StyledTabButton } from './base';
import { StyledTextField } from '@/components/atoms';

import { EXPORTS_MENUS } from './data';
import { useActionsMenuSearch } from './hooks';

import { StyledActionItem, StyledCollapseMenuContainer } from '../Common';

import { useProspectTableStore } from '@/stores/enrichment';

import { useDialogHeaderActionsHook } from '../DialogHeaderActions/hooks';

import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

import ICON_ARROW_LINE_RIGHT from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_arrow_line_right.svg';
import ICON_LIGHTING from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_lighting.svg';
import ICON_SHARE from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_share.svg';
import ICON_SUGGESTION from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_suggestions.svg';
import ICON_TARGET from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_target.svg';
import ICON_SPARK from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle.svg';
import ICON_SPARK_BLACK from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle_fill.svg';
import SearchIcon from '@mui/icons-material/Search';

type TabType = 'suggestions' | 'enrichments' | 'exports';

export const DialogActionsMenu: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('suggestions');
  const closeDialog = useProspectTableStore((state) => state.closeDialog);
  const openDialog = useProspectTableStore((state) => state.openDialog);

  const { ENRICHMENTS_SUGGESTION_MENUS } = useDialogHeaderActionsHook();

  const ENRICHMENTS_MOCK = useMemo(
    () => [
      {
        title: 'Contact information',
        list: ENRICHMENTS_SUGGESTION_MENUS.children,
      },
    ],
    [ENRICHMENTS_SUGGESTION_MENUS.children],
  );

  const { debouncedSetSearch, hasSearchValue, resetSearch, searchResults } =
    useActionsMenuSearch(ENRICHMENTS_MOCK);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleClose = () => {
    closeDialog();
    resetSearch();
    setActiveTab('suggestions');
  };

  return (
    <Stack
      gap={1.5}
      sx={{
        bgcolor: 'white',

        // borderRadius: 2,
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
          onClick={handleClose}
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
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            ),
          },
        }}
      />

      {/* 如果搜索框中有内容，就只显示搜索结果。如果搜索框没有内容，就显示下面的内容 */}

      {hasSearchValue ? (
        <Stack flex={1} gap={1.5} minHeight={0} overflow={'auto'} pb={1.75}>
          {searchResults.length === 0 ? (
            <Typography
              color={'text.secondary'}
              fontSize={14}
              textAlign={'center'}
            >
              No results found
            </Typography>
          ) : (
            <Stack gap={1.5}>
              {searchResults.map((item, index) => (
                <StyledActionItem
                  badges={
                    item.source === 'enrichments' &&
                    item.waterfallConfigs?.length > 0 ? (
                      <StyledProviderBadges
                        providers={item.waterfallConfigs.map(
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
        <>
          <Stack flexDirection={'row'} gap={1.25}>
            <StyledTabButton
              icon={
                <Icon component={ICON_TARGET} sx={{ width: 20, height: 20 }} />
              }
              isActive={activeTab === 'suggestions'}
              label={'Suggestions'}
              onClick={() => handleTabClick('suggestions')}
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
              onClick={() => handleTabClick('enrichments')}
            />
            <StyledTabButton
              icon={
                <Icon component={ICON_SHARE} sx={{ width: 20, height: 20 }} />
              }
              isActive={activeTab === 'exports'}
              label={'Exports'}
              onClick={() => handleTabClick('exports')}
            />
          </Stack>
          <Divider sx={{ borderColor: 'border.default' }} />
          {/* <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon />
        <Typography variant={'body3'}>View all enrichments</Typography>
      </Stack> */}

          {/* Content */}
          <Stack flex={1} gap={1.5} minHeight={0} overflow={'auto'} pb={1.75}>
            {/* Search and Tabs */}

            {/* Content based on active tab */}
            <Stack flex={1} gap={3} minHeight={0} overflow={'auto'}>
              {activeTab === 'suggestions' && (
                <>
                  {/* Suggestions Section */}
                  <StyledCollapseMenuContainer
                    gap={0.5}
                    icon={ICON_SUGGESTION}
                    title={'Suggestions'}
                  >
                    <Stack gap={1.5}>
                      <Typography variant={'body3'}>
                        Based on your current data, we think these enrichments
                        will be the most useful right now.
                      </Typography>
                      <Stack gap={1.5}>
                        {ENRICHMENTS_SUGGESTION_MENUS.children.map(
                          (item, index) => (
                            <StyledActionItem
                              badges={
                                <StyledProviderBadges
                                  providers={item.waterfallConfigs.map(
                                    (config) => config.logoUrl,
                                  )}
                                />
                              }
                              description={item.description}
                              icon={
                                <Image
                                  alt={'Provider '}
                                  height={16}
                                  src={item.logoUrl}
                                  width={16}
                                />
                              }
                              key={index + 'a'}
                              onClick={item.onClick}
                              title={item.name}
                            />
                          ),
                        )}
                      </Stack>
                    </Stack>
                  </StyledCollapseMenuContainer>

                  {/* Atlas Intelligence Section */}
                  <StyledCollapseMenuContainer
                    icon={ICON_SPARK}
                    title={
                      <Typography
                        color={'#6E4EFB'}
                        fontSize={14}
                        fontWeight={600}
                        lineHeight={1.2}
                      >
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
                  {ENRICHMENTS_MOCK.map((item, index) => (
                    <StyledCollapseMenuContainer
                      key={index + 'c'}
                      title={item.title}
                    >
                      <Stack gap={1.5}>
                        {item.list.map((i, j) => (
                          <StyledActionItem
                            badges={
                              <StyledProviderBadges
                                providers={i.waterfallConfigs.map(
                                  (config) => config.logoUrl,
                                )}
                              />
                            }
                            description={i.description}
                            icon={
                              <Image
                                alt={'Provider '}
                                height={16}
                                src={i.logoUrl}
                                width={16}
                              />
                            }
                            key={j + 'b'}
                            onClick={i.onClick}
                            title={i.name}
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
                      key={index}
                      onClick={() => {
                        return;
                      }}
                      title={item.title}
                    />
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};
