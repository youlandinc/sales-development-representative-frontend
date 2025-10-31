import { useWorkEmailStore } from '@/stores/Prospect';

import { IntegrationActionInputParams } from '@/types/Prospect';

export const useComputedInWorkEmailStore = () => {
  const { allIntegrations } = useWorkEmailStore((store) => store);

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

  return {
    integrationsInWaterfall,
    waterfallAllInputs,
    isMissingConfig,
  };
};
