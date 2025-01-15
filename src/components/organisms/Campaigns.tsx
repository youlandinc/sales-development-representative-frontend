import { FC } from 'react';
import { Stack } from '@mui/material';

import { CampaignsHeader, CampaignsTable } from '@/components/molecules';

export const Campaigns: FC = () => {
  return (
    <Stack gap={3} height={'100%'} width={'100%'}>
      <CampaignsHeader />
      <CampaignsTable />
    </Stack>
  );
};
