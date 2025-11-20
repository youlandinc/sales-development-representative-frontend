import { FC } from 'react';
import { Divider, Stack } from '@mui/material';

import { DirectoriesIndustryQuery, DirectoriesIndustryTable } from './index';

export const DirectoriesIndustry: FC = () => {
  return (
    <Stack
      sx={{
        flexDirection: 'row',
        minHeight: '100%',
      }}
    >
      <DirectoriesIndustryQuery />
      <Divider orientation={'vertical'} />
      <DirectoriesIndustryTable />
    </Stack>
  );
};
