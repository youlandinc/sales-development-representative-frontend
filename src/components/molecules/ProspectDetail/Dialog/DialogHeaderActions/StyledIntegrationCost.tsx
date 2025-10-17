import { Icon, Stack, Typography } from '@mui/material';
import { ElementType, FC } from 'react';

import ICON_COST from '@/components/molecules/ProspectDetail/assets/dialog/icon_coins.svg';

interface StyledIntegrationCostProps {
  integrationIcon?: ElementType;
  integrationCost: number;
  cost: number;
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
        <Icon
          component={integrationIcon || ICON_COST}
          sx={{ width: 18, height: 18 }}
        />
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
