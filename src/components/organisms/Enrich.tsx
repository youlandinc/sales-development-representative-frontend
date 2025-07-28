import { FC } from 'react';
import { Stack } from '@mui/material';

import { EnrichHeader, EnrichTable } from '@/components/molecules';

export const Enrich: FC = () => {
  return (
    <Stack>
      <EnrichHeader />
      <EnrichTable />
    </Stack>
  );
};
