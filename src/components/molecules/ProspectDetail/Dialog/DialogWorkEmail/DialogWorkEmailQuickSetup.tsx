import { Stack } from '@mui/material';
import { FC } from 'react';

import { DialogWorkEmailQuickSetupInputs } from './DialogWorkEmailQuickSetupInputs';

export const DialogWorkEmailQuickSetup: FC = () => {
  return (
    <Stack gap={4}>
      <DialogWorkEmailQuickSetupInputs />
    </Stack>
  );
};
