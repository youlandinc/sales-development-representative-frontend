import { get } from '../request';
import { PricingPlanResponse } from '@/types/pricingPlan';

export const _fetchAllPlan = () => {
  return get<PricingPlanResponse>('/sdr/pricing/info');
};
