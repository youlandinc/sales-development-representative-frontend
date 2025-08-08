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
      direction="row"
      sx={{
        display: 'flex',
        width: '100%',
        bgcolor: '#fafafa',
        borderTop: '1px solid #DFDEE6',
      }}
    >
      {children}
    </Stack>
  );
};
