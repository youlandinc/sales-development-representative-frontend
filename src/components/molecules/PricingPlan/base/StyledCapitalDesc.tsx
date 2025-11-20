import { PlanTypeEnum } from '@/types';
import { Icon, Stack, Typography } from '@mui/material';
import { ComponentType, FC } from 'react';
import { CAPITAL_PLAN_DESC_ICON } from '../data';

interface StyledCapitalDescProps {
  planType: PlanTypeEnum;
  priceAdditionalInfo: string;
}

export const StyledCapitalDesc: FC<StyledCapitalDescProps> = ({
  planType,
  priceAdditionalInfo,
}) => {
  return (
    <Stack sx={{ flexDirection: 'row', alignItems: 'center', minHeight: 36 }}>
      <Icon
        component={CAPITAL_PLAN_DESC_ICON[planType] as unknown as ComponentType}
        sx={{ width: 21, height: 21 }}
      />
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 400,
          lineHeight: 1,
          color: 'text.secondary',
          ml: 1,
        }}
      >
        {priceAdditionalInfo}
      </Typography>
    </Stack>
  );
};
