'use client';

import { useEffect } from 'react';

import { Layout } from '@/components/molecules';
import { Enrichment } from '@/components/organisms';

export const fetchCache = 'force-no-store';

const EnrichmentPage = () => {
  useEffect(() => {
    document.title = 'Enrichment – Corepass SalesOS';
  }, []);

  return (
    <Layout contentSx={{ pb: 1 }}>
      <Enrichment />
    </Layout>
  );
};

export default EnrichmentPage;
