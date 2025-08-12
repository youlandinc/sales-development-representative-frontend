import { FC, ReactNode } from 'react';
import { Stack } from '@mui/material';

interface StyledTableBodyRowProps {
  children: ReactNode;
  rowHeight: number;
  virtualStart: number;
  rowIndex: number;
  measureRef?: (node: HTMLElement | null) => void;
}

export const StyledTableBodyRow: FC<StyledTableBodyRowProps> = ({
  children,
  rowHeight,
  virtualStart,
  rowIndex,
  measureRef,
}) => {
  return (
    <Stack
      data-index={rowIndex}
      direction="row"
      ref={measureRef}
      sx={{
        position: 'absolute',
        transform: `translateY(${virtualStart}px)`,
        width: '100%',
        height: `${rowHeight}px`,
        alignItems: 'center',
        borderBottom: '1px solid #F0EFF5',
        '&:hover': { bgcolor: '#FAFAFA' },
      }}
    >
      {children}
    </Stack>
  );
};
