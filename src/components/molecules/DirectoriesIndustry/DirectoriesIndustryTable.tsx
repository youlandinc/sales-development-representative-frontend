import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

export const DirectoriesIndustryTable: FC = () => {
  return (
    <Stack sx={{ flex: 1, p: 3, gap: 3, overflowY: 'auto' }}>
      <Typography
        sx={{
          color: 'text.focus',
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        Preview leads
      </Typography>

      <Stack flexShrink={0} height={4000}></Stack>
    </Stack>
  );
};
