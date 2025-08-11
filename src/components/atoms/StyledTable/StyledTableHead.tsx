import { FC, ReactNode } from 'react';
import { Stack } from '@mui/material';

interface StyledTableHeadProps {
  children: ReactNode;
  scrolled: boolean;
}

export const StyledTableHead: FC<StyledTableHeadProps> = ({
  children,
  scrolled,
}) => {
  return (
    <Stack
      sx={{
        display: 'flex',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: '#fff',
        boxShadow: scrolled ? '0 4px 10px rgba(0,0,0,0.06)' : 'none',
        borderBottom: '1px solid #DFDEE6',
        width: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'inherit',
          zIndex: -1,
        },
      }}
    >
      {children}
    </Stack>
  );
};
