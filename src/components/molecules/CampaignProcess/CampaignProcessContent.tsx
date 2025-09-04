import { useMemo } from 'react';
import { Stack } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import {
  CampaignProcessContentAiTable,
  CampaignProcessContentAudience,
  CampaignProcessContentChat,
  CampaignProcessContentChoose,
  CampaignProcessContentCRM,
  CampaignProcessContentCSV,
  CampaignProcessContentFilter,
  CampaignProcessContentLunch,
  CampaignProcessContentMessaging,
  CampaignProcessContentSavedList,
} from './index';
import { ProcessCreateTypeEnum } from '@/types';
import { StyledLoading } from '@/components/atoms';

export const CampaignProcessContent = () => {
  const { activeStep, leadsVisible, campaignType, detailsFetchLoading } =
    useDialogStore();

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
        return activeStep === 1 && <CampaignProcessContentCRM />;
      case ProcessCreateTypeEnum.csv:
        return activeStep === 1 && <CampaignProcessContentCSV />;
      case ProcessCreateTypeEnum.agent:
        return <CampaignProcessContentChat />;
      case ProcessCreateTypeEnum.saved_list:
        return activeStep === 1 && <CampaignProcessContentSavedList />;
      case ProcessCreateTypeEnum.ai_table:
        return activeStep === 1 && <CampaignProcessContentAiTable />;
      default:
        return <></>;
    }
  }, [activeStep, campaignType]);

  return (
    <Stack
      flexDirection={'row'}
      gap={leadsVisible ? 3 : 0}
      height={activeStep === 1 ? '60vh' : '100%'}
      justifyContent={'center'}
      minHeight={activeStep === 1 ? 480 : 'auto'}
      minWidth={activeStep === 1 ? 900 : !activeStep ? 1152 : 1200}
      overflow={activeStep === 1 ? 'hidden' : 'unset'}
      pt={3}
      width={'100%'}
    >
      {detailsFetchLoading ? (
        <StyledLoading size={48} sx={{ my: 'auto' }} />
      ) : (
        <>
          {renderNode}
          {renderContent}
        </>
      )}
    </Stack>
  );
};
