import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import ICON_CLOSE from '../assets/icon_close.svg';

export const HeaderPrepare: FC = () => {
  const { closeProcessAndReset } = useDialogStore();

  return (
    <Stack>
      <Stack alignItems={'center'} flexDirection={'row'} pt={3} px={3}>
        <Typography variant={'h5'}>Set up your email domain first</Typography>
        <Icon
          component={ICON_CLOSE}
          onClick={closeProcessAndReset}
          sx={{ ml: 'auto', cursor: 'pointer' }}
        />
      </Stack>
    </Stack>
  );
};
