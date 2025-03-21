'use client';
export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

import { Layout } from '@/components/molecules';
import { ContactsListsPage } from '@/components/organisms';

const Directory = () => {
  return (
    <Layout>
      <ContactsListsPage />
    </Layout>
  );
};

export default Directory;
