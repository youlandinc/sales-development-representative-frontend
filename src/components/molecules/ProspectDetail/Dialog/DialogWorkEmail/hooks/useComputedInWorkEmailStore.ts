import { useWorkEmailStore } from '@/stores/Prospect';
import { useProspectTableStore } from '@/stores/Prospect/useProspectTableStore';

import { IntegrationActionInputParams } from '@/types/Prospect/tableActions';

export const useComputedInWorkEmailStore = () => {
  const { allIntegrations } = useWorkEmailStore((store) => store);
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

  return {
    integrationsInWaterfall,
    waterfallAllInputs,
  };
};
