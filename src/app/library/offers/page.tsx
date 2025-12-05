'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';

import { Layout, LibraryNewOffers } from '@/components/molecules';

const NewOfferPage = () => {
  useEffect(() => {
    document.title = 'Library - Corepass SalesOS';
  }, []);
  return (
    <Layout>
      <LibraryNewOffers />
    </Layout>
  );
};

export default NewOfferPage;
