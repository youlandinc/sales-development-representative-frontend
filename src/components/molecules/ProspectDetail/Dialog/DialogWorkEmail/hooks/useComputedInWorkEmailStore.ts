import { useMemo } from 'react';

import { useWorkEmailStore } from '@/stores/Prospect';

import { IntegrationActionInputParams } from '@/types/Prospect';

export const useComputedInWorkEmailStore = () => {
  const { allIntegrations } = useWorkEmailStore((store) => store);

  const integrationsInWaterfall = useMemo(
    () =>
      allIntegrations
        .filter((i) => i.isDefault)
        .map((i) => ({
          ...i,
          isMissingRequired: i.inputParams
            .filter((item) => item.isRequired)
            .some((p) => !p.selectedOption),
        })),
    [allIntegrations],
  );

  const waterfallAllInputs = useMemo((): (IntegrationActionInputParams & {
    actionKey: string;
  })[] => {
    const inputMap = new Map<
      string,
      IntegrationActionInputParams & { actionKey: string }
    >();

    integrationsInWaterfall.forEach((integration) => {
      integration.inputParams.forEach((param) => {
        if (!inputMap.has(param.semanticType)) {
          inputMap.set(param.semanticType, {
            ...param,
            actionKey: integration.actionKey,
          });
        }
      });
    });

    return Array.from(inputMap.values());
  }, [integrationsInWaterfall]);

  const isMissingConfig = useMemo(
    () =>
      integrationsInWaterfall.some((integration) =>
        integration.inputParams.some((param) => !param.selectedOption),
      ),
    [integrationsInWaterfall],
  );

  const hasConfigCount = useMemo(
    () =>
      integrationsInWaterfall.filter((item) =>
        item.inputParams.every((p) => !!p.selectedOption),
      ).length,
    [integrationsInWaterfall],
  );

  return {
    integrationsInWaterfall,
    waterfallAllInputs,
    isMissingConfig,
    hasConfigCount, // 如果需要在其他地方使用
  };
};
