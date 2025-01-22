import { useMemo } from 'react';
import { Stack } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import {
  CampaignProcessContentAudience,
  CampaignProcessContentChat,
  CampaignProcessContentLunch,
  CampaignProcessContentMessaging,
} from './index';

export const CampaignProcessContent = () => {
  const { activeStep, leadsVisible } = useDialogStore();

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

  return (
    <Stack
      flexDirection={'row'}
      gap={leadsVisible ? 3 : 0}
      height={activeStep === 1 ? '60vh' : '100%'}
      justifyContent={'center'}
      minHeight={480}
      width={'100%'}
    >
      <CampaignProcessContentChat />
      {renderContent}
    </Stack>
  );
};
