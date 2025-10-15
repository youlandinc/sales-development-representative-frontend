import { SDRToast } from '@/components/atoms';
import { columnRun } from '@/request';
import { HttpError } from '@/types';
import { useAsyncFn } from './useAsyncFn';

export const useRunAi = () => {
  const [runAiState, runAi] = useAsyncFn(
    async (param: {
      tableId: string;
      recordCount: number;
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
