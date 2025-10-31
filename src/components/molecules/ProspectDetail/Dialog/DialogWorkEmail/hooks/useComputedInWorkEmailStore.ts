import { useWorkEmailStore } from '@/stores/Prospect';

import {
  IntegrationActionInputParams,
  IntegrationActionType,
  MATH_INTEGRATION_TO_ACTION_TYPE,
  MathIntegrationTypeEnum,
} from '@/types/Prospect';

export const useComputedInWorkEmailStore = () => {
  const { allIntegrations, setIntegrationActionType } = useWorkEmailStore(
    (store) => store,
  );

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
  );

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
    if (actionKey.includes(MathIntegrationTypeEnum.linkedin_profile)) {
      setIntegrationActionType(IntegrationActionType.linkedin_profile);
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
