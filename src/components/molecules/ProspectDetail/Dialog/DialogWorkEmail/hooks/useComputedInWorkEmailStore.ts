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

  const matchActionKeyToIntegration = (actionKey: MathIntegrationTypeEnum) => {
    const integrationActionType = MATH_INTEGRATION_TO_ACTION_TYPE[actionKey];
    if (integrationActionType) {
      setIntegrationActionType(integrationActionType);
    }
  };

  return {
    integrationsInWaterfall,
    waterfallAllInputs,
    isMissingConfig,
    matchActionKeyToIntegration,
  };
};
