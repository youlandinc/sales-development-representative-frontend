import { Icon, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { format } from 'date-fns';

import { PlanStatusEnum } from '@/types';

import ICON_CALENDAR from '../assets/icon_calendar.svg';

export interface RenewalInfoProps {
  renewalDate: string;
  status: PlanStatusEnum;
}

export const RenewalInfo: FC<RenewalInfoProps> = ({ renewalDate, status }) => {
  const actionText = status === PlanStatusEnum.succeeded ? 'Renews' : 'Ends';

  return (
    <Stack alignItems="center" direction="row" gap={0.5} sx={{ ml: 'auto' }}>
      <Icon
        component={ICON_CALENDAR}
        sx={{ fontSize: 16, color: 'text.primary' }}
      />
      <Typography
        sx={{
          fontSize: 12,
          color: 'text.primary',
          lineHeight: 1.5,
        }}
      >
        {actionText} on {format(new Date(renewalDate), 'MMM dd, yyyy')}
      </Typography>
    </Stack>
  );
};
