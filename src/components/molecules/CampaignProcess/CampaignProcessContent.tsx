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
  const { activeStep } = useDialogStore();

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
      gap={3}
      height={activeStep === 1 ? '60vh' : '100%'}
      justifyContent={'center'}
      minHeight={480}
      pt={3}
      width={'100%'}
    >
      <CampaignProcessContentChat />
      {renderContent}
    </Stack>
  );
};
