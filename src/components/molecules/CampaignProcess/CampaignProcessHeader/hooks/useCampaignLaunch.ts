import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
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
  } = useDialogStore(
    useShallow((state) => ({
      activeStep: state.activeStep,
      setActiveStep: state.setActiveStep,
      setSetupPhase: state.setSetupPhase,
      launchInfo: state.launchInfo,
      resetDialogState: state.resetDialogState,
      setIsValidate: state.setIsValidate,
      campaignId: state.campaignId,
      setReloadTable: state.setReloadTable,
    })),
  );

  const [isLoading, setIsLoading] = useState(false);

  const onCampaignLaunchNext = async () => {
    if (isLoading) {
      return;
    }

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
          new Date(launchInfo.scheduleTime),
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
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onCampaignLaunchNext,
  };
};
