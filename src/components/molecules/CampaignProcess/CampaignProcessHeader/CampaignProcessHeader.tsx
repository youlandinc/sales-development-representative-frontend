import { FC, useMemo } from 'react';

import { useDialogStore } from '@/stores/useDialogStore';

import {
  HeaderAudience,
  HeaderChoose,
  HeaderLaunch,
  HeaderMessaging,
  HeaderPrepare,
} from './index';

import { CampaignStepEnum } from '@/types';

export const CampaignProcessHeader: FC = () => {
  const { activeStep } = useDialogStore();

  return useMemo(() => {
    switch (activeStep) {
      case CampaignStepEnum.choose:
        return <HeaderChoose />;
      case CampaignStepEnum.audience:
        return <HeaderAudience />;
      case CampaignStepEnum.messaging:
        return <HeaderMessaging />;
      case CampaignStepEnum.launch:
        return <HeaderLaunch />;
      case CampaignStepEnum.prepare:
      default:
        return <HeaderPrepare />;
    }
  }, [activeStep]);
};
