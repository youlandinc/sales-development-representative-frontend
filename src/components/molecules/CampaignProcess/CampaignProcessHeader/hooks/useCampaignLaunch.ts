import { useState } from 'react';
import { addDays, differenceInCalendarDays } from 'date-fns';

import { useDialogStore } from '@/stores/useDialogStore';

import { _saveAndLaunchCampaign } from '@/request';
import {
  CampaignStepEnum,
  HttpError,
  HttpVariantEnum,
  SetupPhaseEnum,
} from '@/types';

import { SDRToast } from '@/components/atoms';

export const useCampaignLaunch = () => {
  const {
    activeStep,
    setActiveStep,
    setSetupPhase,
    launchInfo,
    resetDialogState,
    setIsValidate,
    campaignId,
    setReloadTable,
  } = useDialogStore();

  const [loading, setLoading] = useState(false);

  const onClickToNext = async () => {
    if (activeStep === CampaignStepEnum.messaging) {
      setActiveStep(CampaignStepEnum.launch);
      await setSetupPhase(SetupPhaseEnum.launch);
      return;
    }

    if (!campaignId) {
      return;
    }

    if (!launchInfo.sendNow) {
      if (
        !launchInfo.scheduleTime ||
        differenceInCalendarDays(
          launchInfo.scheduleTime,
          addDays(new Date(), 1),
        ) < 0
      ) {
        setIsValidate(false);
        return;
      }
    }

    const postData = {
      campaignId: campaignId!,
      dailyLimit: launchInfo.dailyLimit,
      autopilot: launchInfo.autopilot,
      sendNow: launchInfo.sendNow,
      scheduleTime: launchInfo.scheduleTime || null,
      // sender: launchInfo.sender!,
      // senderName: launchInfo.senderName!,
      // signatureId: launchInfo.signatureId,
      emilProfileId: launchInfo.emilProfileId,
    };
    setLoading(true);
    try {
      await _saveAndLaunchCampaign(postData);
      SDRToast({
        message: 'Campaign launched successfully!',
        variant: HttpVariantEnum.success,
        header: '',
      });
      await resetDialogState();
      setReloadTable(true);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    onClickToNext,
  };
};
