import {
  CreatePaymentLinkParam,
  PricingPlanResponse,
  SendPricingEmailParam,
} from '@/types/pricingPlan';
import { get, post } from '../request';
import { PlanTypeEnum } from '@/types';

export const _fetchAllPlan = () => {
  return get<PricingPlanResponse>('/sdr/pricing/info');
};

export const _createPaymentLink = (param: CreatePaymentLinkParam) => {
  return post('/sdr/pricing/plan/payment/link', param);
};

export const _sendPricingEmail = (param: SendPricingEmailParam) => {
  return post('/sdr/pricing/plan/custom', param);
};

export const _reactivatePlan = (params: {
  planType: PlanTypeEnum;
  cancelUrl: string;
}) => {
  return post<string>('/sdr/pricing/plan/renew', params);
};
