import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { StyledButton, StyledTextField } from '@/components/atoms';
import { SettingsCard } from '@/components/molecules';

export const PersonalInfo = () => {
  return (
    <SettingsCard title={'Personal Information'}>
      <Stack gap={1.5}>
        <Typography>Profile details</Typography>
        <Stack
          flexDirection={'row'}
          flexWrap={'wrap'}
          gap={3}
          maxWidth={900}
          sx={{
            '& .MuiTextField-root': {
              width: 'calc(50% - 12px)',
            },
          }}
        >
          <StyledTextField label={'First name'} />
          <StyledTextField label={'Last name'} />
          <StyledTextField label={'Phone'} />
          <StyledTextField label={'Company'} />
        </Stack>
      </Stack>
      <Box bgcolor={'#DFDEE6'} height={'1px'}></Box>
      <Stack gap={1.5} maxWidth={900}>
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Typography>Password</Typography>
          <StyledButton
            color={'info'}
            size={'small'}
            sx={{ py: '6px !important' }}
            variant={'outlined'}
          >
            Change
          </StyledButton>
        </Stack>
        <Stack
          flexDirection={'row'}
          flexWrap={'wrap'}
          gap={3}
          maxWidth={900}
          sx={{
            '& .MuiTextField-root': {
              width: 'calc(50% - 12px)',
            },
          }}
        >
          <StyledTextField label={'Old password'} type={'password'} />
          <StyledTextField label={'Password'} type={'password'} />
        </Stack>
      </Stack>
    </SettingsCard>
  );
};
