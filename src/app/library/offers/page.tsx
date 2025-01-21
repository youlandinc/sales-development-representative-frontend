'use client';
export const fetchCache = 'force-no-store';

import { Layout, LibraryNewOffers } from '@/components/molecules';

const NewOfferPage = () => {
  return (
    <Layout>
      <LibraryNewOffers />
    </Layout>
  );
};

export default NewOfferPage;
