'use client';
import { Box, Divider, Icon, Stack, Typography } from '@mui/material';

import {
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

import { useSignUp, useSignUpDialog } from './hooks';
import { SignUpDialog } from './SignUpDialog';
import { LOGO_HEIGHT, SignLogo } from './SignLogo';
import { SignPassWordCheck } from './SignPassWordCheck';
import GOOGLE_ICON from './assets/google-icon.svg';

export const SignUp = () => {
  const {
    loading,
    passwordError,
    isDisabled,
    firstName,
    lastName,
    email,
    password,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    onClickToSignIn,
    onClickSignUp,
    userInfo,
    setUserInfo,
    visible,
    close,
    onClickGoogleLogin,
  } = useSignUp();

  const {
    onClickResendOtp,
    seconds,
    otp,
    setOtp,
    handledVerifyOtp,
    dialogLoading,
  } = useSignUpDialog({
    userInfo,
    setUserInfo,
    firstName,
    lastName,
    email,
    password,
  });

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
            await onClickSignUp();
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
              Create your SalesOS account
            </Typography>
            <Typography
              color={'#9095A3'}
              mt={1}
              textAlign={'center'}
              variant={'body2'}
            >
              Enrich data, launch outreach, and close more deals — all in
              minutes
            </Typography>
          </Stack>
          <Stack gap={3}>
            <StyledButton
              sx={{
                borderColor: '#D2D6E1 !important',
              }}
              variant="outlined"
            >
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                gap={'4px'}
                onClick={onClickGoogleLogin}
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
                  Sign up with Google
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
            <Stack flexDirection={'row'} gap={3}>
              <StyledTextField
                disabled={loading}
                label={'First name'}
                onChange={(e) => setFirstName(e.target.value.trim())}
                required
                size={'large'}
                value={firstName}
              />
              <StyledTextField
                disabled={loading}
                label={'Last name'}
                onChange={(e) => setLastName(e.target.value.trim())}
                required
                size={'large'}
                value={lastName}
              />
            </Stack>
            <StyledTextField
              disabled={loading}
              label={'Email'}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              size={'large'}
              value={email}
            />
            <Stack gap={1}>
              <StyledTextFieldPassword
                disabled={loading}
                label={'Password'}
                onChange={(e) => setPassword(e.target.value.trim())}
                required
                size={'large'}
                value={password}
              />
              <SignPassWordCheck
                password={password}
                passwordError={passwordError}
              />
            </Stack>
            <StyledButton
              disabled={loading || isDisabled}
              loading={loading}
              sx={{
                '&.MuiButton-contained.Mui-disabled': {
                  color: '#FFFFFF !important',
                  backgroundColor: '#D0CEDA !important',
                },
              }}
              type={'submit'}
            >
              Sign up
            </StyledButton>
            <Stack flexDirection={'row'} justifyContent={'center'}>
              <Typography color={'#041256'} variant={'body2'}>
                Already have an account?
              </Typography>
              <Typography
                color={'#6E4EFB'}
                display={'inline'}
                onClick={onClickToSignIn}
                sx={{ cursor: 'pointer', ml: '4px' }}
                variant={'body2'}
              >
                Sign in
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <SignUpDialog
        close={close}
        email={email}
        handledVerifyOtp={handledVerifyOtp}
        loading={dialogLoading}
        onClickResendOtp={onClickResendOtp}
        otp={otp}
        seconds={seconds}
        setOtp={setOtp}
        visible={visible}
      />
    </Box>
  );
};
