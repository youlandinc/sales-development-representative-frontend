import { Stack, Typography } from '@mui/material';
import { FC } from 'react';

import {
  DialogWorkEmailCollapseCard,
  DialogWorkEmailCustomSelect,
} from './index';

export const DialogWorkEmailQuickSetupInputs: FC<{ title?: string }> = ({
  title = 'Inputs',
}) => {
  return (
    <DialogWorkEmailCollapseCard title={title}>
      <Stack gap={1}>
        <Typography variant={'body3'}>
          We automatically try to map the correct columns for you. If any inputs
          are empty, just select the columns you want to map. Once all inputs
          are filled, you&apos;re ready to save and run!
        </Typography>
        <DialogWorkEmailCustomSelect title={'Company name'} />
        <DialogWorkEmailCustomSelect title={'Domain'} />
        <DialogWorkEmailCustomSelect title={'Name'} />
        <DialogWorkEmailCustomSelect title={'Linked url'} />
      </Stack>
    </DialogWorkEmailCollapseCard>
  );
};
