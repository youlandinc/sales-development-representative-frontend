import { FC, memo, MouseEvent, ReactNode, RefObject, useCallback } from 'react';
import { Stack } from '@mui/material';

import {
  buildPinnedBorderPseudoStyles,
  buildPinnedBorderRight,
  TABLE_BORDERS,
  TABLE_COLORS,
  TABLE_Z_INDEX,
} from '../styles';

const CELL_CONSTANTS = {
  MIN_WIDTH: 60,
} as const;

const CELL_COLORS = {
  ACTIVE_BG: TABLE_COLORS.DEFAULT_BG,
  DEFAULT_BG: TABLE_COLORS.DEFAULT_BG,
} as const;

export const getCellBackgroundColor = (
  isEditing: boolean,
  isActive: boolean,
  isSelectColumn: boolean,
  hasActiveInRow: boolean,
  isRowSelected: boolean,
  isColumnHighlighted: boolean,
): string => {
  if ((isEditing || isActive) && !isSelectColumn) {
    return CELL_COLORS.ACTIVE_BG;
  }
  if (isSelectColumn && hasActiveInRow) {
    return CELL_COLORS.ACTIVE_BG;
  }
  if (isRowSelected || isColumnHighlighted) {
    return CELL_COLORS.ACTIVE_BG;
  }
  return CELL_COLORS.DEFAULT_BG;
};

export interface BodyCellContainerProps {
  children: ReactNode;
  width: number;
  isPinned?: boolean;
  stickyLeft?: number;
  shouldShowPinnedRightShadow?: boolean;
  isSelectColumn?: boolean;
  backgroundColor: string;
  cursor?: 'pointer' | 'not-allowed' | 'default';
  cellRef?: RefObject<HTMLDivElement | null>;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const BodyCellContainerComponent: FC<BodyCellContainerProps> = ({
  children,
  width,
  isPinned = false,
  stickyLeft = 0,
  shouldShowPinnedRightShadow = false,
  isSelectColumn = false,
  backgroundColor,
  cursor = 'default',
  cellRef,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const resolvedMinWidth =
    width < CELL_CONSTANTS.MIN_WIDTH ? CELL_CONSTANTS.MIN_WIDTH : width;

  const onClickInternal = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onClick?.(e);
    },
    [onClick],
  );

  const onDoubleClickInternal = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onDoubleClick?.(e);
    },
    [onDoubleClick],
  );

  return (
    <Stack
      onClick={onClickInternal}
      onDoubleClick={onDoubleClickInternal}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={cellRef}
      sx={{
        width,
        minWidth: resolvedMinWidth,
        maxWidth: width,
        boxSizing: 'border-box',
        position: isPinned ? 'sticky' : 'relative',
        left: isPinned ? stickyLeft : 'auto',
        zIndex: isPinned ? TABLE_Z_INDEX.PINNED_CELL : TABLE_Z_INDEX.CELL,
        bgcolor: backgroundColor,
        // Each cell has borderBottom and borderRight (like Clay)
        borderBottom: TABLE_BORDERS.ROW,
        borderRight: isPinned
          ? buildPinnedBorderRight(
              isPinned,
              shouldShowPinnedRightShadow,
              isSelectColumn,
            )
          : TABLE_BORDERS.ROW,
        '&::after': buildPinnedBorderPseudoStyles(
          isPinned,
          shouldShowPinnedRightShadow,
          isSelectColumn,
          10,
        ),
        height: '100%',
        justifyContent: 'center',
        cursor,
      }}
    >
      {children}
    </Stack>
  );
};

export const BodyCellContainer = memo(BodyCellContainerComponent);
