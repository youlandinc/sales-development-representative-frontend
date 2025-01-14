'use client';
import { useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { useSwitch } from '@/hooks';
import { APP_KEY } from '@/constant';
import { UEncode } from '@/utils';

import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledOTP,
  StyledOTPGroup,
  StyledOTPSlot,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

import { BizTypeEnum, HttpError } from '@/types';
import {
  _userRestPassword,
  _userSendVerifyCode,
  _userVerifyCode,
} from '@/request';

interface ForgetPassword {
  uppercaseError: boolean;
  lowercaseError: boolean;
  specialError: boolean;
  numberError: boolean;
  lengthError: boolean;
}

const ERROR_MESSAGE: { label: string; key: keyof ForgetPassword }[] = [
  { label: 'One uppercase character', key: 'uppercaseError' },
  { label: 'One lowercase character', key: 'lowercaseError' },
  { label: 'One special character', key: 'specialError' },
  { label: 'One number', key: 'numberError' },
  { label: '8 characters minimum', key: 'lengthError' },
];

export const ForgetPassword = () => {
  const router = useRouter();
  const { open, visible, close } = useSwitch(false);

  const [sending, setSending] = useState(false);
  const [changing, setChanging] = useState(false);
  const [isResend, setIsResend] = useState(false);

  const [formState, setFormState] = useState<'get' | 'set'>('get');

  const timer = useRef<NodeJS.Timeout>(null);
  const [tick, setTick] = useState(60);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<ForgetPassword>({
    uppercaseError: false,
    lowercaseError: false,
    specialError: false,
    numberError: false,
    lengthError: false,
  });

  const onPasswordChange = (e: any) => {
    setNewPassword(e.target.value);
    const uppercaseError = !!e.target.value.match(/[A-Z]/g);
    const lowercaseError = !!e.target.value.match(/[a-z]/g);
    const specialError = !!e.target.value.match(
      /[*?!&￥$%^#,./@";:><\\[\]}{\-=+_\\|》《。，、？’‘“”~]/g,
    );
    const numberError = !!e.target.value.match(/\d/g);
    const lengthError = e.target.value?.length >= 8;

    setPasswordError({
      uppercaseError,
      lowercaseError,
      specialError,
      numberError,
      lengthError,
    });
  };

  const sendOtp = async () => {
    const postData = {
      email,
      appkey: APP_KEY,
      bizType: BizTypeEnum.reset_pass,
    };

    setSending(true);
    try {
      await _userSendVerifyCode(postData);
      !visible && open();
      return true;
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
      return false;
    } finally {
      setSending(false);
    }
  };

  const onClickToOpenDialog = async () => {
    if (!email) {
      return;
    }
    await sendOtp();
  };

  const onClickToCloseDialog = () => {
    close();
    if (timer.current) {
      clearInterval(timer.current!);
    }
    setTick(60);
    setIsResend(false);
    setFormState('get');
    setOtp('');
  };

  const onClickBackToLogin = () => {
    router.push('/auth/sign-in');
  };

  const onOTPComplete = async () => {
    const postData = {
      email,
      appkey: APP_KEY,
      code: otp,
      bizType: BizTypeEnum.reset_pass,
    };

    try {
      await _userVerifyCode(postData);
      setFormState('set');
      close();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  };

  const onClickToResendOTP = async () => {
    const condition = await sendOtp();

    if (!condition || timer.current) {
      return;
    }

    setIsResend(true);
    let tick = 60;
    timer.current = setInterval(() => {
      tick--;
      setTick(tick);
      if (tick === 0) {
        setIsResend(false);
        clearInterval(timer.current!);
      }
    }, 1000);
  };

  const onClickToSetPassword = async () => {
    const postData = {
      newPass: UEncode(newPassword),
      appkey: APP_KEY,
      verifyCode: otp,
      email,
    };

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Password not the same.');
      return;
    }

    setChanging(true);
    try {
      await _userRestPassword(postData);
      router.push('/auth/sign-in');
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setChanging(false);
    }
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
        component={'form'}
        gap={6}
        maxWidth={600}
        onSubmit={async (e) => {
          e.preventDefault();
          formState === 'get'
            ? await onClickToOpenDialog()
            : await onClickToSetPassword();
        }}
        px={5}
        py={7.5}
        width={'100%'}
      >
        {formState === 'get' ? (
          <>
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
                disabled={sending}
                label={'Email'}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={'Email'}
                required
                value={email}
              />

              <StyledButton
                disabled={sending}
                loading={sending}
                type={'submit'}
              >
                Next
              </StyledButton>
              <StyledButton
                color={'info'}
                disabled={sending}
                onClick={onClickBackToLogin}
                variant={'outlined'}
              >
                Back
              </StyledButton>
            </Stack>
          </>
        ) : (
          <>
            <Typography textAlign={'center'} variant={'h5'}>
              Set password
            </Typography>
            <Stack gap={3}>
              <StyledTextFieldPassword
                disabled={changing}
                label={'New password'}
                onChange={(e) => onPasswordChange(e)}
                required
                value={newPassword}
              />

              <StyledTextFieldPassword
                disabled={changing}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                label={'Confirm password'}
                onChange={(e) => {
                  confirmPasswordError && setConfirmPasswordError('');
                  setConfirmPassword(e.target.value);
                }}
                required
                value={confirmPassword}
              />

              <Box component={'ul'} p={0}>
                <Typography color={'info.main'} variant={'body2'}>
                  Password requirements:
                </Typography>
                {ERROR_MESSAGE.map((item, index) => (
                  <Box
                    component={'li'}
                    key={`${item.label}-${item.key}-${index}`}
                    sx={{
                      ml: 1,
                      fontSize: 12,
                      fontWeight: 600,
                      listStyleType: 'disc',
                      listStylePosition: 'inside',
                      color: !passwordError[item.key]
                        ? 'error.main'
                        : 'success.main',
                      transition: 'color .3s',
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </Box>

              <StyledButton
                disabled={
                  changing ||
                  Object.values(passwordError).some((v) => !v) ||
                  !newPassword ||
                  !confirmPassword
                }
                loading={changing}
                type={'submit'}
              >
                Set password
              </StyledButton>
            </Stack>
          </>
        )}
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

            {isResend ? (
              <Typography color={'text.secondary'} variant={'body2'}>
                You can resend in <b>{tick}</b> seconds
              </Typography>
            ) : (
              <Typography color={'text.secondary'} variant={'body2'}>
                Didn&apos;t get a code?{' '}
                <b
                  onClick={onClickToResendOTP}
                  style={{ color: '#6E4EFB', cursor: 'pointer' }}
                >
                  Click to resend
                </b>
              </Typography>
            )}
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
