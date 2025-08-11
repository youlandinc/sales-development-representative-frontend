'use client';

export const fetchCache = 'force-no-store';

import { Layout } from '@/components/molecules';
import { Prospect } from '@/components/organisms';

const ProsectAndEnrich = () => {
  return (
    <Layout>
      <Prospect />
    </Layout>
  );
};

export default ProsectAndEnrich;
