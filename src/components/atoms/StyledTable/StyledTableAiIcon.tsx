import { FC, MouseEvent } from 'react';
import { Box, Icon, Stack } from '@mui/material';

import ICON_RUN_AI from './assets/icon-run-ai.svg';

interface StyledTableAiIconProps {
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
  backgroundColor?: string;
}

export const StyledTableAiIcon: FC<StyledTableAiIconProps> = ({
  onClick,
  backgroundColor = '#fff',
}) => {
  const getGradientBackground = (bgColor: string) => {
    if (bgColor === '#F7F4FD') {
      return 'linear-gradient(to right, transparent 0%, rgba(247, 244, 253, 0.8) 30%, rgba(247, 244, 253, 1) 60%)';
    }
    if (bgColor === '#FFFFFF' || bgColor === '#fff') {
      return 'linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 1) 60%)';
    }
    return 'linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 1) 60%)';
  };

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      sx={{
        position: 'absolute',
        right: 2,
        top: 0,
        bottom: 0,
        width: 50,
        zIndex: 9,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: 2,
          top: 2,
          bottom: 2,
          width: 48,
          background: getGradientBackground(backgroundColor),
          pointerEvents: 'none',
          zIndex: 9,
        }}
      />
      <Stack
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick(e);
        }}
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 12,
          zIndex: 10,
          p: 0.5,
          borderRadius: 1,
          cursor: 'pointer',
          border: '1px solid #DFDEE6',
          bgcolor: '#ffffff',
          '&:hover': {
            bgcolor: '#F7F4FD',
          },
        }}
      >
        <Icon component={ICON_RUN_AI} sx={{ width: 12, height: 12 }} />
      </Stack>
    </Box>
  );
};
