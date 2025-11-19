import { FC } from 'react';
import { Stack } from '@mui/material';

import { DirectoriesIndustryQuery, DirectoriesIndustryTable } from './index';

export const DirectoriesIndustry: FC = () => {
  return (
    <Stack>
      <DirectoriesIndustryQuery />
      <DirectoriesIndustryTable />
    </Stack>
  );
};
