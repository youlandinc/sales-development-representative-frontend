import { Dispatch, SetStateAction, useEffect } from 'react';

import { useAsyncFn } from '@/hooks';
import { getParamsFromUrl } from '@/utils';
import { useUserStore } from '@/providers';

import { SDRToast } from '@/components/atoms';

import { _fetchUserInfoWithToken } from '@/request';

interface UseLoginWithTokenProps {
  setShowToast: Dispatch<SetStateAction<boolean>>;
}

export const useLoginWithToken = ({ setShowToast }: UseLoginWithTokenProps) => {
  const { setAccessToken, setUserProfile } = useUserStore((state) => state);

  const [, loginWithToken] = useAsyncFn(async () => {
    const { token } = getParamsFromUrl(location.href);
    return await _fetchUserInfoWithToken(token ?? '')
      .then(({ data }) => {
        const { accessToken, userProfile } = data;
        setShowToast(false);
        setAccessToken(accessToken);
        setUserProfile(userProfile);
      })
      .catch((err) => {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      });
  }, []);

  useEffect(() => {
    const { token } = getParamsFromUrl(location.href);
    if (token) {
      loginWithToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
