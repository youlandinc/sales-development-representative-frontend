import { Stack } from '@mui/material';
import { FC } from 'react';

import {
  DialogWorkEmailQuickSetupInputs,
  DialogWorkEmailSequence,
} from './index';

export const DialogWorkEmailFullConfiguration: FC = () => {
  return (
    <Stack gap={3}>
      <DialogWorkEmailSequence />
      <DialogWorkEmailQuickSetupInputs />
    </Stack>
  );
};
