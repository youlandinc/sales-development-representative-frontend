'use client';

import { useEffect } from 'react';

import { Layout } from '@/components/molecules';
import { Settings } from '@/components/organisms';

export const fetchCache = 'force-no-store';

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
