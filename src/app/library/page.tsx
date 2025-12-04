'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';

import { Layout } from '@/components/molecules';
import { Library } from '@/components/organisms';

const LibraryPage = () => {
  useEffect(() => {
    document.title = 'Library - Corepass SalesOS';
  }, []);
  return (
    <Layout>
      <Library />
    </Layout>
  );
};

export default LibraryPage;
