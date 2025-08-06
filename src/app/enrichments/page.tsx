'use client';
export const fetchCache = 'force-no-store';

import { EnrichmetsTable, Layout } from '@/components/molecules';

export default () => {
  return (
    <Layout>
      <EnrichmetsTable />
    </Layout>
  );
};
