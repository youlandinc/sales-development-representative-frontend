import { FC } from 'react';
import { Stack } from '@mui/material';

import { LeadsTable } from '@/components/molecules';

export const Leads: FC = () => {
  return (
    <Stack gap={3} height={'100%'} width={'100%'}>
      <LeadsTable />
    </Stack>
  );
};
