import { TABLE_BORDERS, TABLE_COLORS } from './tableColors';

// Border configuration for pinned columns
export const buildPinnedBorderRight = (
  isPinned: boolean,
  shouldShowPinnedRightShadow: boolean,
  isSelectColumn: boolean,
): string => {
  const shouldShowPinnedBorder =
    isPinned && shouldShowPinnedRightShadow && !isSelectColumn;

  return shouldShowPinnedBorder
    ? TABLE_BORDERS.REGULAR_TRANSPARENT
    : TABLE_BORDERS.REGULAR;
};

// Pseudo-element styles for pinned column border (renders outside content box)
export const buildPinnedBorderPseudoStyles = (
  isPinned: boolean,
  shouldShowPinnedRightShadow: boolean,
  isSelectColumn: boolean,
  zIndex: number,
): Record<string, unknown> => {
  const shouldShowPinnedBorder =
    isPinned && shouldShowPinnedRightShadow && !isSelectColumn;

  if (!shouldShowPinnedBorder) {
    return { content: 'none' };
  }

  return {
    content: '""',
    position: 'absolute',
    top: 0,
    right: -TABLE_COLORS.REGULAR_BORDER_WIDTH,
    width: `${TABLE_COLORS.PINNED_BORDER_WIDTH}px`,
    height: '100%',
    bgcolor: TABLE_COLORS.BORDER,
    zIndex,
    pointerEvents: 'none',
  };
};
