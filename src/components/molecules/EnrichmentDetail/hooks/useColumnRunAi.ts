import { SDRToast } from '@/components/atoms';
import { useAsyncFn } from '@/hooks';
import { columnRun } from '@/request';
import { HttpError } from '@/types';

export const useColumnRunAi = () => {
  const [runAiState, runAi] = useAsyncFn(
    async (param: {
      tableId: string;
      recordCount?: number;
      recordIds?: string[];
      fieldId?: string;
      fieldIds?: string[];
    }) => {
      try {
        await columnRun(param);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        return Promise.reject(err);
      }
    },
    [],
  );
  return {
    runAiState,
    runAi,
  };
};
