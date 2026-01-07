// ============================================================================
// Cell & Header State Types
// ============================================================================

/**
 * Cell State - Manages active cell and editing state
 */
export interface CellState {
  recordId: string;
  columnId: string;
  isEditing?: boolean;
}

/**
 * Header State - Manages table header interaction states
 *
 * @property activeColumnId - Column with background highlight (menu target)
 * @property focusedColumnId - Column with bottom line indicator
 * @property isMenuOpen - Whether header menu is currently visible
 * @property isEditing - Whether header is in rename/edit mode
 * @property selectedColumnIds - Array of selected column IDs for multi-select
 */
export interface HeaderState {
  activeColumnId: string | null;
  focusedColumnId: string | null;
  isMenuOpen: boolean;
  isEditing: boolean;
  selectedColumnIds: string[];
}
