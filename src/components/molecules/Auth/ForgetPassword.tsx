'use client';
import { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { StyledButton, StyledTextField } from '@/components/atoms';

export const ForgetPassword = () => {
  const [email, setEmail] = useState('');

  return (
    <Stack
      alignItems={'center'}
      bgcolor={'#FBFCFD'}
      height={'100vh'}
      justifyContent={'center'}
      width={'100%'}
    >
      <Stack
        bgcolor={'#ffffff'}
        border={'1px solid #E5E5E5'}
        borderRadius={4}
        gap={6}
        maxWidth={600}
        px={5}
        py={7.5}
        width={'100%'}
      >
        <Stack>
          <Typography textAlign={'center'} variant={'h5'}>
            Forgot password
          </Typography>
          <Typography
            color={'text.secondary'}
            textAlign={'center'}
            variant={'body2'}
          >
            Please enter your email address and we will send you a code to
            verify your account.
          </Typography>
        </Stack>

        <Stack gap={3}>
          <StyledTextField
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={'Email'}
            value={email}
          />

          <StyledButton>Next</StyledButton>
          <StyledButton color={'info'} variant={'outlined'}>
            Back
          </StyledButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
