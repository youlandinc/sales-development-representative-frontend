import { Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { useDialogStore } from '@/stores/useDialogStore';
import { CampaignStepEnum } from '@/types';

import { StyledButton } from '@/components/atoms';

export const ContentPrepare = () => {
  const router = useRouter();

  const { setActiveStep, closeProcess } = useDialogStore();

  const onClickToChoose = () => {
    setActiveStep(CampaignStepEnum.choose);
  };
  const onClickToSetDomain = () => {
    closeProcess();
    router.push('/settings');
  };

  return (
    <Stack gap={3} mb={3} width={'100%'}>
      <Stack>
        <Typography fontSize={14}>
          To start working with Companies, you need to set up your email domain.
        </Typography>
        <Typography fontSize={14}>
          This ensures your emails can be sent and verified correctly.
        </Typography>
      </Stack>

      <Stack flexDirection={'row'} gap={3} ml={'auto'}>
        <StyledButton
          color={'info'}
          onClick={() => onClickToChoose()}
          size={'medium'}
          sx={{ width: 108 }}
          variant={'outlined'}
        >
          Skip for now
        </StyledButton>
        <StyledButton
          onClick={() => onClickToSetDomain()}
          size={'medium'}
          sx={{ width: 154 }}
        >
          Go to domain setup
        </StyledButton>
      </Stack>
    </Stack>
  );
};
