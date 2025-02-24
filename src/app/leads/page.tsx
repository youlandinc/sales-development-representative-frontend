'use client';

export const fetchCache = 'force-no-store';

import { Layout } from '@/components/molecules';
import { Leads } from '@/components/organisms';

const LeadsPage = () => {
  return (
    <Layout>
      <Leads />
    </Layout>
  );
};

export default LeadsPage;
