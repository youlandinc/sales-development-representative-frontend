import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import ICON_LOCK from './assets/icon-lock.svg';

export const QueryBadgeAuth: FC = () => {
  return (
    <Stack
      sx={{
        flexDirection: 'row',
        gap: 0.25,
        alignItems: 'center',
        px: 0.75,
        py: 0.25,
        borderRadius: 1,
        border: '1px solid #C49F61',
      }}
    >
      <Icon component={ICON_LOCK} sx={{ width: 11, height: 11 }} />
      <Typography
        sx={{
          color: '#BC9166',
          fontSize: 10,
        }}
      >
        Requires Intelligence
      </Typography>
    </Stack>
  );
};
