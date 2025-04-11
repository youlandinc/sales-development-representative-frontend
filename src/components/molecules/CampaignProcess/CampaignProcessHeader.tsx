import { ChangeEvent, FC, useMemo, useState } from 'react';
import { debounce, Icon, Stack, Typography } from '@mui/material';
import { addDays, differenceInCalendarDays } from 'date-fns';

import { useDialogStore } from '@/stores/useDialogStore';

import { SDRToast, StyledButton } from '@/components/atoms';
import {
  CampaignsStatusBadge,
  CommonRenameTextField,
} from '@/components/molecules';

import {
  HttpError,
  HttpVariantEnum,
  ProcessCreateTypeEnum,
  SetupPhaseEnum,
} from '@/types';
import { _saveAndLunchCampaign } from '@/request';

import ICON_CLOSE from './assets/icon_close.svg';
import ICON_BACK from './assets/icon_back.svg';

const titleTail = (
  campaignType: ProcessCreateTypeEnum | undefined | null | string,
) => {
  switch (campaignType) {
    case ProcessCreateTypeEnum.filter:
      return 'Filter and select audience';
    case ProcessCreateTypeEnum.csv:
      return 'Upload CSV';
    case ProcessCreateTypeEnum.crm:
      return 'Use CRM list';
    case ProcessCreateTypeEnum.agent:
      return 'Agent';
    case ProcessCreateTypeEnum.saved_list:
      return 'Use saved list';
    default:
      return '';
  }
};

export const CampaignProcessHeader: FC = () => {
  const { activeStep } = useDialogStore();

  return useMemo(() => {
    switch (activeStep) {
      case 1:
        return <CampaignProcessHeaderStepFirst />;
      case 2:
      case 3:
        return <CampaignProcessHeaderStepSecondary />;
      default:
        return <CampaignProcessHeaderStepChoose />;
    }
  }, [activeStep]);
};

export const CampaignProcessHeaderStepChoose: FC = () => {
  const { closeProcess, resetDialogState } = useDialogStore();

  return (
    <Stack>
      <Stack alignItems={'center'} flexDirection={'row'} pt={3} px={3}>
        <Typography variant={'h5'}>Start new campaign</Typography>
        <Icon
          component={ICON_CLOSE}
          onClick={async () => {
            await resetDialogState();
            closeProcess();
          }}
          sx={{ ml: 'auto', cursor: 'pointer' }}
        />
      </Stack>
    </Stack>
  );
};

export const CampaignProcessHeaderStepFirst: FC = () => {
  const {
    closeProcess,
    resetDialogState,
    leadsVisible,
    createCampaign,
    creating,
    campaignId,
    leadsList,
    campaignType,
    leadsFetchLoading,
  } = useDialogStore();

  return (
    <Stack gap={1.5} pt={3} px={3}>
      <Stack alignItems={'center'} flexDirection={'row'}>
        <Typography variant={'h5'}>
          Start new campaign -{' '}
          <Typography color={'#6F6C7D'} component={'span'} variant={'h5'}>
            {titleTail(campaignType)}
          </Typography>
        </Typography>
        <Icon
          component={ICON_CLOSE}
          onClick={async () => {
            await resetDialogState();
            closeProcess();
          }}
          sx={{ ml: 'auto', cursor: 'pointer' }}
        />
      </Stack>

      <Stack flexDirection={'row'}>
        <CampaignProcessHeaderButtonGroup />
        {leadsVisible && !campaignId && (
          <StyledButton
            disabled={leadsFetchLoading || creating || leadsList.length === 0}
            loading={creating}
            onClick={async () => await createCampaign()}
            size={'medium'}
            sx={{ ml: 'auto', width: 180 }}
          >
            Continue to Messaging
          </StyledButton>
        )}
      </Stack>
    </Stack>
  );
};

