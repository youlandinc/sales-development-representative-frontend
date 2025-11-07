import { useEffect, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import { UDecode, UEncode } from '@/utils';
import { SDRToast } from '@/components/atoms';
import { _userResetPassword } from '@/request';
import { HttpVariantEnum } from '@/types';

export const useForgetPassword = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail(UDecode(localStorage.getItem(UEncode('email')) || ''));
  }, []);

  const onClickNext = async () => {
    if (!email) {
      return;
    }
    const postData = {
      email,
    };

    setLoading(true);
    try {
      const { data } = await _userResetPassword(postData);
      if (data) {
        SDRToast({
          message:
            "We've sent you password reset instructions to your email. If you don't receive the email, please try again.",
          header: '',
          variant: HttpVariantEnum.success,
        });
      }
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLoading(false);
    }
  };

  const onClickBack = () => {
    router.back();
  };

  return { loading, email, setEmail, onClickNext, onClickBack };
};
