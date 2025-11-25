import { Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import { COLORS } from '../data';

interface SectionTitleProps {
  children: ReactNode;
}

export const SectionTitle: FC<SectionTitleProps> = ({ children }) => (
  <Typography
    sx={{
      fontSize: 18,
      fontWeight: 600,
      color: COLORS.text.primary,
      lineHeight: 1.2,
    }}
  >
    {children}
  </Typography>
);
