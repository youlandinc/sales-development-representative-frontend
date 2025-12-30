import { DragEndEvent } from '@dnd-kit/core';

import { TableColumnProps } from '@/types/enrichment/table';
import { NON_EDITABLE_ACTION_KEYS, SYSTEM_COLUMN_SELECT } from '../config';

export interface ColumnSortParams {
  tableId: string;
  currentFieldId: string;
  beforeFieldId?: string;
  afterFieldId?: string;
}

/**
 * Build column sort params from DragEndEvent
 * Used by both HeadColumnsPanel and StyledTable
 *
 * @param event - DragEndEvent from dnd-kit
 * @returns ColumnSortParams or null if invalid
 */
export const buildColumnSortParams = (
  event: DragEndEvent,
): Omit<ColumnSortParams, 'tableId'> | null => {
  const { active, over } = event;

  if (!over || active.id === over.id) {
    return null;
  }

  const currentFieldId = String(active.id);
  const overFieldId = String(over.id);

  const activeIndex = active.data.current?.sortable.index as number;
  const overIndex = over.data.current?.sortable.index as number;

  if (activeIndex === -1 || overIndex === -1) {
    return null;
  }

  let beforeFieldId: string | undefined;
  let afterFieldId: string | undefined;

  if (activeIndex < overIndex) {
    afterFieldId = overFieldId;
  } else {
    beforeFieldId = overFieldId;
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
 *
 * @param column - Table column configuration
 * @returns true if column is an AI column
 */
export const checkIsAiColumn = (column: TableColumnProps): boolean => {
  return (
    column.actionKey === 'use-ai' ||
    column.actionKey?.includes('find') ||
    !!column.dependentFieldId
  );
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
