import { useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import { getParamsFromUrl, UEncode } from '@/utils';
import { APP_KEY, DEFAULT_LOGGED_IN_PATH } from '@/constants';
import { useUserStore } from '@/providers';

import { SDRToast } from '@/components/atoms';

import { LoginTypeEnum } from '@/types';
import { _userLogin, _userSetPassword } from '@/request';

import { useCheckPassword } from './useCheckPassword';

export const useSetPassword = () => {
  const router = useRouter();
  const { setAccessToken, setUserProfile } = useUserStore((state) => state);

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { passwordError } = useCheckPassword({ password });

  const isDisabled = useMemo(() => {
    return !password || !Object.values(passwordError).every(Boolean);
  }, [password, passwordError]);

  const onClickSetPassword = async () => {
    if (isDisabled) {
      return;
    }

    const { email, signature } = getParamsFromUrl(location.href);
    const postData = {
      email,
      signature,
      newPassword: UEncode(password),
    };

    localStorage.setItem(UEncode('email'), UEncode(email));
    localStorage.setItem(UEncode('password'), UEncode(password));

    setLoading(true);
    try {
      const { data } = await _userSetPassword(postData);
      if (data) {
        const loginData = {
          appkey: APP_KEY,
          loginType: LoginTypeEnum.ylaccount_login,
          emailParam: {
            account: email,
            password: UEncode(password),
          },
        };

        const {
          data: { accessToken, userProfile },
        } = await _userLogin(loginData);
        setAccessToken(accessToken);
        setUserProfile(userProfile);
        router.push(DEFAULT_LOGGED_IN_PATH);
      }
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    passwordError,
    onClickSetPassword,
    loading,
    isDisabled,
  };
};
