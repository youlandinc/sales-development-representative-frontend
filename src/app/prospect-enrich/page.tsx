'use client';

export const fetchCache = 'force-no-store';

import { Layout } from '@/components/molecules';
import { Prospect } from '@/components/organisms';

const ProsectAndEnrich = () => {
  return (
    <Layout contentSx={{ pb: 1 }}>
      <Prospect />
    </Layout>
  );
};

export default ProsectAndEnrich;
