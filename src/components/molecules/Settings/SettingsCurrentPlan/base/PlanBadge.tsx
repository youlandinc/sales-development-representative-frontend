import { Box, Typography } from '@mui/material';
import { FC } from 'react';

export interface PlanBadgeProps {
  label: string;
  bgColor: string;
  textColor: string;
  gradient?: boolean;
}

export const PlanBadge: FC<PlanBadgeProps> = ({
  label,
  bgColor,
  textColor,
  gradient,
}) => (
  <Box
    sx={{
      bgcolor: bgColor,
      borderRadius: 0.5,
      px: 1,
      py: 0.5,
    }}
  >
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 400,
        color: textColor,
        lineHeight: 1,
        ...(gradient && {
          background: 'linear-gradient(90deg, #FEF0D6 0%, #E5CCAA 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }),
      }}
    >
      {label}
    </Typography>
  </Box>
);
