'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';

import { Layout, LibraryCompanyEdit } from '@/components/molecules';

const LibraryCompanyEditPage = () => {
  useEffect(() => {
    document.title = 'Library - Corepass SalesOS';
  }, []);
  return (
    <Layout>
      <LibraryCompanyEdit />
    </Layout>
  );
};

export default LibraryCompanyEditPage;
