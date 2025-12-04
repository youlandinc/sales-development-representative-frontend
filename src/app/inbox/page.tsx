'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';

import { Layout } from '@/components/molecules';
import { Inbox } from '@/components/organisms';

const InboxPage = () => {
  useEffect(() => {
    document.title = 'Inbox - Corepass SalesOS';
  }, []);
  return (
    <Layout>
      <Inbox />
    </Layout>
  );
};

export default InboxPage;
