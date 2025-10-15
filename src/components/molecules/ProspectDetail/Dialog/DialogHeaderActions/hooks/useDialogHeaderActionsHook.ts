import { SyntheticEvent, useState } from 'react';
import {
  ActiveTypeEnum,
  useProspectTableStore,
  useWebResearchStore,
  useWorkEmailStore,
} from '@/stores/Prospect';
import { useDialogStore } from '@/stores/useDialogStore';

import ICON_SUGGESTIONS from '../../../assets/dialog/headerActions/icon_suggestions.svg';
import ICON_WORK_EMAIL from '../../../assets/dialog/headerActions/icon_suggestions_work_email.svg';
import ICON_PHONE_NUMBER from '../../../assets/dialog/headerActions/icon_suggestions_phone_number.svg';
import ICON_AI from '../../../assets/dialog/icon_sparkle_blue.svg';
import { CostCoins } from '../../DialogWebResearch';

export const useDialogHeaderActionsHook = () => {
  const { dialogType, closeDialog, dialogVisible } = useProspectTableStore(
    (store) => store,
  );
  const {
    openProcess,
    setCampaignType,
    setEnrichmentTableDisabled,
    setLeadsVisible,
  } = useDialogStore();
  const { setWorkEmailVisible, fetchIntegrations } = useWorkEmailStore(
    (state) => state,
  );

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
        fetchIntegrations();
      },
    },
    {
      icon: ICON_WORK_EMAIL,
      title: 'Personal Email',
      onClick: () => {},
    },
    {
      icon: ICON_PHONE_NUMBER,
      title: 'Phone Number',
      onClick: () => {},
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
