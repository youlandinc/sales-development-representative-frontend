'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { Layout } from '@/components/molecules';

const DynamicSettings = dynamic(
  () => import('@/components/organisms').then((mod) => mod.Settings),
  {
    ssr: false,
  },
);

export default function SettingsPage() {
  useEffect(() => {
    document.title = 'Settings - Corepass SalesOS';
  }, []);

  return (
    <Layout>
      <DynamicSettings />
    </Layout>
  );
}
