import {
  useProspectTableStore,
  useWebResearchStore,
  useWorkEmailStore,
} from '@/stores/Prospect';
import { SyntheticEvent, useState } from 'react';

import {
  ActionsChildrenTypeEnum,
  IntegrationActionType,
} from '@/types/Prospect';

import ICON_SUGGESTIONS from '@/components/molecules/ProspectDetail/assets/dialog/headerActions/icon_suggestions.svg';
import ICON_PHONE_NUMBER from '@/components/molecules/ProspectDetail/assets/dialog/headerActions/icon_suggestions_phone_number.svg';
import ICON_WORK_EMAIL from '@/components/molecules/ProspectDetail/assets/dialog/headerActions/icon_suggestions_work_email.svg';
import ICON_AI from '@/components/molecules/ProspectDetail/assets/dialog/icon_sparkle_blue.svg';

import ICON_INTEGRATION_WORK_EMAIL from '@/components/molecules/ProspectDetail/assets/dialog/headerActions/icon_integration_work_email.svg';
import ICON_INTEGRATION_PERSONAL_EMAIL from '@/components/molecules/ProspectDetail/assets/dialog/headerActions/icon_integration_personal_email.svg';
import ICON_INTEGRATION_PHONE_NUMBER from '@/components/molecules/ProspectDetail/assets/dialog/headerActions/icon_integration_phone_number.svg';
import { ActiveTypeEnum } from '@/types';

export const useDialogHeaderActionsHook = () => {
  const { closeDialog } = useProspectTableStore((store) => store);
  const {
    setWorkEmailVisible,
    fetchIntegrations,
    // setDialogHeaderName,
    // setWaterfallDescription,
    setActiveType,
    setIntegrationActionType,
    editConfigParams,
    setEditConfigParams,
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

  const ENRICHMENTS_SUGGESTION_CHILDREN = [
    {
      icon: ICON_WORK_EMAIL,
      title: 'Work Email',
      key: IntegrationActionType.work_email,
      type: ActionsChildrenTypeEnum.integration,
      cost: 4,
      integrationCost: 2,
      integrationIcon: ICON_INTEGRATION_WORK_EMAIL,
    },
    {
      icon: ICON_WORK_EMAIL,
      title: 'Personal Email',
      key: IntegrationActionType.personal_email,
      type: ActionsChildrenTypeEnum.integration,
      cost: 4,
      integrationCost: 2,
      integrationIcon: ICON_INTEGRATION_PERSONAL_EMAIL,
    },
    {
      icon: ICON_PHONE_NUMBER,
      title: 'Phone Number',
      key: IntegrationActionType.phone_number,

      type: ActionsChildrenTypeEnum.integration,
      cost: 4,
      integrationCost: 2,
      integrationIcon: ICON_INTEGRATION_PHONE_NUMBER,
    },
  ].map((item) => ({
    ...item,
    onClick: () => {
      handleClose();
      setWorkEmailVisible(true);
      //TODO
      // setDialogHeaderName('Work Email');
      if (editConfigParams) {
        setEditConfigParams(null);
      }
      setActiveType(ActiveTypeEnum.add);
      setIntegrationActionType(item.key);
      fetchIntegrations();
    },
  }));

  const ENRICHMENTS_SUGGESTION_MENUS = {
    icon: ICON_SUGGESTIONS,
    title: 'Suggestions',
    children: ENRICHMENTS_SUGGESTION_CHILDREN,
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
