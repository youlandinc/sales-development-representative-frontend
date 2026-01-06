import { useTableColumns } from '@/stores/enrichment';
import { TableColumnProps } from '@/types/enrichment/table';

export const useVariableFromStore = () => {
  // Get merged columns
  const columns = useTableColumns();
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
