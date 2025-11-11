'use client';
import { useLayoutEffect, useState } from 'react';
import { Box, Divider, Icon, Stack, Typography } from '@mui/material';

import {
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';
import { getParamsFromUrl } from '@/utils';

import GOOGLE_ICON from './assets/google-icon.svg';
import { LOGO_HEIGHT, SignLogo } from './SignLogo';
import { useSignIn } from './hooks';

export const SignIn = () => {
  const [showEmpty, setShowEmpty] = useState(true);
  const {
    loading,
    isDisabled,
    email,
    password,
    setEmail,
    setPassword,
    onClickToSignUp,
    onClickGoogleLogin,
    onClickToForgetPassword,
    onClickToLogin,
  } = useSignIn();

  useLayoutEffect(() => {
    const { token } = getParamsFromUrl(window.location.href);
    if (!token) {
      setShowEmpty(false);
    }
  }, []);

  if (showEmpty) {
    return null;
  }

  return (
    <Box bgcolor={'#FBFCFD'}>
      <SignLogo />
      <Stack
        alignItems={'center'}
        height={`calc(100vh - ${LOGO_HEIGHT}px)`}
        justifyContent={'center'}
        width={'100%'}
      >
        <Stack
          bgcolor={'#ffffff'}
          border={'1px solid #E5E5E5'}
          borderRadius={4}
          component={'form'}
          gap={6}
          maxWidth={600}
          onSubmit={async (e) => {
            e.preventDefault();
            await onClickToLogin();
          }}
          px={5}
          py={7.5}
          width={'100%'}
        >
          <Stack>
            <Typography
              fontSize={'24px'}
              lineHeight={1.2}
              textAlign={'center'}
              variant={'h5'}
            >
              Welcome back to SalesOS
            </Typography>
            <Typography
              color={'#9095A3'}
              mt={1}
              textAlign={'center'}
              variant={'body2'}
            >
              Sign in to access your workspace and start scaling your outreach.
            </Typography>
          </Stack>
          <Stack gap={3}>
            <StyledButton
              onClick={onClickGoogleLogin}
              sx={{
                borderColor: '#D2D6E1 !important',
              }}
              variant="outlined"
            >
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                gap={'4px'}
                width={'100%'}
              >
                <Icon
                  component={GOOGLE_ICON}
                  sx={{
                    width: '24px',
                    height: '24px',
                  }}
                />
                <Typography
                  sx={{
                    flexGrow: 1,
                    color: '#202939',
                    fontSize: '16px',
                    lineHeight: 1.5,
                    fontWeight: 400,
                  }}
                  variant={'body2'}
                >
                  Sign in with Google
                </Typography>
              </Stack>
            </StyledButton>
            <Divider
              sx={{
                color: '#B0ADBD',
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              OR
            </Divider>
            <StyledTextField
              disabled={loading}
              label={'Email'}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              size={'large'}
              value={email}
            />
            <StyledTextFieldPassword
              disabled={loading}
              label={'Password'}
              onChange={(e) => setPassword(e.target.value.trim())}
              required
              size={'large'}
              value={password}
            />
            <StyledButton
              disabled={isDisabled}
              loading={loading}
              type={'submit'}
            >
              Sign in
            </StyledButton>
            <Stack flexDirection={'row'}>
              <Typography color={'#202939'} variant={'body2'}>
                Don&apos;t have an account?
              </Typography>
              <Typography
                color={'#6E4EFB'}
                display={'inline'}
                onClick={onClickToSignUp}
                sx={{ cursor: 'pointer', ml: '4px' }}
                variant={'body2'}
              >
                Sign up
              </Typography>
              <Typography
                color={'#9095A3'}
                ml={'auto'}
                onClick={onClickToForgetPassword}
                sx={{ cursor: 'pointer' }}
                variant={'body2'}
              >
                Forgot password?
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
