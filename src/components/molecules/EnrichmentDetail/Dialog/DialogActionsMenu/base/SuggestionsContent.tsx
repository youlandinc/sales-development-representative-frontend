import { Icon, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, memo, useMemo } from 'react';

import { StyledProviderBadges } from './StyledProviderBadges';

import { StyledActionItem, StyledCollapseMenuContainer } from '../../Common';

import ICON_SUGGESTION_BLUE from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_suggestions_blue.svg';
import ICON_SPARK from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle.svg';
import ICON_SPARK_BLACK from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle_outline.svg';

import type { SuggestionItem } from '@/types/enrichment/drawerActions';

export interface SuggestionsContentProps {
  suggestions: SuggestionItem[];
  loading: boolean;
  onItemClick: (item: SuggestionItem) => void;
  onAtlasClick: () => void;
}

export const SuggestionsContent: FC<SuggestionsContentProps> = memo(
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
