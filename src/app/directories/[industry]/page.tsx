'use client';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { getDirectoriesBizId } from '@/utils/directories';
import { TITLE_MAP } from '@/constants/directories';
import { useDirectoriesStore } from '@/stores/directories';

import { DirectoriesIndustry, Layout } from '@/components/molecules';

export default function DirectoriesIndustryPage() {
  const router = useRouter();
  const params = useParams();
  const industrySlug = params.industry as string;
  const bizId = getDirectoriesBizId(industrySlug);

  const { syncFromRxJS, reset, initializeDataFlow } = useDirectoriesStore(
    useShallow((state) => ({
      syncFromRxJS: state.syncFromRxJS,
      reset: state.reset,
      initializeDataFlow: state.initializeDataFlow,
    })),
  );

  useEffect(() => {
    if (bizId) {
      initializeDataFlow(bizId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bizId]);

  useEffect(() => {
    const cleanup = syncFromRxJS();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!TITLE_MAP[industrySlug]) {
      router.replace('/directories');
    } else {
      document.title = `${TITLE_MAP[industrySlug]} - Directories - Corepass SalesOS`;
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
