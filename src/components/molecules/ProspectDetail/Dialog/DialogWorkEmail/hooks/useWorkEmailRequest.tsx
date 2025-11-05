import { SDRToast } from '@/components/atoms';

import { useAsyncFn } from '@/hooks';
import { useWorkEmailStore } from '@/stores/Prospect';
import { useRunAi } from '@/hooks/useRunAi';
import { useProspectTableStore } from '@/stores/Prospect';
import { useComputedInWorkEmailStore } from './useComputedInWorkEmailStore';

import {
  _createIntegrationConfig,
  _editIntegrationConfig,
} from '@/request/enrichments/integrations';

import { ActiveTypeEnum, HttpError } from '@/types';
import { CreateWaterfallConfigRequestParam } from '@/types/Prospect';

import { useMemo } from 'react';

export const useWorkEmailRequest = (cb?: () => void) => {
  const { setWorkEmailVisible, dialogHeaderName, activeType, groupId } =
    useWorkEmailStore((store) => store);
  const { runAi } = useRunAi();
  const { fetchTable, columns } = useProspectTableStore();
  const { waterfallAllInputs, integrationsInWaterfall } =
    useComputedInWorkEmailStore();

  //request
  const integrationSaveTypeParam = dialogHeaderName;

  const requestParams: CreateWaterfallConfigRequestParam = {
    waterfallFieldName: integrationSaveTypeParam,
    waterfallGroupName: integrationSaveTypeParam,
    requiredInputsBinding: waterfallAllInputs.map((i) => ({
      name: i.columnName,
      formulaText: i.selectedOption?.value || '',
    })),
    waterfallConfigs: integrationsInWaterfall.map((item) => {
      const { inputParams, ...others } = item;
      return {
        ...others,
        inputParameters: inputParams.map((i) => ({
          name: i.columnName,
          formulaText: i.selectedOption?.value || '',
        })),
      };
    }),
  };

  const [saveOrRunIntegrationState, saveOrRunIntegration] = useAsyncFn(
    async (tableId: string, recordCount = 10, isRunAi = true) => {
      try {
        const { data } = await _createIntegrationConfig(tableId, requestParams);
        const { fields } = await fetchTable(tableId);
        const groupId = data;
        const fieldIdsWithGroupId = fields
          .filter((f) => f.groupId === groupId)
          ?.map((f) => f.fieldId);
        setWorkEmailVisible(false);

        if (isRunAi) {
          await runAi({
            tableId: tableId,
            recordCount: recordCount,
            fieldIds: fieldIdsWithGroupId,
          });
          await fetchTable(tableId);
          cb?.();
        }
      } catch (error) {
        const { header, message, variant } = error as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    [requestParams],
  );

  const [updateIntegrationState, updateIntegration] = useAsyncFn(
    async (tableId: string, recordCount = 10, isRunAi = true) => {
      if (!groupId) {
        return;
      }
      try {
        await _editIntegrationConfig(groupId, requestParams);
        await fetchTable(tableId);
        setWorkEmailVisible(false);

        if (isRunAi) {
          const fieldIdsWithGroupId = columns
            .filter((f) => f.groupId === groupId)
            ?.map((f) => f.fieldId);
          await runAi({
            tableId: tableId,
            recordCount: recordCount,
            fieldIds: fieldIdsWithGroupId,
          });
          await fetchTable(tableId);
          cb?.();
        }
      } catch (error) {
        const { header, message, variant } = error as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    [columns, requestParams, groupId],
  );

  const requestState = useMemo(() => {
    if (activeType === ActiveTypeEnum.add) {
      return {
        state: saveOrRunIntegrationState,
        request: saveOrRunIntegration,
      };
    }
    if (activeType === ActiveTypeEnum.edit) {
      return {
        state: updateIntegrationState,
        request: updateIntegration,
      };
    }
    return {
      state: null,
      request: null,
    };
  }, [
    activeType,
    saveOrRunIntegration,
    saveOrRunIntegrationState,
    updateIntegration,
    updateIntegrationState,
  ]);

  return {
    requestState,
  };
};
