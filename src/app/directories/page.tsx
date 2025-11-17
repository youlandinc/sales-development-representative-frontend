'use client';

export const fetchCache = 'force-no-store';

import { Directories, Layout } from '@/components/molecules';

const DirectoriesPage = () => {
  return (
    <Layout>
      <Directories />
    </Layout>
  );
};

export default DirectoriesPage;
