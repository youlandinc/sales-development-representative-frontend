import {
  useProspectTableStore,
  useWebResearchStore,
  useWorkEmailStore,
} from '@/stores/enrichment';
import { SyntheticEvent, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import ICON_SUGGESTIONS from '@/components/molecules/EnrichmentDetail/assets/dialog/headerActions/icon_suggestions.svg';
import ICON_AI from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle.svg';

import { ActiveTypeEnum } from '@/types';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

export const useDialogHeaderActionsHook = () => {
  const closeDialog = useProspectTableStore((store) => store.closeDialog);

  const {
    setActiveType,
    integrationMenus,
    setDialogHeaderName,
    setWaterfallDescription,
    setAllIntegrations,
    setValidationOptions,
  } = useWorkEmailStore(
    useShallow((state) => ({
      setActiveType: state.setActiveType,
      integrationMenus: state.integrationMenus,
      setDialogHeaderName: state.setDialogHeaderName,
      setWaterfallDescription: state.setWaterfallDescription,
      setAllIntegrations: state.setAllIntegrations,
      setValidationOptions: state.setValidationOptions,
    })),
  );

  const setWebResearchVisible = useWebResearchStore(
    (state) => state.setWebResearchVisible,
  );
  const openDialog = useProspectTableStore((state) => state.openDialog);

  const [value, setValue] = useState<'Enrichments' | 'Campaign'>('Enrichments');

  const handleTabChange = (
    _: SyntheticEvent,
    value: 'Enrichments' | 'Campaign',
  ) => {
    setValue(value);
  };

  const handleClose = () => {
    closeDialog();
    setValue('Enrichments');
  };

  const handleEnrichmentClick = () => {
    handleClose();
    setWebResearchVisible(true, ActiveTypeEnum.add);
  };

  const ENRICHMENTS_SUGGESTION_MENUS = {
    icon: ICON_SUGGESTIONS,
    title: 'Suggestions',
    children: integrationMenus.map((item) => ({
      ...item,
      onClick: () => {
        openDialog(TableColumnMenuActionEnum.work_email);
        setDialogHeaderName(item.name);
        setWaterfallDescription(item.description);
        setActiveType(ActiveTypeEnum.add);
        setAllIntegrations(item.waterfallConfigs || []);
        setValidationOptions(item.validations);
      },
    })),
  };

  const ENRICHMENTS_AI_CHILDREN = [
    {
      title: 'AI Web Researcher',
      onClick: handleEnrichmentClick,
    },
  ];

  const ENRICHMENTS_AI_MENUS = {
    icon: ICON_AI,
    title: 'AI',
    children: ENRICHMENTS_AI_CHILDREN,
  };

  const ENRICHMENTS_MENUS = [
    ENRICHMENTS_SUGGESTION_MENUS,
    ENRICHMENTS_AI_MENUS,
  ];

  return {
    ENRICHMENTS_AI_MENUS,
    ENRICHMENTS_SUGGESTION_MENUS,
    ENRICHMENTS_MENUS,
    handleTabChange,
    tabValue: value,
  };
};
