'use client';
export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

import { Layout } from '@/components/molecules';
import { ContactsCompaniesPage } from '@/components/organisms';

const Segments = () => {
  return (
    <Layout>
      <ContactsCompaniesPage />
    </Layout>
  );
};

export default Segments;
