'use client';

import { useEffect } from 'react';

import { Directories, Layout } from '@/components/molecules';

export const fetchCache = 'force-no-store';

const DirectoriesPage = () => {
  useEffect(() => {
    document.title = 'Directories – Corepass SalesOS';
  }, []);

  return (
    <Layout>
      <Directories />
    </Layout>
  );
};

export default DirectoriesPage;
