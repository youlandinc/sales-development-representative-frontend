'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';

import { Directories, Layout } from '@/components/molecules';

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
