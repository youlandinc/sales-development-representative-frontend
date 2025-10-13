import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import {
  DialogWorkEmailCollapseCard,
  DialogWorkEmailCustomSelect,
} from './index';

export const DialogWorkEmailIntegrationColumnMapping: FC = () => {
  return (
    <DialogWorkEmailCollapseCard title={'Column mapping'}>
      <Stack gap={1.5}>
        <Typography color={'text.secondary'} variant={'body3'}>
          SETUP INPUTS
        </Typography>
        <DialogWorkEmailCustomSelect title={'Input'} />
        <DialogWorkEmailCustomSelect title={'Input'} />
      </Stack>
    </DialogWorkEmailCollapseCard>
  );
};
