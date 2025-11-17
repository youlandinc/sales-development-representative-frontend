'use client';

export const fetchCache = 'force-no-store';

import { Layout } from '@/components/molecules';
import { PricingPlan } from '@/components/organisms';

const PricingPlanPage = () => {
  return (
    <Layout>
      <PricingPlan />
    </Layout>
  );
};

export default PricingPlanPage;
