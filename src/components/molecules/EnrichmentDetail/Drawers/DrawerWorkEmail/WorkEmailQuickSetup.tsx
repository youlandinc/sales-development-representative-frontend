import { Stack } from '@mui/material';
import { FC } from 'react';

import { WorkEmailQuickSetupInputs } from './WorkEmailQuickSetupInputs';

export const WorkEmailQuickSetup: FC = () => {
  return (
    <Stack gap={4}>
      <WorkEmailQuickSetupInputs />
    </Stack>
  );
};
