import { FetchCurrentPlanResponse } from '@/types/Settings';
import { get, put } from '../request';
import { PlanTypeEnum } from '@/types';

export const _fetchCurrentPlan = () => {
  return get<FetchCurrentPlanResponse>('/sdr/pricing/planAndBilling');
};

export const _cancelPlan = (planType: PlanTypeEnum) => {
  return put('/sdr/pricing/plan/cancel', { planType });
};

export const _fetchPaymentPortal = (returnUrl: string) => {
  return get(`/sdr/pricing/plan/billing/portal?returnUrl=${returnUrl}`);
};
