import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { StyledButton } from '@/components/atoms';
import { CampaignsStatusBadge } from '@/components/molecules';

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
  const { close, resetDialogState, leadsVisible, createCampaign, creating } =
    useDialogStore();

  return (
    <Stack gap={1.5}>
      <Stack alignItems={'center'} flexDirection={'row'}>
        <Typography variant={'h6'}>Start new campaign</Typography>
        <Icon
          component={ICON_CLOSE}
          onClick={() => {
            close();
            resetDialogState();
          }}
          sx={{ ml: 'auto', cursor: 'pointer' }}
        />
      </Stack>

      <Stack flexDirection={'row'}>
        <CampaignProcessHeaderButtonGroup />
        {leadsVisible && (
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
  const { campaignName, campaignStatus, close } = useDialogStore();

  return (
    <Stack flexDirection={'row'} justifyContent={'space-between'} px={3}>
      <Stack alignItems={'center'} flexDirection={'row'}>
        <Icon
          component={ICON_BACK}
          onClick={() => {
            close();
          }}
          sx={{
            cursor: 'pointer',
            width: 20,
            height: 20,
          }}
        />
        <Typography ml={3} mr={1.5} variant={'h6'}>
          {campaignName || 'Untitled campaign'}
        </Typography>
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
    url: '',
  },
  {
    id: 2,
    label: 'Messaging',
    url: '',
  },
  {
    id: 3,
    label: 'Launch',
    url: '',
  },
];

const CampaignProcessHeaderButtonGroup: FC = () => {
  const { activeStep, setActiveStep, campaignId } = useDialogStore();

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
          onClick={() => {
            if (!campaignId) {
              return;
            }
            setActiveStep(item.id);
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
