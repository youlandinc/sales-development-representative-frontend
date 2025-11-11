import { useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import { UEncode } from '@/utils';
import { APP_KEY } from '@/constant';

import { SDRToast } from '@/components/atoms';

import { _userGoogleLogin, _userSignUp } from '@/request';
import { HttpError } from '@/types';

import { useCheckPassword } from './useCheckPassword';
import { useSwitch } from '@/hooks';

export const useSignUp = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const { open, close, visible } = useSwitch(false);

  const { passwordError } = useCheckPassword({ password });

  const isDisabled = useMemo(() => {
    const allPasswordValid = Object.values(passwordError).every(Boolean);
    return !firstName || !lastName || !email || !password || !allPasswordValid;
  }, [firstName, lastName, email, password, passwordError]);

  const onClickGoogleLogin = async () => {
    try {
      const { data: url } = await _userGoogleLogin();
      router.push(url);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  };

  const onClickSignUp = async () => {
    if (isDisabled) {
      return;
    }
    const postData = {
      appKey: APP_KEY,
      firstName,
      lastName,
      email,
      password: UEncode(password),
    };

    localStorage.setItem(UEncode('email'), UEncode(email));
    localStorage.setItem(UEncode('password'), UEncode(password));

    setLoading(true);
    try {
      const { data: userInfo } = await _userSignUp(postData);
      setUserInfo(userInfo);
      open();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLoading(false);
    }
  };

  const onClickToSignIn = () => {
    router.push('/auth/sign-in');
  };

  return {
    loading,
    isDisabled,
    passwordError,
    firstName,
    lastName,
    email,
    password,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    onClickSignUp,
    onClickToSignIn,
    userInfo,
    setUserInfo,
    visible,
    close,
    open,
    onClickGoogleLogin,
  };
};
