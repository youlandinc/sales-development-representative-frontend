import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import ICON_TICK from './assets/icon-tick.svg';
import { DIRECTORIES_COLORS } from './constants';

interface DirectoriesStatsProps {
  periodCount: number;
  statPeriod: string;
  isDark: boolean;
}

export const DirectoriesStats: FC<DirectoriesStatsProps> = ({
  periodCount,
  statPeriod,
  isDark,
}) => {
  const statsColor = isDark
    ? DIRECTORIES_COLORS.dark.stats
    : DIRECTORIES_COLORS.light.stats;

  return (
    <Stack
      sx={{
        alignItems: 'flex-end',
        gap: 0.25,
      }}
    >
      <Typography
        sx={{
          color: statsColor,
          fontSize: '12px',
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        {periodCount?.toLocaleString()} records
      </Typography>
      <Stack
        sx={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 0.25,
        }}
      >
        <Icon component={ICON_TICK} sx={{ width: 18, height: 18 }} />
        <Typography
          sx={{
            color: statsColor,
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          {statPeriod}
        </Typography>
      </Stack>
    </Stack>
  );
};
