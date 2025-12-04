import { Typography } from '@mui/material';
import { FC } from 'react';

interface PlanListStateProps {
  message: string;
}

export const PlanListState: FC<PlanListStateProps> = ({ message }) => (
  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
    {message}
  </Typography>
);
