import { FC } from 'react';
import { Box, Icon, Typography } from '@mui/material';

import { BADGE_COLORS } from './constants';

import ICON_CROWN from './assets/icon-crown.svg';

interface DirectoriesBadgeProps {
  variant: 'intelligence' | 'active';
}

export const DirectoriesBadge: FC<DirectoriesBadgeProps> = ({ variant }) => {
  if (variant === 'intelligence') {
    const config = BADGE_COLORS.intelligence;
    return (
      <Box
        sx={{
          background: config.background,
          borderRadius: '4px',
          padding: '2px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Icon
          component={ICON_CROWN}
          sx={{ width: 16, height: 16, color: config.iconColor }}
        />
        <Typography
          sx={{
            color: config.color,
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          Intelligence
        </Typography>
      </Box>
    );
  }

  const config = BADGE_COLORS.active;
  return (
    <Box
      sx={{
        background: config.background,
        borderRadius: '4px',
        padding: '2px 8px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{
          color: config.color,
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: 1.5,
        }}
      >
        Active access
      </Typography>
    </Box>
  );
};
