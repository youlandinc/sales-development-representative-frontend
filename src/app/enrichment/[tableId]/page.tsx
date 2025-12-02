'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';

import { useProspectTableStore } from '@/stores/Prospect';
import { ProspectDetail } from '@/components/organisms';

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
