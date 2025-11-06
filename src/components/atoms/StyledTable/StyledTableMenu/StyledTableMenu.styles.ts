import type { PopperPlacementType, SxProps, Theme } from '@mui/material';

// ============================================================================
// Constants
// ============================================================================

const POPPER_Z_INDEX = 1300;
const ICON_SIZE = 16;

const PAPER_WIDTHS = {
  small: 200, // AddColumn
  medium: 260, // Header
  large: 280, // AiRun
} as const;

const MENU_ITEM_PADDINGS = {
  compact: 1, // AddColumn, Header
  comfortable: 1.5, // AiRun
} as const;

// ============================================================================
// Types
// ============================================================================

export type PaperWidthVariant = keyof typeof PAPER_WIDTHS;
export type MenuItemPaddingVariant = keyof typeof MENU_ITEM_PADDINGS;

// ============================================================================
// Base Styles
// ============================================================================

const popperConfig = {
  placement: 'bottom-start' as PopperPlacementType,
  zIndex: POPPER_Z_INDEX,
};

const paperBaseStyle: SxProps<Theme> = {
  boxShadow: 2,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
};

const menuItemBaseStyle: SxProps<Theme> = {
  minHeight: 'auto',
  fontSize: 14,
  px: 2,
};

// For Header menu items with submenu support
const menuItemWithSubmenuStyle: SxProps<Theme> = {
  ...menuItemBaseStyle,
  py: MENU_ITEM_PADDINGS.compact,
  alignItems: 'center',
  gap: 1,
  position: 'relative',
  '&:hover > .submenu-container': {
    display: 'block',
  },
};

// For all menu icons
const iconStyle: SxProps<Theme> = {
  width: ICON_SIZE,
  height: ICON_SIZE,
};

// For menu dividers
const dividerStyle: SxProps<Theme> = {
  margin: '0 !important',
};

// For Header submenu container
const submenuPaperStyle: SxProps<Theme> = {
  display: 'none',
  position: 'absolute',
  left: '100%',
  top: 0,
  minWidth: PAPER_WIDTHS.small,
  ...paperBaseStyle,
  zIndex: 1,
};

// For Header submenu chevron icon
const submenuIconStyle: SxProps<Theme> = {
  marginLeft: 'auto',
  fontSize: 16,
};

// ============================================================================
// Exports
// ============================================================================

export const menuStyles = {
  popper: popperConfig,
  paper: paperBaseStyle,
  menuItem: menuItemBaseStyle,
  menuItemWithSubmenu: menuItemWithSubmenuStyle,
  icon: iconStyle,
  divider: dividerStyle,
  submenuPaper: submenuPaperStyle,
  submenuIcon: submenuIconStyle,
} as const;

/**
 * Create Paper style with specific width
 * Used by: AddColumn (small), Header (medium), AiRun (large)
 */
export const createPaperStyle = (
  variant: PaperWidthVariant,
): SxProps<Theme> => ({
  ...paperBaseStyle,
  minWidth: PAPER_WIDTHS[variant],
});

/**
 * Create MenuItem style with specific padding
 * Used by: AddColumn & Header (compact), AiRun (comfortable)
 */
export const createMenuItemStyle = (
  variant: MenuItemPaddingVariant,
  extraStyles?: SxProps<Theme>,
): SxProps<Theme> => [
  menuItemBaseStyle,
  { py: MENU_ITEM_PADDINGS[variant] },
  ...(extraStyles
    ? Array.isArray(extraStyles)
      ? extraStyles
      : [extraStyles]
    : []),
];
