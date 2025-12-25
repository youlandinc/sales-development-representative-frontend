import { useEnrichmentTableStore } from '@/stores/enrichment';

export const useVariableFromStore = () => {
  const { columns } = useEnrichmentTableStore((store) => store);
  const filedMapping = columns.reduce(
    (pre, cur) => {
      pre[cur.fieldName] = cur.fieldId;
      return pre;
    },
    {} as Record<string, string>,
  );
  return {
    filedMapping,
  };
};
