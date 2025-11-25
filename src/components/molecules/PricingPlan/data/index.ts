import { PlanTypeEnum } from '@/types';
import { CreditTypeEnum, PaymentTypeEnum } from '@/types/pricingPlan';

import ICON_USER from '../assets/icon_users.svg';
import ICON_BUILD from '../assets/icon_build.svg';
import { BASE_URL } from '@/constant';

export const PRICE_INFO: Record<string, string> = {
  [CreditTypeEnum.credit]: 'credits',
  [CreditTypeEnum.record]: 'records',
};

export const PERIOD_INFO: Record<string, string> = {
  [PaymentTypeEnum.MONTHLY]: 'per month',
  [PaymentTypeEnum.YEARLY]: 'per year, billed yearly',
};

export const packageTitle: Record<string, string> = {
  [PlanTypeEnum.intelligence]: 'Includes everything in Research, plus:',
};

export const CAPITAL_PLAN_DESC: Record<string, string> = {
  [PlanTypeEnum.research]: 'Built for emerging teams',
  [PlanTypeEnum.intelligence]: 'For institutional investors',
};
export const CAPITAL_PLAN_DESC_ICON: Record<string, string> = {
  [PlanTypeEnum.research]: ICON_USER,
  [PlanTypeEnum.intelligence]: ICON_BUILD,
};

export const SUCCESS_URL = `${BASE_URL}/directories`;
export const CANCEL_URL = `${BASE_URL}/pricing`;
