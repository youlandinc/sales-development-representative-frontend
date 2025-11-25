import { FetchCurrentPlanResponse } from '@/types/Settings';
import { get, put } from '../request';
import { PlanTypeEnum } from '@/types';

export const _fetchCurrentPlan = () => {
  return get<FetchCurrentPlanResponse>('/sdr/pricing/planAndBilling');
};

export const _cancelPlan = (category: PlanTypeEnum) => {
  return put('/sdr/pricing/plan/cancel', { category });
};
