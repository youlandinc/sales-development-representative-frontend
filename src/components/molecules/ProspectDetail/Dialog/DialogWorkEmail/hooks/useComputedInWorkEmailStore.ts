import { useWorkEmailStore } from '@/stores/Prospect';
import { useProspectTableStore } from '@/stores/Prospect/useProspectTableStore';

import { IntegrationActionInputParams } from '@/types/Prospect/tableActions';

export const useComputedInWorkEmailStore = () => {
  const { allIntegrations } = useWorkEmailStore((store) => store);
  const { columns } = useProspectTableStore((store) => store);

  const integrationsInWaterfall = allIntegrations.filter((i) => i.isDefault);

  const waterfallAllInputs = Object.values(
    integrationsInWaterfall
      .map((i) => i.inputParams)
      .flat()
      .reduce(
        (acc, param) => {
          if (!acc[param.semanticType]) {
            acc[param.semanticType] = param;
          }
          return acc;
        },
        {} as Record<string, IntegrationActionInputParams>,
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
