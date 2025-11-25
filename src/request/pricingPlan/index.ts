import { FetchCurrentPlanResponse } from '@/types/Settings/currentPlan';
import { get, post } from '../request';
import {
  CreatePaymentLinkParam,
  PricingPlanResponse,
  SendPricingEmailParam,
} from '@/types/pricingPlan';

export const _fetchAllPlan = () => {
  return get<PricingPlanResponse>('/sdr/pricing/info');
};

export const _createPaymentLink = (param: CreatePaymentLinkParam) => {
  return post('/sdr/pricing/plan/payment/link', param);
};

export const _sendPricingEmail = (param: SendPricingEmailParam) => {
  return post('/sdr/pricing/plan/custom', param);
};
