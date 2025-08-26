import { useProspectTableStore } from '@/stores/Prospect';

export const useVariableFromStore = () => {
  const { columns } = useProspectTableStore((store) => store);
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
