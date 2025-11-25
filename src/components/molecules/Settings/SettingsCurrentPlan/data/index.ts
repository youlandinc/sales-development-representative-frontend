import { PlanTypeEnum } from '@/types';
import { CreditTypeEnum } from '@/types/pricingPlan';

// Premium plan types with gradient badges
export const PREMIUM_PLAN_TYPES = [
  PlanTypeEnum.research,
  PlanTypeEnum.intelligence,
  PlanTypeEnum.institutional,
  PlanTypeEnum.enterprise,
  PlanTypeEnum.pro,
] as const;

// Full access plan types (no credit limits)
export const FULL_ACCESS_PLAN_TYPES = [
  PlanTypeEnum.research,
  PlanTypeEnum.intelligence,
  PlanTypeEnum.institutional,
  PlanTypeEnum.enterprise,
] as const;

// Design tokens
export const COLORS = {
  background: '#F8F8FA',
  text: {
    primary: '#363440',
    secondary: '#6F6C7D',
  },
  progress: {
    background: '#EAE9EF',
    bar: '#363440',
  },
} as const;

// Credit type display mapping
export const CREDIT_TYPE_LABELS: Record<CreditTypeEnum, string> = {
  [CreditTypeEnum.credit]: 'Credits',
  [CreditTypeEnum.record]: 'Records',
  [CreditTypeEnum.full_access]: 'Full Access',
} as const;

export const computedStyle = (type: PlanTypeEnum) => {
  switch (type) {
    case PlanTypeEnum.free:
      return {
        color: '#6F6C7D',
        bgcolor: '#DFDEE6',
      };
    case PlanTypeEnum.basic:
    case PlanTypeEnum.starter:
    case PlanTypeEnum.essential:
      return {
        color: '#3F67C6',
        bgcolor: '#DFEDFF',
      };
    case PlanTypeEnum.professional:
    case PlanTypeEnum.business:
    case PlanTypeEnum.plus:
      return {
        color: '#823FC6',
        bgcolor: '#EADFFF',
      };
    case PlanTypeEnum.research:
    case PlanTypeEnum.intelligence:
    case PlanTypeEnum.institutional:
    case PlanTypeEnum.enterprise:
    case PlanTypeEnum.pro:
      return {
        color: '#FFFFFF',
        bgcolor: '#363440',
      };
    default:
      return {
        color: '#6F6C7D',
        bgcolor: '#DFDEE6',
      };
  }
};
