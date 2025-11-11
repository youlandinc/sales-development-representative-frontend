import { Dispatch, SetStateAction, useState } from 'react';

import { SDRToast } from '@/components/atoms';
import { _userLogin, _userSignUp, _userVerifyCode } from '@/request';
import { APP_KEY } from '@/constant';
import { UEncode } from '@/utils';
import { LoginTypeEnum } from '@/types';
import { useUserStore } from '@/providers';

import { useLogged } from './useLogged';

interface UseSignUpDialogProps {
  userInfo: string;
  setUserInfo: Dispatch<SetStateAction<string>>;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const useSignUpDialog = ({
  userInfo,
  setUserInfo,
  firstName,
  lastName,
  email,
  password,
}: UseSignUpDialogProps) => {
  const { setAccessToken, setUserProfile } = useUserStore((state) => state);

  const [dialogLoading, setDialogLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(60);

  const { setShowToast } = useLogged();

  const onClickResendOtp = async () => {
    const postData = {
      appKey: APP_KEY,
      firstName,
      lastName,
      email,
      password: UEncode(password),
    };

    let num = 59;
    setSeconds(59);
    const timer = setInterval(() => {
      num--;
      setSeconds(num);
      if (num < 1) {
        setSeconds(60);
        clearInterval(timer);
      }
    }, 1000);

    try {
      const { data: userInfo } = await _userSignUp(postData);
      setUserInfo(userInfo);
    } catch (err) {
      setSeconds(60);
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  };

  const onClickToCloseDialog = () => {
    setOtp('');
    setDialogLoading(false);
    close();
  };

  const handledVerifyOtp = async (verifyCode: string) => {
    const postData = {
      userInfo,
      verifyCode,
    };

    setDialogLoading(true);
    try {
      const { data: verifyCode } = await _userVerifyCode(postData);
      if (verifyCode) {
        onClickToCloseDialog();
        const postData = {
          appkey: APP_KEY,
          loginType: LoginTypeEnum.ylaccount_login,
          emailParam: {
            account: email,
            password: UEncode(password),
          },
        };
        const {
          data: { accessToken, userProfile },
        } = await _userLogin(postData);
        setShowToast(false);
        setAccessToken(accessToken);
        setUserProfile(userProfile);
      }
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setDialogLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    dialogLoading,
    handledVerifyOtp,
    onClickResendOtp,
    seconds,
  };
};
