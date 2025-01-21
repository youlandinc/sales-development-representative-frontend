'use client';
export const fetchCache = 'force-no-store';

import { Layout } from '@/components/molecules';
import { Library } from '@/components/organisms';

const LibraryPage = () => {
  return (
    <Layout>
      <Library />
    </Layout>
  );
};

export default LibraryPage;
