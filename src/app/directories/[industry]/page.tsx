'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { getDirectoriesBizId } from '@/utils/directories';
import { TITLE_MAP } from '@/constants/directories';
import { useDirectoriesStore } from '@/stores/directories';

import { DirectoriesIndustry, Layout } from '@/components/molecules';

export default function DirectoriesIndustryPage() {
  const params = useParams();
  const router = useRouter();
  const industrySlug = params.industry as string;
  const bizId = getDirectoriesBizId(industrySlug);

  const initializeDataFlow = useDirectoriesStore(
    (state) => state.initializeDataFlow,
  );
  const syncFromRxJS = useDirectoriesStore((state) => state.syncFromRxJS);
  const reset = useDirectoriesStore((state) => state.reset);

  useEffect(() => {
    if (bizId) {
      initializeDataFlow(bizId);
    }
  }, [bizId, initializeDataFlow]);

  useEffect(() => {
    const cleanup = syncFromRxJS();
    return cleanup;
  }, [syncFromRxJS]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  useEffect(() => {
    if (!TITLE_MAP[industrySlug]) {
      router.replace('/directories');
    }
  }, [industrySlug, router]);

  if (!TITLE_MAP[industrySlug]) {
    return null;
  }

  return (
    <Layout contentSx={{ p: 0 }}>
      <DirectoriesIndustry />
    </Layout>
  );
}
