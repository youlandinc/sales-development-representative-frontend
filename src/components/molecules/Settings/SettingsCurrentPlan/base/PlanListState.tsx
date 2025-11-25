import { Typography } from '@mui/material';
import { FC } from 'react';

import { COLORS } from '../data';

interface PlanListStateProps {
  message: string;
}

export const PlanListState: FC<PlanListStateProps> = ({ message }) => (
  <Typography sx={{ color: COLORS.text.secondary, fontSize: 14 }}>
    {message}
  </Typography>
);
