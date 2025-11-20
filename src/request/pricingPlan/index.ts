import { get, post } from '../request';
import {
  CreatePaymentLinkParam,
  PricingPlanResponse,
} from '@/types/pricingPlan';

export const _fetchAllPlan = () => {
  return get<PricingPlanResponse>('/sdr/pricing/info');
};

export const _createPaymentLink = (param: CreatePaymentLinkParam) => {
  return post('/sdr/pricing/plan/payment/link', param);
};
