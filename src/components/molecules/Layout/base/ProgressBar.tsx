import { FC } from 'react';
import { Box } from '@mui/material';

type ProgressBarProps = {
  used: number;
  total: number;
};

export const ProgressBar: FC<ProgressBarProps> = ({ used, total }) => {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  const width = `${Math.min(percentage, 100)}%`;

  return (
    <Box
      sx={{
        bgcolor: '#f9eedc',
        borderRadius: '8px',
        height: '8px',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      }}
    >
      <Box
        sx={{
          bgcolor: '#e2c7a3',
          borderRadius: '8px',
          height: '100%',
          transition: 'width 0.3s ease',
          width,
        }}
      />
    </Box>
  );
};

