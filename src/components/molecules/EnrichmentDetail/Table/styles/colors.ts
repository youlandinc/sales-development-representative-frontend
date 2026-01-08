// Color constants for StyledTable components
// All table-related colors should be maintained here

export const TABLE_COLORS = {
  // Borders
  BORDER: '#DFDEE6',
  ROW_BORDER: '#F0EFF5',

  // Selection & Focus
  SELECTION_BORDER: '#6F6C7D',
  SELECTION_OUTLINE: '#D0CEDA',
  ACTIVE_BORDER: '#5B76BC',

  // Backgrounds
  HEADER_BG: '#FAFAFA',
  HOVER_BG: '#F4F5F9',
  DEFAULT_BG: '#FFFFFF',
  EDITING_HOVER_BG: '#F6F6F6',

  // Text
  TEXT_PRIMARY: '#363440',

  // Shadows
  SCROLL_SHADOW: 'rgba(0,0,0,0.06)',

  // AI Icon gradient backgrounds
  AI_GRADIENT_HOVER:
    'linear-gradient(to right, transparent 0%, rgba(247, 244, 253, 0.8) 30%, rgba(247, 244, 253, 1) 60%)',
  AI_GRADIENT_DEFAULT:
    'linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 1) 60%)',

  // Border widths (in px)
  PINNED_BORDER_WIDTH: 3,
  REGULAR_BORDER_WIDTH: 0.5,
} as const;

// Commonly used border strings
export const TABLE_BORDERS = {
  REGULAR: `${TABLE_COLORS.REGULAR_BORDER_WIDTH}px solid ${TABLE_COLORS.BORDER}`,
  REGULAR_TRANSPARENT: `${TABLE_COLORS.REGULAR_BORDER_WIDTH}px solid transparent`,
  ROW: `1px solid ${TABLE_COLORS.ROW_BORDER}`,
  HEADER: `1px solid ${TABLE_COLORS.BORDER}`,
} as const;
