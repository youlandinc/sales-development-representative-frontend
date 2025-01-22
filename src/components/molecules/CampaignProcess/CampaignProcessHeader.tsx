import { ChangeEvent, FC, useMemo, useState } from 'react';
import { debounce, Icon, Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { StyledButton } from '@/components/atoms';
import {
  CampaignsStatusBadge,
  CommonRenameTextField,
} from '@/components/molecules';

import { SetupPhaseEnum } from '@/types';

import ICON_CLOSE from './assets/icon_close.svg';
import ICON_BACK from './assets/icon_back.svg';

export const CampaignProcessHeader: FC = () => {
  const { activeStep } = useDialogStore();

  return activeStep === 1 ? (
    <CampaignProcessHeaderStepFirst />
  ) : (
    <CampaignProcessHeaderStepSecondary />
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
  } = useDialogStore();

  return (
    <Stack gap={1.5}>
      <Stack alignItems={'center'} flexDirection={'row'}>
        <Typography variant={'h6'}>Start new campaign</Typography>
        <Icon
          component={ICON_CLOSE}
          onClick={() => {
            closeProcess();
            resetDialogState();
          }}
          sx={{ ml: 'auto', cursor: 'pointer' }}
        />
      </Stack>

      <Stack flexDirection={'row'}>
        <CampaignProcessHeaderButtonGroup />
        {leadsVisible && !campaignId && (
          <StyledButton
            disabled={creating}
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
  const { campaignName, campaignStatus, closeProcess, renameCampaign } =
    useDialogStore();

  console.log(campaignName);

  const [value, setValue] = useState(campaignName);

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

  return (
    <Stack flexDirection={'row'} justifyContent={'space-between'} px={3}>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Icon
          component={ICON_BACK}
          onClick={() => {
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

      <StyledButton>Launch campaign</StyledButton>
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
  const { activeStep, setActiveStep, campaignId, setSetupPhase } =
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
            if (!campaignId) {
              return;
            }
            const setupPhase =
              BUTTON_GROUP.find((pre) => pre.id === item.id + 1)?.setupPhase ||
              BUTTON_GROUP[2].setupPhase;

            setActiveStep(item.id);
            await setSetupPhase(setupPhase);
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
              color: disabled()
                ? '#D0CEDA'
                : activeStep === item.id
                  ? 'primary.main'
                  : '#D0CEDA',
              bgcolor: activeStep === item.id ? '#D5CBFB' : 'transparent',
              border: disabled()
                ? '1px solid #D0CEDA'
                : activeStep === item.id
                  ? '1px solid transparent'
                  : '1px solid #D0CEDA',
            },
            '&:hover': {
              border: !campaignId ? '' : '2px solid #6E4EFB',
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
                : !campaignId
                  ? '#D0CEDA'
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
