import { Icon, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import { COLORS } from '../data';
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
      sx={{ fontSize: 16, color: COLORS.text.primary }}
    />
    <Typography
      sx={{
        fontSize: 12,
        color: COLORS.text.primary,
        lineHeight: 1.5,
      }}
    >
      {unitLabel} refresh in {refreshDays} days
    </Typography>
  </Stack>
);
