import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

import { useEnrichmentTableStore } from '@/stores/enrichment/useEnrichmentTableStore';
import {
  ActiveTypeEnum,
  useWebResearchStore,
} from '@/stores/enrichment/useWebResearchStore';
import { useWorkEmailStore } from '@/stores/enrichment/useWorkEmailStore';

import {
  ActionsTypeKeyEnum,
  SuggestionItem,
} from '@/types/enrichment/drawerActions';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

export const useDialogActionsMenu = () => {
  // Store selectors
  const { openDialog } = useEnrichmentTableStore(
    useShallow((state) => ({
      openDialog: state.openDialog,
    })),
  );

  const {
    setActiveType,
    setDialogHeaderName,
    setWaterfallDescription,
    setAllIntegrations,
    setValidationOptions,
    integrationMenus,
  } = useWorkEmailStore(
    useShallow((state) => ({
      setActiveType: state.setActiveType,
      setDialogHeaderName: state.setDialogHeaderName,
      setWaterfallDescription: state.setWaterfallDescription,
      setAllIntegrations: state.setAllIntegrations,
      setValidationOptions: state.setValidationOptions,
      integrationMenus: state.integrationMenus,
    })),
  );

  const { runGenerateAiModel, setGenerateText, setGenerateSchemaStr } =
    useWebResearchStore(
      useShallow((state) => ({
        runGenerateAiModel: state.runGenerateAiModel,
        setGenerateText: state.setGenerateText,
        setGenerateSchemaStr: state.setGenerateSchemaStr,
      })),
    );

  const onClickToAiTemplate = useCallback(
    async (templatePrompt: string) => {
      setGenerateText('');
      setGenerateSchemaStr('');
      // allClear();
      openDialog(TableColumnMenuActionEnum.ai_agent);
      await runGenerateAiModel('/aiResearch/generate/stream', {
        params: {
          userInput: templatePrompt,
        },
      });
    },
    [
      // allClear,
      openDialog,
      runGenerateAiModel,
      setGenerateSchemaStr,
      setGenerateText,
    ],
  );

  const onWorkEmailItemClick = useCallback(
    (key: string) => {
      const integration = integrationMenus.find((i) => i.key === key);
      openDialog(TableColumnMenuActionEnum.work_email);
      setDialogHeaderName(integration?.name ?? '');
      setWaterfallDescription(integration?.description ?? '');
      setActiveType(ActiveTypeEnum.add);
      setAllIntegrations(integration?.waterfallConfigs ?? []);
      setValidationOptions(integration?.validations || []);
    },
    [
      integrationMenus,
      openDialog,
      setActiveType,
      setAllIntegrations,
      setDialogHeaderName,
      setValidationOptions,
      setWaterfallDescription,
    ],
  );

  const onItemClick = useCallback(
    (item: SuggestionItem) => {
      if (item?.key === ActionsTypeKeyEnum.ai_template) {
        const description =
          (item.description ?? '') || (item.shortDescription ?? '');
        onClickToAiTemplate(`Name:${item.name},Description:${description}`);
        return;
      }
      onWorkEmailItemClick(item.key);
    },
    [onWorkEmailItemClick, onClickToAiTemplate],
  );
  return { onItemClick, onWorkEmailItemClick, onClickToAiTemplate };
};
