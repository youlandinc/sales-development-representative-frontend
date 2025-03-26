'use client';
export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

import { Layout } from '@/components/molecules';
import { ContactsPage } from '@/components/organisms';

const Directory = () => {
  return (
    <Layout>
      <ContactsPage />
    </Layout>
  );
};

export default Directory;
