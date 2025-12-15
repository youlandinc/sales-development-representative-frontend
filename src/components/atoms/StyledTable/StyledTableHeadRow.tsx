import { FC, ReactNode } from 'react';
import { Stack } from '@mui/material';

import { TABLE_BORDERS, TABLE_COLORS } from './styles';

interface StyledTableHeadRowProps {
  children: ReactNode;
}

export const StyledTableHeadRow: FC<StyledTableHeadRowProps> = ({
  children,
}) => {
  return (
    <Stack
      bgcolor={TABLE_COLORS.HEADER_BG}
      borderTop={TABLE_BORDERS.HEADER}
      flexDirection={'row'}
    >
      {children}
    </Stack>
  );
};
