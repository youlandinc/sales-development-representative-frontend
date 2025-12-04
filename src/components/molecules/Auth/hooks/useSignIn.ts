import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import { UDecode, UEncode } from '@/utils';
import { APP_KEY } from '@/constants';
import { useUserStore } from '@/providers';

import { SDRToast } from '@/components/atoms';

import { _userGoogleLogin, _userLogin } from '@/request';
import { HttpError, LoginTypeEnum } from '@/types';

import { useLogged } from './useLogged';
import { useLoginWithToken } from './useLoginWithToken';

export const useSignIn = () => {
  const router = useRouter();
  const { setAccessToken, setUserProfile } = useUserStore((state) => state);
  const { setShowToast } = useLogged();
  useLoginWithToken({ setShowToast });

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setEmail(UDecode(localStorage.getItem(UEncode('email')) || ''));
    setPassword(UDecode(localStorage.getItem(UEncode('password')) || ''));
  }, []);

  const onClickGoogleLogin = async () => {
    try {
      const { data: url } = await _userGoogleLogin();
      router.push(url);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  };

  const isDisabled = useMemo(() => {
    return !email || !password;
  }, [email, password]);

  const onClickToLogin = async () => {
    if (isDisabled) {
      return;
    }
    const postData = {
      appkey: APP_KEY,
      loginType: LoginTypeEnum.ylaccount_login,
      emailParam: {
        account: email,
        password: UEncode(password),
      },
    };

    setLoading(true);
    try {
      const {
        data: { accessToken, userProfile },
      } = await _userLogin(postData);

      localStorage.setItem(UEncode('email'), UEncode(email));
      localStorage.setItem(UEncode('password'), UEncode(password));

      setShowToast(false);
      setAccessToken(accessToken);
      setUserProfile(userProfile);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLoading(false);
    }
  };

  const onClickToSignUp = () => {
    router.push('/auth/sign-up');
  };

  const onClickToForgetPassword = () => {
    router.push('/auth/forget-password');
  };

  return {
    loading,
    email,
    password,
    isDisabled,
    setEmail,
    setPassword,
    onClickToSignUp,
    onClickToLogin,
    onClickGoogleLogin,
    onClickToForgetPassword,
  };
};
