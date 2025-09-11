import { FC, ReactNode } from 'react';
import { Stack } from '@mui/material';

interface StyledTableHeadRowProps {
  children: ReactNode;
}

export const StyledTableHeadRow: FC<StyledTableHeadRowProps> = ({
  children,
}) => {
  return (
    <Stack
      bgcolor={'#fafafa'}
      borderTop={'1px solid #DFDEE6'}
      flexDirection={'row'}
    >
      {children}
    </Stack>
  );
};
