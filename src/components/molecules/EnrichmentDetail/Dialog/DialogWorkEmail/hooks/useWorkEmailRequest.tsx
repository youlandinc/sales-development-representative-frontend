import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { SDRToast } from '@/components/atoms';

import { useAsyncFn } from '@/hooks';
import { useWorkEmailStore } from '@/stores/enrichment';
import { useRunAi } from '@/hooks/useRunAi';
import { useProspectTableStore } from '@/stores/enrichment';
import { useComputedInWorkEmailStore } from './useComputedInWorkEmailStore';

import {
  _createIntegrationConfig,
  _editIntegrationConfig,
} from '@/request/enrichment/integrations';

import { ActiveTypeEnum, HttpError } from '@/types';
import { CreateWaterfallConfigRequestParam } from '@/types/enrichment';

import { useActionsStore } from '@/stores/enrichment/useActionsStore';

export const useWorkEmailRequest = (tableId: string, cb?: () => void) => {
  const {
    dialogHeaderName,
    activeType,
    groupId,
    validationOptions,
    requireValidationSuccess,
    safeToSend,
    selectedValidationOption,
  } = useWorkEmailStore(
    useShallow((state) => ({
      dialogHeaderName: state.dialogHeaderName,
      activeType: state.activeType,
      groupId: state.groupId,
      validationOptions: state.validationOptions,
      requireValidationSuccess: state.requireValidationSuccess,
      safeToSend: state.safeToSend,
      selectedValidationOption: state.selectedValidationOption,
    })),
  );
  const { runAi } = useRunAi();

  const { closeDialog, columns, fetchTable } = useProspectTableStore(
    useShallow((state) => ({
      rowIds: state.rowIds,
      activeColumnId: state.activeColumnId,
      openDialog: state.openDialog,
      closeDialog: state.closeDialog,
      columns: state.columns,
      fetchTable: state.fetchTable,
    })),
  );
  const { waterfallAllInputs, integrationsInWaterfall } =
    useComputedInWorkEmailStore();

  const { fetchActionsMenus } = useActionsStore(
    useShallow((state) => ({
      fetchActionsMenus: state.fetchActionsMenus,
    })),
  );

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
    validationActionConfig:
      validationOptions && validationOptions.length > 0
        ? {
            actionKey: selectedValidationOption || '',
            safeToSend,
            requireValidationSuccess,
          }
        : undefined,
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
        closeDialog();
        fetchActionsMenus(tableId);
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
    [requestParams, tableId],
  );

  const [updateIntegrationState, updateIntegration] = useAsyncFn(
    async (tableId: string, recordCount = 10, isRunAi = true) => {
      if (!groupId) {
        return;
      }
      try {
        await _editIntegrationConfig(groupId, requestParams);
        await fetchTable(tableId);
        closeDialog();
        fetchActionsMenus(tableId);
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
    [columns, requestParams, groupId, tableId],
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
