import { useMemo } from 'react';
import { Stack } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';
import { CampaignStepEnum, ProcessCreateTypeEnum } from '@/types';

import { StyledLoading } from '@/components/atoms';

import {
  ContentChoose,
  ContentLaunch,
  ContentMessaging,
  ContentPrepare,
  DataSourceAiTable,
  DataSourceCRM,
  DataSourceCSV,
} from './index';

export const CampaignProcessContent = () => {
  const { activeStep, campaignType, detailsFetchLoading } = useDialogStore();

  const renderContent = useMemo(() => {
    switch (activeStep) {
      case CampaignStepEnum.choose:
        return <ContentChoose />;
      case CampaignStepEnum.prepare:
        return <ContentPrepare />;
      case CampaignStepEnum.audience:
        switch (campaignType) {
          case ProcessCreateTypeEnum.ai_table:
            return <DataSourceAiTable />;
          case ProcessCreateTypeEnum.crm:
            return <DataSourceCRM />;
          case ProcessCreateTypeEnum.csv:
            return <DataSourceCSV />;
          default:
            return <></>;
        }
      case CampaignStepEnum.messaging:
        return <ContentMessaging />;
      case CampaignStepEnum.launch:
        return <ContentLaunch />;
      default:
        return <></>;
    }
  }, [activeStep, campaignType]);

  const isAudienceStep = useMemo(
    () => activeStep === CampaignStepEnum.audience,
    [activeStep],
  );

  const containerHeight = useMemo(
    () => (isAudienceStep ? '60vh' : '100%'),
    [isAudienceStep],
  );

  const containerMinHeight = useMemo(
    () => (isAudienceStep ? 480 : 'auto'),
    [isAudienceStep],
  );

  const containerOverflow = useMemo(
    () => (isAudienceStep ? 'hidden' : 'unset'),
    [isAudienceStep],
  );

  return (
    <Stack
      flexDirection={'row'}
      height={containerHeight}
      justifyContent={'center'}
      minHeight={containerMinHeight}
      overflow={containerOverflow}
      pt={3}
      width={'100%'}
    >
      {detailsFetchLoading ? (
        <StyledLoading size={48} sx={{ my: 'auto' }} />
      ) : (
        renderContent
      )}
    </Stack>
  );
};
