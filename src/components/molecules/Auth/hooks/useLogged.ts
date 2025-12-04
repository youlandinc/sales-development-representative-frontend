import { useEffect, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import { useUserStore } from '@/providers';
import { DEFAULT_LOGGED_IN_PATH } from '@/constants';

import { SDRToast } from '@/components/atoms';

import { HttpVariantEnum } from '@/types';

export const useLogged = () => {
  const router = useRouter();
  const { isHydration, accessToken } = useUserStore((state) => state);
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    if (!isHydration) {
      return;
    }
    if (accessToken) {
      showToast &&
        SDRToast({
          header: '',
          message: 'You are already logged in!',
          variant: HttpVariantEnum.success,
        });
      return router.push(DEFAULT_LOGGED_IN_PATH);
    }
  }, [isHydration, accessToken, router, showToast]);

  return {
    setShowToast,
  };
};
