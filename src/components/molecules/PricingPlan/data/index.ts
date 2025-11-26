import { PlanTypeEnum } from '@/types';
import { CreditTypeEnum, PaymentTypeEnum, PlanInfo } from '@/types/pricingPlan';

import ICON_USER from '../assets/icon_users.svg';
import ICON_BUILD from '../assets/icon_build.svg';

import { BASE_URL } from '@/constants';

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

// Constants
export const COLORS = {
  PRIMARY: '#363440',
  BORDER: '#DFDEE6',
  BACKGROUND: '#EAE9EF',
} as const;

export const DIMENSIONS = {
  CARD_WIDTH: 384,
  MIN_HEIGHT: 496,
  ICON_SIZE: { width: 258, height: 310 },
} as const;

export const UNLIMITED_PLAN_TYPES = [
  PlanTypeEnum.institutional,
  PlanTypeEnum.enterprise,
] as const;

export const TYPOGRAPHY_STYLES = {
  HEADER_TEXT: {
    fontSize: 22,
    lineHeight: '36px',
    color: 'text.secondary',
    minHeight: 36,
  },
  PACKAGE_TITLE: {
    color: 'text.primary',
    fontSize: 14,
  },
} as const;

export const ICON_STYLES = {
  CHECKED: {
    width: 16,
    height: 16,
    '& path[fill]': { fill: 'currentColor' },
    '& path[stroke]': { stroke: 'currentColor' },
  },
  PACKAGE: {
    width: 24,
    height: 24,
    flexShrink: 0,
  },
} as const;

// Helper functions
export const isPaidPlan = (
  planType: PlanTypeEnum,
  paidPlans: PlanTypeEnum[],
) => {
  return planType === PlanTypeEnum.free || paidPlans.includes(planType);
};

export const hasPrice = (plan: PlanInfo) => {
  return Boolean(plan.monthlyPrice && plan.yearlyPrice);
};

export const isUnlimitedPlan = (planType: PlanTypeEnum) => {
  return UNLIMITED_PLAN_TYPES.includes(planType as any);
};
