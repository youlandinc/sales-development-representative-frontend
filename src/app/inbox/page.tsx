'use client';
export const fetchCache = 'force-no-store';

import { Layout } from '@/components/molecules';
import { Inbox } from '@/components/organisms';

const InboxPage = () => {
  return (
    <Layout>
      <Inbox />
    </Layout>
  );
};

export default InboxPage;
