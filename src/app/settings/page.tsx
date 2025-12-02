'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';

import { Layout } from '@/components/molecules';
import { Settings } from '@/components/organisms';

const SettingsPage = () => {
  useEffect(() => {
    document.title = 'Settings - Corepass SalesOS';
  }, []);

  return (
    <Layout>
      <Settings />
    </Layout>
  );
};

export default SettingsPage;
