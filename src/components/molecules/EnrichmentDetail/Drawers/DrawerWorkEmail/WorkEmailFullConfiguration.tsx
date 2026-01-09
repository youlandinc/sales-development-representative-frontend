import { Stack } from '@mui/material';
import { FC } from 'react';

import {
  WorkEmailQuickSetupInputs,
  WorkEmailSequence,
  WorkEmailValidation,
} from './index';

import { useWorkEmailStore } from '@/stores/enrichment';

export const WorkEmailFullConfiguration: FC = () => {
  const validationOptions = useWorkEmailStore(
    (state) => state.validationOptions,
  );
  return (
    <Stack gap={3}>
      <WorkEmailSequence />
      <WorkEmailQuickSetupInputs />
      {validationOptions && <WorkEmailValidation />}
    </Stack>
  );
};
