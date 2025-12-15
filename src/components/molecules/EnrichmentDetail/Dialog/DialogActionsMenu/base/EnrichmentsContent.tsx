import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, memo } from 'react';

import { StyledProviderBadges } from './StyledProviderBadges';

import { StyledActionItem, StyledCollapseMenuContainer } from '../../Common';

import type {
  EnrichmentItem,
  SuggestionItem,
} from '@/types/enrichment/drawerActions';

export interface EnrichmentsContentProps {
  enrichments: EnrichmentItem[];
  onItemClick: (action: SuggestionItem) => void;
}

export const EnrichmentsContent: FC<EnrichmentsContentProps> = memo(
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
