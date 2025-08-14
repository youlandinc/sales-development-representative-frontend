import { FC, ReactNode } from 'react';
import { Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface StyledTableBodyRowProps {
  children: ReactNode;
  rowHeight: number;
  virtualStart: number;
  rowIndex: number;
  measureRef?: (node: HTMLElement | null) => void;
  isSelected?: boolean;
}

export const StyledTableBodyRow: FC<StyledTableBodyRowProps> = ({
  children,
  rowHeight,
  virtualStart,
  rowIndex,
  measureRef,
  isSelected = false,
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
        boxSizing: 'border-box',
        borderBottom: '1px solid #F0EFF5',
        zIndex: 1,
        bgcolor: (theme) =>
          isSelected ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
        '&:hover': {
          bgcolor: (theme) =>
            isSelected ? alpha(theme.palette.primary.main, 0.08) : '#FAFAFA',
        },
      }}
    >
      {children}
    </Stack>
  );
};
