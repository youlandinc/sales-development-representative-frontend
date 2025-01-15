'use client';

export const fetchCache = 'force-no-store';

import { useRouter } from 'nextjs-toploader/app';

import { StyledLayout } from '@/components/atoms';

const SettingsPage = () => {
  return (
    <StyledLayout>
      <h1>SettingsPage</h1>
    </StyledLayout>
  );
};

export default SettingsPage;
