import { useAsyncFn, useRunAi } from '@/hooks';
import { useWorkEmailStore } from '@/stores/Prospect';
import { useProspectTableStore } from '@/stores/Prospect/useProspectTableStore';

import { SDRToast } from '@/components/atoms';

import { _createIntegrationConfig } from '@/request/enrichments/integrations';

import {
  CreateWaterfallConfigRequestParam,
  IntegrationActionInputParams,
  IntegrationActionType,
  MathIntegrationTypeEnum,
} from '@/types/Prospect';
import { IntegrationSaveTypeParam } from '../data';

export const useComputedInWorkEmailStore = () => {
  const {
    allIntegrations,
    setIntegrationActionType,
    setWorkEmailVisible,
    integrationActionType,
  } = useWorkEmailStore((store) => store);
  const { runAi } = useRunAi();
  const { fetchTable } = useProspectTableStore();

  //computed info
  const { columns } = useProspectTableStore((store) => store);

  const integrationsInWaterfall = allIntegrations.filter((i) => i.isDefault);

  const waterfallAllInputs: (IntegrationActionInputParams & {
    actionKey: string;
  })[] = Object.values(
    integrationsInWaterfall
      .map((i) => i.inputParams.map((p) => ({ ...p, actionKey: i.actionKey })))
      .flat()
      .reduce(
        (acc, param) => {
          if (!acc[param.semanticType]) {
            acc[param.semanticType] = param;
          }
          return acc;
        },
        {} as Record<
          string,
          IntegrationActionInputParams & {
            actionKey: string;
          }
        >,
      ),
  ).map((i) => ({
    ...i,
    displayName:
      columns.find((c) => c.semanticType === i.semanticType)?.fieldName ||
      'Not found',
  }));

  const isMissingConfig = integrationsInWaterfall
    .map((item) => item.inputParams)
    .flat()
    .some((i) => !i.selectedOption);

  const matchActionKeyToIntegration = (actionKey: string) => {
    if (actionKey.includes(MathIntegrationTypeEnum.work_email)) {
      setIntegrationActionType(IntegrationActionType.work_email);
      return;
    }
    if (actionKey.includes(MathIntegrationTypeEnum.personal_email)) {
      setIntegrationActionType(IntegrationActionType.personal_email);
      return;
    }
    if (actionKey.includes(MathIntegrationTypeEnum.phone_number)) {
      setIntegrationActionType(IntegrationActionType.phone_number);
      return;
    }
  };

  //request
  const integrationSaveTypeParam =
    IntegrationSaveTypeParam[integrationActionType];
  const requestParams: CreateWaterfallConfigRequestParam = {
    waterfallFieldName: integrationSaveTypeParam,
    waterfallGroupName: integrationSaveTypeParam,
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
          runAi({
            tableId: tableId,
            recordCount: recordCount,
            fieldIds: fieldIdsWithGroupId,
          });
        }
      } catch (error) {
        const { header, message, variant } = error as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    [requestParams],
  );

  return {
    integrationsInWaterfall,
    waterfallAllInputs,
    isMissingConfig,
    matchActionKeyToIntegration,
    saveOrRunIntegration,
    saveOrRunIntegrationState,
  };
};
