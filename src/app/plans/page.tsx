'use client';

export const fetchCache = 'force-no-store';

import { Layout } from '@/components/molecules';
import { PricingPlan } from '@/components/organisms';

const PlansPage = () => {
  return (
    <>
      <title>View plans - Corepass SalesOS</title>
      <Layout>
        <PricingPlan />
      </Layout>
    </>
  );
};

export default PlansPage;
