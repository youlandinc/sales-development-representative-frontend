import type { SxProps, Theme } from '@mui/material';

import { TABLE_COLORS } from './colors';
import { TABLE_SIZES } from './sizes';
import { TABLE_Z_INDEX } from './zIndex';

// =============================================================================
// Menu-specific Constants (not in TABLE_SIZES)
// =============================================================================

const MENU_WIDTH = {
  SMALL: 200,
  MEDIUM: 260,
  LARGE: 280,
} as const;

const MENU_PADDING = {
  COMPACT: 1,
  COMFORTABLE: 1.5,
} as const;

// =============================================================================
// Base Styles
// =============================================================================

const PAPER_BASE: SxProps<Theme> = {
  bgcolor: TABLE_COLORS.DEFAULT_BG,
  border: '1px solid #E9E9EF',
  borderRadius: '8px',
  boxShadow: '0 0 6px 0 rgba(54, 52, 64, 0.14)',
};

const MENU_ITEM_BASE: SxProps<Theme> = {
  minHeight: 'auto',
  fontSize: TABLE_SIZES.FONT_SIZE,
  px: 2,
};

// =============================================================================
// Exported Styles
// =============================================================================

export const MENU_STYLES = {
  popper: {
    placement: 'bottom-start' as const,
    zIndex: TABLE_Z_INDEX.POPPER,
  },

  paper: PAPER_BASE,
  paperSmall: { ...PAPER_BASE, minWidth: MENU_WIDTH.SMALL },
  paperMedium: { ...PAPER_BASE, minWidth: MENU_WIDTH.MEDIUM },
  paperLarge: { ...PAPER_BASE, minWidth: MENU_WIDTH.LARGE },

  menuItem: MENU_ITEM_BASE,
  menuItemCompact: { ...MENU_ITEM_BASE, py: MENU_PADDING.COMPACT },
  menuItemComfortable: { ...MENU_ITEM_BASE, py: MENU_PADDING.COMFORTABLE },

  menuItemWithSubmenu: {
    ...MENU_ITEM_BASE,
    py: MENU_PADDING.COMPACT,
    alignItems: 'center',
    gap: 1,
    position: 'relative',
    '&:hover > .submenu-container': { display: 'block' },
  } as SxProps<Theme>,

  icon: {
    width: TABLE_SIZES.ICON_SIZE,
    height: TABLE_SIZES.ICON_SIZE,
  },

  divider: {
    margin: '0 !important',
  },

  submenuPaper: {
    ...PAPER_BASE,
    display: 'none',
    position: 'absolute',
    left: '100%',
    top: 0,
    minWidth: MENU_WIDTH.SMALL,
    zIndex: 1,
  } as SxProps<Theme>,

  submenuIcon: {
    marginLeft: 'auto',
    fontSize: TABLE_SIZES.ICON_SIZE,
  },

  submenuTitle: {
    px: 2,
    py: 1,
    fontSize: 12,
    fontWeight: TABLE_SIZES.FONT_WEIGHT_MEDIUM + 100,
    color: 'text.secondary',
    letterSpacing: '0.5px',
    cursor: 'default',
  },
} as const;
