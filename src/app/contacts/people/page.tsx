'use client';
export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

import { Layout } from '@/components/molecules';
import { ContactsPeoplePage } from '@/components/organisms';

const Directory = () => {
  return (
    <Layout>
      <ContactsPeoplePage />
    </Layout>
  );
};

export default Directory;
