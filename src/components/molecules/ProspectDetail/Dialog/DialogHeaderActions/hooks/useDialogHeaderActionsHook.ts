import {
  ActiveTypeEnum,
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

export const useDialogHeaderActionsHook = () => {
  const { closeDialog } = useProspectTableStore((store) => store);
  const {
    setWorkEmailVisible,
    fetchIntegrations,
    // setDialogHeaderName,
    // setWaterfallDescription,
    setIntegrationActionType,
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
      onClick: () => {
        handleClose();
        setWorkEmailVisible(true);
        //TODO
        // setDialogHeaderName('Work Email');
        setIntegrationActionType(IntegrationActionType.work_email);
        fetchIntegrations();
      },
      type: ActionsChildrenTypeEnum.integration,
      cost: 4,
      integrationCost: 2,
      integrationIcon: ICON_INTEGRATION_WORK_EMAIL,
    },
    {
      icon: ICON_WORK_EMAIL,
      title: 'Personal Email',
      onClick: () => {
        handleClose();
        setWorkEmailVisible(true);
        //TODO
        // setDialogHeaderName('Work Email');
        setIntegrationActionType(IntegrationActionType.personal_email);
        fetchIntegrations();
      },
      type: ActionsChildrenTypeEnum.integration,
      cost: 4,
      integrationCost: 2,
      integrationIcon: ICON_INTEGRATION_PERSONAL_EMAIL,
    },
    {
      icon: ICON_PHONE_NUMBER,
      title: 'Phone Number',
      onClick: () => {
        handleClose();
        setWorkEmailVisible(true);
        //TODO
        // setDialogHeaderName('Phone Number');
        setIntegrationActionType(IntegrationActionType.phone_number);
        fetchIntegrations();
      },
      type: ActionsChildrenTypeEnum.integration,
      cost: 4,
      integrationCost: 2,
      integrationIcon: ICON_INTEGRATION_PHONE_NUMBER,
    },
  ];

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
