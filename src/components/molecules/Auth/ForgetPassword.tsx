'use client';
import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { useSwitch } from '@/hooks';

import {
  StyledButton,
  StyledDialog,
  StyledOTP,
  StyledOTPGroup,
  StyledOTPSlot,
  StyledTextField,
} from '@/components/atoms';

export const ForgetPassword = () => {
  const router = useRouter();
  const { open, visible, close } = useSwitch(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const onClickToOpenDialog = () => {
    open();
  };

  const onClickToCloseDialog = () => {
    close();
    setOtp('');
  };

  const onClickBackToLogin = () => {
    router.push('/auth/sign-in');
  };

  const onOTPComplete = () => {
    console.log('complete');
  };

  const onClickToResendOTP = () => {
    console.log('resend');
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

          <StyledButton onClick={onClickToOpenDialog}>Next</StyledButton>
          <StyledButton
            color={'info'}
            onClick={onClickBackToLogin}
            variant={'outlined'}
          >
            Back
          </StyledButton>
        </Stack>
      </Stack>

      <StyledDialog
        content={
          <Stack alignItems={'center'} gap={3} my={3}>
            <StyledOTP
              autoFocus
              maxLength={4}
              onChange={(v) => setOtp(v)}
              onComplete={onOTPComplete}
              value={otp}
            >
              <StyledOTPGroup>
                <StyledOTPSlot index={0} />
                <StyledOTPSlot index={1} />
                <StyledOTPSlot index={2} />
                <StyledOTPSlot index={3} />
              </StyledOTPGroup>
            </StyledOTP>

            <Typography>
              Didn&apos;t get a code?{' '}
              <b
                onClick={onClickToResendOTP}
                style={{ color: '#6E4EFB', cursor: 'pointer' }}
              >
                Click to resend
              </b>
            </Typography>
          </Stack>
        }
        footer={
          <Stack>
            <StyledButton
              color={'info'}
              onClick={onClickToCloseDialog}
              size={'medium'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
          </Stack>
        }
        header={
          <Stack>
            <Typography variant={'h7'}>Enter verification code</Typography>
            <Typography color={'text.secondary'} variant={'body2'}>
              We&apos;ve sent a code to <b>{email || 'example@site.com'}</b>
            </Typography>
          </Stack>
        }
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown') {
            onClickToCloseDialog();
          }
        }}
        open={visible}
      />
    </Stack>
  );
};
