import { FC } from 'react';
import { Divider, Stack } from '@mui/material';

import { DirectoriesIndustryPreview, DirectoriesIndustryQuery } from './index';

export const DirectoriesIndustry: FC = () => {
  return (
    <Stack
      sx={{
        flexDirection: 'row',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <DirectoriesIndustryQuery />
      <Divider orientation={'vertical'} />
      <DirectoriesIndustryPreview />
    </Stack>
  );
};
