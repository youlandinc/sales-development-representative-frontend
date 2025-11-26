import { Icon, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import ICON_CONFETTI from '../assets/icon_confetti_bold.svg';

export const EmailSentStatus: FC = () => (
  <Stack gap={3}>
    <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
      <Icon component={ICON_CONFETTI} sx={{ width: 21, height: 21 }} />
      <Typography fontWeight={400} lineHeight={1} variant={'h4'}>
        Request received
      </Typography>
    </Stack>
    <Typography lineHeight={1.4} variant={'body2'}>
      Our team will contact you as soon as possible to discuss next steps.
    </Typography>
  </Stack>
);
