import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { StyledButtonGroup } from '@/components/atoms';

const temp = [
  {
    label: 'Investors & Funds',
    key: '1',
    value: '1',
  },
  {
    label: 'Limited Partners',
    key: '2',
    value: '2',
  },
  {
    label: 'Service Providers',
    key: '3',
    value: '3',
  },
];

export const DirectoriesIndustryQuery: FC = () => {
  return (
    <Stack sx={{ maxWidth: 420 }}>
      <Stack gap={1}>
        <Typography sx={{ lineHeight: 1.2, fontWeight: 600, fontSize: 14 }}>
          Institution type
        </Typography>
        <StyledButtonGroup options={temp} value={'3'} />
      </Stack>
    </Stack>
  );
};
