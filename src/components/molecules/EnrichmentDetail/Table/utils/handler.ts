import { DragEndEvent } from '@dnd-kit/core';

import {
  TableColumnProps,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';
import { NON_EDITABLE_ACTION_KEYS, SYSTEM_COLUMN_SELECT } from '../config';

export interface ColumnSortParams {
  tableId: string;
  currentFieldId: string;
  beforeFieldId?: string;
  afterFieldId?: string;
}

/**
 * Build column sort params from DragEndEvent
 * Used by both PanelColumns and StyledTablebase
 *
 * @param event - DragEndEvent from dnd-kit
 * @returns ColumnSortParams or null if invalid
 */
export const buildColumnSortParams = (
  event: DragEndEvent,
): Omit<ColumnSortParams, 'tableId'> | null => {
  const { active, over, delta } = event;

  if (!over || active.id === over.id) {
    return null;
  }

  const currentFieldId = String(active.id);
  const overFieldId = String(over.id);

  let beforeFieldId: string | undefined;
  let afterFieldId: string | undefined;

  // Get sortable data to determine target position
  const sortableData = over.data.current?.sortable;
  const overIndex = sortableData?.index ?? -1;
  const items = sortableData?.items ?? [];

  const isMovingForward = delta.x > 0 || delta.y > 0;
  const isMovingToFirst = overIndex === 0 && !isMovingForward;

  // Original pattern:
  // - Only first position uses afterId
  // - All other positions use beforeId
  if (isMovingToFirst) {
    // First position: afterFieldId = first item (it will be after us)
    afterFieldId = overFieldId;
  } else if (isMovingForward) {
    // Moving right/down: beforeFieldId = over (it will be before us)
    beforeFieldId = overFieldId;
  } else {
    // Moving left/up (not first): beforeFieldId = item before over
    const previousItemId = items[overIndex - 1];
    beforeFieldId = previousItemId ? String(previousItemId) : overFieldId;
  }

  return {
    currentFieldId,
    beforeFieldId,
    afterFieldId,
  };
};

/**
 * Check if a column is an AI column
 * AI column criteria:
 * - actionKey === 'use-ai'
 * - actionKey includes 'find'
 * - has dependentFieldId
 * - fieldType === TableColumnTypeEnum.action
 * @param column - Table column configuration
 * @returns true if column is an AI column
 */
export const checkIsAiColumn = (column: TableColumnProps): boolean => {
  return column.fieldType === TableColumnTypeEnum.action;
};

/**
 * Check if a column can be edited by user
 * Non-editable columns:
 * - System select column (SYSTEM_COLUMN_SELECT)
 * - Columns with actionKey in NON_EDITABLE_ACTION_KEYS ('use-ai', 'find')
 *
 * @param columnId - Column identifier
 * @param actionKey - Column action key (optional)
 * @returns true if column can be edited
 */
export const checkIsEditableColumn = (
  columnId: string,
  actionKey?: string,
): boolean => {
  if (columnId === SYSTEM_COLUMN_SELECT) {
    return false;
  }
  return !(actionKey && NON_EDITABLE_ACTION_KEYS.includes(actionKey as any));
};
