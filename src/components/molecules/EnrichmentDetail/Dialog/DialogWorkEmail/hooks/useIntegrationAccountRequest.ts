import { useShallow } from 'zustand/react/shallow';

import { SDRToast } from '@/components/atoms';

import { useAsyncFn } from '@/hooks';
import {
  useColumnRunAi,
  useMergedColumns,
} from '@/components/molecules/EnrichmentDetail/hooks';
import {
  _saveIntegrationConfig,
  _updateIntegrationConfig,
} from '@/request/enrichment/integrations';
import {
  ActiveTypeEnum,
  useActionsStore,
  useEnrichmentTableStore,
  useWorkEmailStore,
} from '@/stores/enrichment';
import { HttpError } from '@/types';
import { TableColumnProps } from '@/types/enrichment/table';

export const useIntegrationAccountRequest = (cb?: () => void) => {
  const { fetchActionsMenus } = useActionsStore(
    useShallow((state) => ({
      fetchActionsMenus: state.fetchActionsMenus,
    })),
  );
  const { activeType } = useWorkEmailStore(
    useShallow((state) => ({
      activeType: state.activeType,
    })),
  );

  const { fetchTable, closeDialog } = useEnrichmentTableStore(
    useShallow((state) => ({
      fetchTable: state.fetchTable,
      closeDialog: state.closeDialog,
    })),
  );

  // Get merged columns
  const columns = useMergedColumns();
  const { runAi } = useColumnRunAi();
  const [saveState, saveOrRunIntegrationAccount] = useAsyncFn(
    async (
      param: {
        tableId: string;
        actionKey: string;
        inputBinding: {
          name: string;
          formulaText: string;
        }[];
      },
      isRunAi: boolean,
      recordCount = 10,
    ) => {
      try {
        if (activeType === ActiveTypeEnum.add) {
          await _saveIntegrationConfig(param);
          const { metaColumns: newColumns } = await fetchTable(param.tableId);
          const fieldIdsWithGroupId = newColumns?.map(
            (col: TableColumnProps) => col.fieldId,
          );
          closeDialog();
          if (isRunAi) {
            await runAi({
              tableId: param.tableId,
              recordCount: recordCount,
              fieldIds: fieldIdsWithGroupId,
            });
            // await fetchTable(param.tableId);
            cb?.();
          }
        }
        //TODO
        if (activeType === ActiveTypeEnum.edit) {
          const { activeColumnId } = useEnrichmentTableStore.getState();
          await _updateIntegrationConfig({
            tableId: param.tableId,
            fieldId: activeColumnId,
            inputBinding: param.inputBinding,
          });
          await fetchTable(param.tableId);
          closeDialog();
          if (isRunAi) {
            const fieldIdsWithGroupId = columns?.map(
              (col: TableColumnProps) => col.fieldId,
            );
            await runAi({
              tableId: param.tableId,
              recordCount: recordCount,
              fieldIds: fieldIdsWithGroupId,
            });
            // await fetchTable(param.tableId);
            cb?.();
          }
        }
        fetchActionsMenus(param.tableId);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        return Promise.reject(err);
      }
    },
    [activeType, columns, fetchTable, runAi, closeDialog],
  );

  return {
    saveState,
    saveOrRunIntegrationAccount,
  };
};
