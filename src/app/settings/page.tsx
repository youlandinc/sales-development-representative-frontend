'use client';

export const fetchCache = 'force-no-store';

import { Layout } from '@/components/molecules';
import { Settings } from '@/components/organisms';

const SettingsPage = () => {
  return (
    <Layout>
      <Settings />
    </Layout>
  );
};

export default SettingsPage;
