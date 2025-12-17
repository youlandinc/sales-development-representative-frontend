import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { TABLE_BORDERS, TABLE_COLORS } from './styles';

// ============================================================================
// StyledTableBody
// ============================================================================

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
        isolation: 'isolate',
      }}
    >
      {children}
    </Stack>
  );
};

// ============================================================================
// StyledTableBodyRow
// ============================================================================

interface RowHoverContextType {
  isRowHovered: boolean;
}

const RowHoverContext = createContext<RowHoverContextType>({
  isRowHovered: false,
});

export const useRowHover = () => useContext(RowHoverContext);

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
  const [isRowHovered, setIsRowHovered] = useState(false);

  const contextValue = useMemo(() => ({ isRowHovered }), [isRowHovered]);

  return (
    <RowHoverContext.Provider value={contextValue}>
      <Stack
        data-index={rowIndex}
        direction="row"
        onMouseEnter={() => setIsRowHovered(true)}
        onMouseLeave={() => setIsRowHovered(false)}
        ref={measureRef}
        sx={{
          position: 'absolute',
          top: virtualStart,
          width: '100%',
          height: `${rowHeight}px`,
          alignItems: 'center',
          boxSizing: 'border-box',
          // borderBottom moved to each cell (like Clay)
          bgcolor: (theme) =>
            isSelected
              ? alpha(theme.palette.primary.main, 0.06)
              : 'transparent',
          '&:hover': {
            bgcolor: (theme) =>
              isSelected
                ? alpha(theme.palette.primary.main, 0.08)
                : TABLE_COLORS.HEADER_BG,
          },
        }}
      >
        {children}
      </Stack>
    </RowHoverContext.Provider>
  );
};
