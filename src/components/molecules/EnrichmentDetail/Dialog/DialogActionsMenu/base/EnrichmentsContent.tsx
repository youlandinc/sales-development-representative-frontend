import { Icon, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, memo } from 'react';
import { useShallow } from 'zustand/shallow';

import { StyledProviderBadges } from './StyledProviderBadges';

import {
  StyledActionItem,
  StyledCollapseMenuContainer,
} from '@/components/molecules/EnrichmentDetail/Dialog/Common';

import {
  type EnrichmentItem,
  SourceOfOpenEnum,
  type SuggestionItem,
} from '@/types/enrichment/drawerActions';

import { useActionsStore } from '@/stores/enrichment/useActionsStore';

import ICON_ARROW from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_arrow.svg';

export interface EnrichmentsContentProps {
  enrichments: EnrichmentItem[];
  onItemClick: (action: SuggestionItem) => void;
}

export const EnrichmentsContent: FC<EnrichmentsContentProps> = ({
  enrichments,
  onItemClick,
}) => {
  const { setDialogAllEnrichmentsVisible, setSourceOfOpen } = useActionsStore(
    useShallow((store) => ({
      setDialogAllEnrichmentsVisible: store.setDialogAllEnrichmentsVisible,
      setSourceOfOpen: store.setSourceOfOpen,
      sourceOfOpen: store.sourceOfOpen,
    })),
  );
  const onClickViewAllEnrichments = () => {
    setDialogAllEnrichmentsVisible(true);
    setSourceOfOpen(SourceOfOpenEnum.dialog);
  };

  return (
    <Stack gap={1.5}>
      {/* //TODO */}
      {/* <Stack
        onClick={onClickViewAllEnrichments}
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          cursor: 'pointer',
          gap: '2px',
          width: 'fit-content',
        }}
      >
        <Icon
          component={ICON_ARROW}
          sx={{ width: 12, height: 12, transform: 'rotate(180deg)' }}
        />
        <Typography color={'text.secondary'} variant={'body3'}>
          View all enrichments
        </Typography>
      </Stack> */}
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
  );
};
