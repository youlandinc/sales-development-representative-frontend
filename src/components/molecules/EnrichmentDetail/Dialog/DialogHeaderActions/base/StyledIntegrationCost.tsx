import { Icon, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import Image from 'next/image';

import ICON_COST from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_coins.svg';

interface StyledIntegrationCostProps {
  integrationIcon: string;
  integrationCost: number;
  cost: number | string;
}

export const StyledIntegrationCost: FC<StyledIntegrationCostProps> = ({
  integrationIcon,
  integrationCost,
  cost,
}) => {
  return (
    <Stack
      alignItems={'center'}
      border={'1px solid #D0CEDA'}
      borderRadius={1}
      flexDirection={'row'}
      gap={1.5}
      px={1}
      py={0.5}
    >
      <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
        <Image alt={''} height={18} src={integrationIcon} width={18} />
        <Typography color={'text.secondary'} variant={'body3'}>
          +{integrationCost}
        </Typography>
      </Stack>
      <Stack bgcolor={'#D0CEDA'} height={18} width={'1px'} />
      <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
        <Icon component={ICON_COST} sx={{ width: 18, height: 18 }} />
        <Typography color={'text.secondary'} variant={'body3'}>
          ~{cost}
        </Typography>
      </Stack>
    </Stack>
  );
};
