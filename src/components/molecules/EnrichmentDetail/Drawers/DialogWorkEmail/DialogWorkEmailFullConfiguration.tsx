import { Stack } from '@mui/material';
import { FC } from 'react';

import {
  DialogWorkEmailQuickSetupInputs,
  DialogWorkEmailSequence,
  DialogWorkEmailValidation,
} from './index';

import { useWorkEmailStore } from '@/stores/enrichment';

export const DialogWorkEmailFullConfiguration: FC = () => {
  const validationOptions = useWorkEmailStore(
    (state) => state.validationOptions,
  );
  return (
    <Stack gap={3}>
      <DialogWorkEmailSequence />
      <DialogWorkEmailQuickSetupInputs />
      {validationOptions && <DialogWorkEmailValidation />}
    </Stack>
  );
};
