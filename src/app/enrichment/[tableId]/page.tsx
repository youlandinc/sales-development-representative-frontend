'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';

import { useEnrichmentTableStore } from '@/stores/enrichment';
import { EnrichmentDetail } from '@/components/organisms';

const EnrichmentTablePage = () => {
  const tableName = useEnrichmentTableStore((state) => state.tableName);

  useEffect(() => {
    if (tableName) {
      document.title = `${tableName} - Enrichment - Corepass SalesOS`;
    }
  }, [tableName]);

  return <EnrichmentDetail />;
};

export default EnrichmentTablePage;
