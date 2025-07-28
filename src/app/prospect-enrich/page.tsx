'use client';

export const fetchCache = 'force-no-store';

import { Layout } from '@/components/molecules';
import { Enrich } from '@/components/organisms';

const ProsectAndEnrich = () => {
  return (
    <Layout>
      <Enrich />
    </Layout>
  );
};

export default ProsectAndEnrich;
