import { TableColumnProps } from '@/types/enrichment/table';

import { useMergedColumns } from './useMergedColumns';

export const useFieldMapping = () => {
  // Get merged columns
  const columns = useMergedColumns();
  const filedMapping = columns.reduce(
    (pre: Record<string, string>, cur: TableColumnProps) => {
      pre[cur.fieldName] = cur.fieldId;
      return pre;
    },
    {} as Record<string, string>,
  );
  return {
    filedMapping,
  };
};
