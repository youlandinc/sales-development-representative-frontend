'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { TITLE_MAP } from '@/constants/directories';

import { DirectoriesIndustry, Layout } from '@/components/molecules';

export default function DirectoriesIndustryPage() {
  const params = useParams();
  const router = useRouter();
  const industrySlug = params.industry as string;

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
