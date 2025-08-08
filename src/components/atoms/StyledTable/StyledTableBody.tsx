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
      sx={{
        display: 'flex',
        height: `${totalHeight}px`,
        position: 'relative',
      }}
    >
      {children}
    </Stack>
  );
};
