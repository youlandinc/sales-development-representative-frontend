import { Icon, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import ICON_CLIPBOARD from '../assets/icon_clipboard.svg';

export const CustomPricing: FC = () => (
  <Stack
    sx={{
      minHeight: 36,
      alignItems: 'center',
      flexDirection: 'row',
      gap: 1,
    }}
  >
    <Icon component={ICON_CLIPBOARD} sx={{ width: 24, height: 24 }} />
    <Typography sx={{ fontSize: 22, lineHeight: 1, color: 'text.secondary' }}>
      Custom pricing
    </Typography>
  </Stack>
);
