import { TableColumnProps } from '@/types/Prospect/table';

/**
 * 1. actionKey === 'use-ai'
 * 2. actionKey 包含 'find'
 * 3. dependentFieldId
 */
export const checkIsAiColumn = (col: TableColumnProps) => {
  return (
    col.actionKey === 'use-ai' ||
    col.actionKey?.includes('find') ||
    !!col.dependentFieldId
  );
};
