import {
  useProspectTableStore,
  useWebResearchStore,
  useWorkEmailStore,
} from '@/stores/Prospect';
import { SyntheticEvent, useState } from 'react';

import ICON_SUGGESTIONS from '@/components/molecules/ProspectDetail/assets/dialog/headerActions/icon_suggestions.svg';
import ICON_AI from '@/components/molecules/ProspectDetail/assets/dialog/icon_sparkle.svg';

import { ActiveTypeEnum } from '@/types';

export const useDialogHeaderActionsHook = () => {
  const { closeDialog } = useProspectTableStore((store) => store);
  const {
    setWorkEmailVisible,
    setActiveType,
    integrationMenus,
    setDialogHeaderName,
    setWaterfallDescription,
    setAllIntegrations,
  } = useWorkEmailStore((state) => state);

  const { setWebResearchVisible } = useWebResearchStore((state) => state);

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

  // const ENRICHMENTS_SUGGESTION_CHILDREN = [
  //   {
  //     icon: ICON_WORK_EMAIL,
  //     title: 'Work Email',
  //     key: IntegrationActionType.work_email,
  //     type: ActionsChildrenTypeEnum.integration,
  //     cost: 4,
  //     integrationCost: 2,
  //     integrationIcon: ICON_INTEGRATION_WORK_EMAIL,
  //   },
  //   {
  //     icon: ICON_WORK_EMAIL,
  //     title: 'Personal Email',
  //     key: IntegrationActionType.personal_email,
  //     type: ActionsChildrenTypeEnum.integration,
  //     cost: 4,
  //     integrationCost: 2,
  //     integrationIcon: ICON_INTEGRATION_PERSONAL_EMAIL,
  //   },
  //   {
  //     icon: ICON_PHONE_NUMBER,
  //     title: 'Phone Number',
  //     key: IntegrationActionType.phone_number,

  //     type: ActionsChildrenTypeEnum.integration,
  //     cost: 6,
  //     integrationCost: 3,
  //     integrationIcon: ICON_INTEGRATION_PHONE_NUMBER,
  //   },
  //   {
  //     icon: ICON_PHONE_NUMBER,
  //     title: 'LinkedIn Profile',
  //     key: IntegrationActionType.linkedin_profile,

  //     type: ActionsChildrenTypeEnum.integration,
  //     cost: 6,
  //     integrationCost: 3,
  //     integrationIcon: ICON_INTEGRATION_PHONE_NUMBER,
  //   },
  // ];

  const ENRICHMENTS_SUGGESTION_MENUS = {
    icon: ICON_SUGGESTIONS,
    title: 'Suggestions',
    children: integrationMenus.map((item) => ({
      ...item,
      onClick: () => {
        handleClose();
        setWorkEmailVisible(true);
        setDialogHeaderName(item.name);
        setWaterfallDescription(item.description);
        setActiveType(ActiveTypeEnum.add);
        setAllIntegrations(item.waterfallConfigs);
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
