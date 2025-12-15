import { FC, ReactNode } from 'react';
import { Stack } from '@mui/material';

interface StyledTableBodyProps {
  children: ReactNode;
  totalHeight: number;
}

export const StyledTableBody: FC<StyledTableBodyProps> = ({
  children,
  totalHeight,
}) => {
  return (
    <Stack
      height={totalHeight}
      sx={{
        position: 'relative',
        isolation: 'isolate', // Creates new stacking context like Clay
      }}
    >
      {children}
    </Stack>
  );
};