export const CampaignProcessHeaderStepSecondary: FC = () => {
  const {
    campaignName,
    campaignStatus,
    closeProcess,
    renameCampaign,
    activeStep,
    setActiveStep,
    setSetupPhase,
    lunchInfo,
    resetDialogState,
    setIsValidate,
    campaignId,
    setReloadTable,
  } = useDialogStore();

  const [value, setValue] = useState(campaignName);
  const [loading, setLoading] = useState(false);

  const debounceSearchWord = useMemo(
    () =>
      debounce(async (value) => {
        await renameCampaign(value);
      }, 500),
    [renameCampaign],
  );

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    await debounceSearchWord(e.target.value);
  };

  const onClickToNext = async () => {
    if (activeStep === 2) {
      setActiveStep(3);
      await setSetupPhase(SetupPhaseEnum.launch);
      return;
    }

    if (!campaignId) {
      return;
    }

    if (!lunchInfo.sendNow) {
      if (
        !lunchInfo.scheduleTime ||
        differenceInCalendarDays(
          lunchInfo.scheduleTime,
          addDays(new Date(), 1),
        ) < 0
      ) {
        setIsValidate(false);
        return;
      }
    }

    const postData = {
      campaignId: campaignId!,
      dailyLimit: lunchInfo.dailyLimit,
      autopilot: lunchInfo.autopilot,
      sendNow: lunchInfo.sendNow,
      scheduleTime: lunchInfo.scheduleTime || null,
      sender: lunchInfo.sender!,
      replyTo: lunchInfo.replyTo!,
      senderName: lunchInfo.senderName!,
    };
    setLoading(true);
    try {
      await _saveAndLunchCampaign(postData);
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

  return (
    <Stack
      borderBottom={'1px solid #DFDEE6'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      p={3}
    >
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Icon
          component={ICON_BACK}
          onClick={async () => {
            await resetDialogState();
            closeProcess();
          }}
          sx={{
            cursor: 'pointer',
            width: 20,
            height: 20,
          }}
        />
        <Stack height={36}>
          <CommonRenameTextField
            onChange={onChange}
            slotProps={{
              input: {
                onBlur: (e) => {
                  if (e.target.value === '') {
                    setValue('Untitled campaign');
                  }
                },
              },
            }}
            value={value}
          />
        </Stack>

        <CampaignsStatusBadge status={campaignStatus} />
      </Stack>
      <CampaignProcessHeaderButtonGroup />

      <StyledButton
        disabled={loading}
        loading={loading}
        onClick={() => onClickToNext()}
        size={'medium'}
        sx={{ width: 180, alignSelf: 'flex-end' }}
      >
        {activeStep === 2 ? 'Next' : 'Launch campaign'}
      </StyledButton>
    </Stack>
  );
};

const BUTTON_GROUP = [
  {
    id: 1,
    label: 'Audience',
    setupPhase: SetupPhaseEnum.audience,
  },
  {
    id: 2,
    label: 'Messaging',
    setupPhase: SetupPhaseEnum.messaging,
  },
  {
    id: 3,
    label: 'Launch',
    setupPhase: SetupPhaseEnum.launch,
  },
];

const CampaignProcessHeaderButtonGroup: FC = () => {
  const { activeStep, setActiveStep, campaignId, setSetupPhase, returning } =
    useDialogStore();

  const disabled = () => {
    if (activeStep === 1) {
      return false;
    }
    return !campaignId;
  };

  return (
    <Stack flexDirection={'row'} gap={4}>
      {BUTTON_GROUP.map((item, index) => (
        <Stack
          alignItems={'center'}
          border={
            activeStep === item.id
              ? '2px solid #6E4EFB'
              : '2px solid transparent'
          }
          borderRadius={2}
          flexDirection={'row'}
          gap={1.5}
          key={`${item.id}-${index}`}
          onClick={async () => {
            if (!campaignId || returning) {
              return;
            }

            setActiveStep(item.id);
            await setSetupPhase(item.setupPhase);
          }}
          px={1.5}
          py={1}
          sx={{
            cursor: 'default',
            transition: 'all .3s',
            '& .step_item': {
              height: 28,
              width: 28,
              borderRadius: 2,
              transition: 'all .2s',
              color:
                activeStep === item.id || disabled()
                  ? 'primary.main'
                  : 'text.disabled',
              bgcolor:
                activeStep === item.id ? 'primary.lighter' : 'transparent',
              border:
                activeStep === item.id || disabled()
                  ? '1px solid transparent'
                  : '1px solid #D5CBFB',
            },
            '&:hover': {
              border: !campaignId || returning ? '' : '2px solid #6E4EFB',
            },
          }}
        >
          <Stack
            alignItems={'center'}
            className={'step_item'}
            justifyContent={'center'}
          >
            {item.id}
          </Stack>
          <Typography
            color={
              activeStep === item.id
                ? 'text.primary'
                : returning || !campaignId
                  ? 'text.disabled'
                  : 'text.primary'
            }
          >
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
