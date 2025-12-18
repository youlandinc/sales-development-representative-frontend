import { TableColumnProps } from '@/types/enrichment/table';
import { NON_EDITABLE_ACTION_KEYS, SYSTEM_COLUMN_SELECT } from '../config';

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
