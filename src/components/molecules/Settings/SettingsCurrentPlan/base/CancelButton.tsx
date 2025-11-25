import { Typography } from '@mui/material';
import { FC } from 'react';

import { COLORS } from '../data';
import { PlanStatusEnum } from '@/types';

export interface CancelButtonProps {
  status: PlanStatusEnum;
  onCancel?: () => void;
}

export const CancelButton: FC<CancelButtonProps> = ({ status, onCancel }) => {
  if (status === PlanStatusEnum.succeeded) {
    return (
      <Typography
        onClick={onCancel}
        sx={{
          fontSize: 12,
          color: COLORS.text.secondary,
          cursor: 'pointer',
          lineHeight: 1.5,
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        Cancel subscription
      </Typography>
    );
  }

  return (
    <Typography
      sx={{
        fontSize: 12,
        color: COLORS.text.secondary,
        lineHeight: 1.5,
      }}
    >
      Cancelled
    </Typography>
  );
};
