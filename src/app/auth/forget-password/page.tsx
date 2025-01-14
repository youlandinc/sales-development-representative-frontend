'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import { useUserStore } from '@/provides';

import { SDRToast } from '@/components/atoms';
import { ForgetPassword } from '@/components/molecules';

import { HttpVariantEnum } from '@/types';

const ForgetPasswordPage = () => {
  const router = useRouter();

  const { isHydration, accessToken } = useUserStore((state) => state);

  useEffect(() => {
    if (!isHydration) {
      return;
    }
    if (accessToken) {
      SDRToast({
        header: '',
        message: 'You are already logged in!',
        variant: HttpVariantEnum.success,
      });
      return router.push('/');
    }
  }, [isHydration, accessToken, router]);

  return <ForgetPassword />;
};

export default ForgetPasswordPage;
