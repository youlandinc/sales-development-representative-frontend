import { TableColumnProps } from '@/types/Prospect/table';

/**
 * 判断是否为 AI 列
 * 满足以下任一条件即为 AI 列：
 * 1. actionKey === 'use-ai'
 * 2. actionKey 包含 'find'
 * 3. 有 dependentFieldId
 */
export const isAiColumn = (col: TableColumnProps): boolean => {
  return (
    col.actionKey === 'use-ai' ||
    col.actionKey?.includes('find') ||
    !!col.dependentFieldId
  );
};
