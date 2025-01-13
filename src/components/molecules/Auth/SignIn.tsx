'use client';
import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import {
  StyledButton,
  StyledCheckbox,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

export const SignIn = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onClickToForgetPassword = () => {
    router.push('/auth/forget-password');
  };

  const onClickToLogin = () => {
    console.log('login');
  };

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
            Welcome back
          </Typography>
          <Typography
            color={'text.secondary'}
            textAlign={'center'}
            variant={'body2'}
          >
            Log in by entering your email below
          </Typography>
        </Stack>

        <Stack gap={3}>
          <StyledTextField
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <StyledTextFieldPassword
            label={'Password'}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <Stack flexDirection={'row'}>
            <StyledCheckbox
              label={
                <Typography color={'text.secondary'} ml={1} variant={'body2'}>
                  Remember me
                </Typography>
              }
            />
            <Typography
              color={'text.secondary'}
              ml={'auto'}
              onClick={onClickToForgetPassword}
              sx={{ cursor: 'pointer' }}
              variant={'body2'}
            >
              Forgot password?
            </Typography>
          </Stack>

          <StyledButton onClick={onClickToLogin}>Log in</StyledButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
