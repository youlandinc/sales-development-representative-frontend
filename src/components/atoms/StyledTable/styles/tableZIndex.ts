// Z-index layering system for StyledTable components
// All table-related z-index values should be maintained here

export const TABLE_Z_INDEX = {
  // Base layers
  CELL: 1,
  HEADER: 2,

  // Selection overlay layers
  OVERLAY_NON_PINNED: 10,
  OVERLAY_BLOCKER: 15,
  PINNED_CELL: 20,
  OVERLAY_PINNED: 25,

  // Header layers
  HEAD_STICKY: 10,
  HEADER_PINNED: 30,
  HEADER_FOCUS_LINE: 31,

  // Menu & Popper
  POPPER: 1300,
  RESIZE_INDICATOR: 999,
} as const;
