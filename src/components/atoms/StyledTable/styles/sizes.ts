// Dimension constants for StyledTable components
// All table-related sizes should be maintained here

export const TABLE_SIZES = {
  // Cell dimensions
  CELL_MIN_WIDTH: 60,
  CELL_DEFAULT_WIDTH: 200,
  ADD_COLUMN_WIDTH: 140,

  // Row dimensions
  ROW_HEIGHT: 36,
  HEADER_HEIGHT: 36,

  // Typography
  FONT_SIZE: 14,
  FONT_WEIGHT_NORMAL: 400,
  FONT_WEIGHT_MEDIUM: 500,

  // Icons
  ICON_SIZE: 16,
  CHECKBOX_SIZE: 20,

  // Resize
  RESIZE_HANDLE_WIDTH: 15,
  RESIZE_INDICATOR_WIDTH: 3,
  MIN_COLUMN_WIDTH: 80,
} as const;
