import { Icon, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import ICON_CONFETTI from '../assets/icon_confetti.svg';

export const StyledEmailReceived: FC = () => {
  return (
    <Stack gap={3}>
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 36,
          gap: 1,
        }}
      >
        <Icon component={ICON_CONFETTI} sx={{ width: 24, height: 24 }} />
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          Request received
        </Typography>
      </Stack>
      <Typography variant="body2">
        Our team will contact you as soon as possible to discuss next steps.
      </Typography>
    </Stack>
  );
};
