'use client';
export const fetchCache = 'force-no-store';

import { Layout } from '@/components/molecules';
import { Campaigns } from '@/components/organisms';

const CampaignsPage = () => {
  return (
    <Layout>
      <Campaigns />
    </Layout>
  );
};

export default CampaignsPage;
