import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { BADGE_COLORS } from './constants';

interface DirectoriesBadgeProps {
  variant: 'capital' | 'other';
  planName: string;
  planLogo: string;
}

export const DirectoriesBadge: FC<DirectoriesBadgeProps> = ({
  variant,
  planName,
  planLogo,
}) => {
  const config = BADGE_COLORS[variant];
  const hasLogo = variant === 'capital' && planLogo;

  return (
    <Box
      sx={{
        background: config.background,
        borderRadius: 1,
        padding: '2px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: hasLogo ? 0.5 : 0,
      }}
    >
      {hasLogo && (
        <Box
          alt={planName}
          component="img"
          src={planLogo}
          sx={{ width: 16, height: 16, objectFit: 'contain' }}
        />
      )}
      <Typography sx={{ color: config.color, fontSize: 12 }}>
        {planName}
      </Typography>
    </Box>
  );
};
