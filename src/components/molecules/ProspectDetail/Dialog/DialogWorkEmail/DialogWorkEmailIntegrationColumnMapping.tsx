import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import {
  DialogWorkEmailCollapseCard,
  DialogWorkEmailCustomSelect,
} from './index';

import { useWorkEmailStore } from '@/stores/Prospect';

export const DialogWorkEmailIntegrationColumnMapping: FC = () => {
  const { selectedIntegrationToConfig } = useWorkEmailStore();
  return (
    <DialogWorkEmailCollapseCard title={'Column mapping'}>
      <Stack gap={1.5}>
        <Typography color={'text.secondary'} variant={'body3'}>
          SETUP INPUTS
        </Typography>
        {(selectedIntegrationToConfig?.inputParams || []).map((i, key) => (
          <DialogWorkEmailCustomSelect key={key} title={i.displayName} />
        ))}
      </Stack>
    </DialogWorkEmailCollapseCard>
  );
};
