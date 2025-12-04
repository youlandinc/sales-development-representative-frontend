'use client';

import { useEffect } from 'react';

import { Layout } from '@/components/molecules';
import { PricingPlan } from '@/components/organisms';

export const fetchCache = 'force-no-store';

const PlansPage = () => {
  useEffect(() => {
    document.title = 'View plans - Corepass SalesOS';
  }, []);

  return (
    <Layout>
      <PricingPlan />
    </Layout>
  );
};

export default PlansPage;
