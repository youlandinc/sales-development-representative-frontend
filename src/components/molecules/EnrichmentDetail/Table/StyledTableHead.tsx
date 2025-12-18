import { FC, ReactNode } from 'react';
import { Stack } from '@mui/material';

import { TABLE_BORDERS, TABLE_COLORS, TABLE_Z_INDEX } from './styles';

// ============================================================================
// StyledTableHead
// ============================================================================

interface StyledTableHeadProps {
  children: ReactNode;
  isScrolled: boolean;
}

export const StyledTableHead: FC<StyledTableHeadProps> = ({
  children,
  isScrolled,
}) => {
  return (
    <Stack
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: TABLE_Z_INDEX.HEAD_STICKY,
        bgcolor: TABLE_COLORS.DEFAULT_BG,
        boxShadow: isScrolled
          ? `0 4px 10px ${TABLE_COLORS.SCROLL_SHADOW}`
          : 'none',
        borderTop: TABLE_BORDERS.HEADER,
        // borderBottom moved to each HeadCell (like body cells)
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

// ============================================================================
// StyledTableHeadRow
// ============================================================================

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
        alignItems: 'center',
        width: '100%',
      }}
    >
      {children}
    </Stack>
  );
};
