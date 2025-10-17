import { useWorkEmailStore } from '@/stores/Prospect';
import { useProspectTableStore } from '@/stores/Prospect/useProspectTableStore';

import {
  IntegrationActionInputParams,
  IntegrationActionType,
  MathIntegrationTypeEnum,
} from '@/types/Prospect';

export const useComputedInWorkEmailStore = () => {
  const { allIntegrations, setIntegrationActionType } = useWorkEmailStore(
    (store) => store,
  );
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

  return {
    integrationsInWaterfall,
    waterfallAllInputs,
    isMissingConfig,
    matchActionKeyToIntegration,
  };
};
