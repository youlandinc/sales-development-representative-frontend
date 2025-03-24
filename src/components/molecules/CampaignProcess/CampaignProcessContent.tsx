import { useMemo } from 'react';
import { Stack } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import {
  CampaignProcessContentAudience,
  CampaignProcessContentChat,
  CampaignProcessContentChoose,
  CampaignProcessContentFilter,
  CampaignProcessContentLunch,
  CampaignProcessContentMessaging,
} from './index';
import { ProcessCreateTypeEnum } from '@/types';

export const CampaignProcessContent = () => {
  const { activeStep, leadsVisible, campaignType } = useDialogStore();

  const renderContent = useMemo(() => {
    switch (activeStep) {
      case 1:
        return <CampaignProcessContentAudience />;
      case 2:
        return <CampaignProcessContentMessaging />;
      case 3:
        return <CampaignProcessContentLunch />;
      default:
        return <></>;
    }
  }, [activeStep]);

  const renderNode = useMemo(() => {
    if (!activeStep) {
      return <CampaignProcessContentChoose />;
    }
    switch (campaignType) {
      case ProcessCreateTypeEnum.filter:
        return activeStep === 1 && <CampaignProcessContentFilter />;
      case ProcessCreateTypeEnum.crm:
      case ProcessCreateTypeEnum.csv:
      case ProcessCreateTypeEnum.agent:
        return <CampaignProcessContentChat />;
      default:
        return <></>;
    }
  }, [activeStep, campaignType]);

  console.log(leadsVisible);

  return (
    <Stack
      flexDirection={'row'}
      gap={leadsVisible ? 3 : 0}
      height={activeStep === 1 ? '60vh' : '100%'}
      justifyContent={'center'}
      minHeight={activeStep === 1 ? 480 : 'auto'}
      overflow={'hidden'}
      width={'100%'}
    >
      {renderNode}
      {renderContent}
    </Stack>
  );
};
