'use client';
import { Layout, LibraryCompanyEdit } from '@/components/molecules';

export const fetchCache = 'force-no-store';

const LibraryCompanyEditPage = () => {
  return (
    <Layout>
      <LibraryCompanyEdit />
    </Layout>
  );
};

export default LibraryCompanyEditPage;
