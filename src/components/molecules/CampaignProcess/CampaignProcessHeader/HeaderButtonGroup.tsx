import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { BUTTON_GROUP } from './constants';

export const HeaderButtonGroup: FC = () => {
  const { activeStep, setActiveStep, campaignId, setSetupPhase, returning } =
    useDialogStore();

  const disabled = () => {
    if (activeStep === BUTTON_GROUP[0].id) {
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
            {item.order}
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
