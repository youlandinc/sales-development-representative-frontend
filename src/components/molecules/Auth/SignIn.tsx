'use client';
import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { UDecode, UEncode } from '@/utils';
import { APP_KEY } from '@/constant';
import { useUserStore } from '@/provides';

import {
  SDRToast,
  StyledButton,
  StyledCheckbox,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

import { _userLogin } from '@/request';
import { HttpError, LoginTypeEnum } from '@/types';

export const SignIn = () => {
  const router = useRouter();
  const { setAccessToken, setAccountId } = useUserStore((state) => state);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const onClickToForgetPassword = () => {
    router.push('/auth/forget-password');
  };

  const onClickToLogin = async () => {
    const postData = {
      appkey: APP_KEY,
      loginType: LoginTypeEnum.ylaccount_login,
      emailParam: {
        account: email,
        password: UEncode(password),
      },
    };

    if (rememberMe) {
      localStorage.setItem(UEncode('email'), UEncode(email));
      localStorage.setItem(UEncode('password'), UEncode(password));
    }

    setLoading(true);
    try {
      const {
        data: {
          accessToken,
          userProfile: { accountId },
        },
      } = await _userLogin(postData);
      setAccessToken(accessToken);
      setAccountId(accountId);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEmail(UDecode(localStorage.getItem(UEncode('email')) || ''));
    setPassword(UDecode(localStorage.getItem(UEncode('password')) || ''));
    setRememberMe(!!localStorage.getItem(UEncode('email')));
  }, []);

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
          await onClickToLogin();
        }}
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
            disabled={loading}
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
            required
            value={email}
          />
          <StyledTextFieldPassword
            disabled={loading}
            label={'Password'}
            onChange={(e) => setPassword(e.target.value)}
            required
            value={password}
          />

          <Stack flexDirection={'row'}>
            <StyledCheckbox
              checked={rememberMe}
              label={
                <Typography color={'text.secondary'} ml={1} variant={'body2'}>
                  Remember me
                </Typography>
              }
              onChange={(e, checked) => setRememberMe(checked)}
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

          <StyledButton disabled={loading} loading={loading} type={'submit'}>
            Log in
          </StyledButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
