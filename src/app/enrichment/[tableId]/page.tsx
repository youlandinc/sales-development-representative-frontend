'use client';

import { useEffect } from 'react';

import { useProspectTableStore } from '@/stores/Prospect';
import { ProspectDetail } from '@/components/organisms';

export const fetchCache = 'force-no-store';

const EnrichmentTablePage = () => {
  const tableName = useProspectTableStore((state) => state.tableName);

  useEffect(() => {
    if (tableName) {
      document.title = `${tableName} - Enrichment - Corepass SalesOS`;
    }
  }, [tableName]);

  return <ProspectDetail />;
};

export default EnrichmentTablePage;
