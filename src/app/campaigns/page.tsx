'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';

import { Layout } from '@/components/molecules';
import { Campaigns } from '@/components/organisms';

const CampaignsPage = () => {
  useEffect(() => {
    document.title = 'Campaigns - Corepass SalesOS';
  }, []);
  return (
    <Layout>
      <Campaigns />
    </Layout>
  );
};

export default CampaignsPage;
