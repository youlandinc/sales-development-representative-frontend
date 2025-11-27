import { Icon, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import ICON_REFRESH from '../assets/icon_refresh.svg';

export interface RefreshInfoProps {
  refreshDays: number;
  unitLabel: string;
}

export const RefreshInfo: FC<RefreshInfoProps> = ({
  refreshDays,
  unitLabel,
}) => (
  <Stack alignItems="center" direction="row" gap={0.5}>
    <Icon
      component={ICON_REFRESH}
      sx={{ fontSize: 16, color: 'text.secondary' }}
    />
    <Typography
      sx={{
        fontSize: 12,
        lineHeight: 1.5,
      }}
    >
      {unitLabel} refresh in {refreshDays} days
    </Typography>
  </Stack>
);
