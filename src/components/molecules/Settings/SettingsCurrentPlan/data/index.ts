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

// Credit type display mapping
export const CREDIT_TYPE_LABELS: Record<CreditTypeEnum, string> = {
  [CreditTypeEnum.credit]: 'Credits',
  [CreditTypeEnum.record]: 'Records',
  [CreditTypeEnum.full_access]: 'Full Access',
} as const;

export const computedPlanBadgeStyle = (type: PlanTypeEnum) => {
  switch (type) {
    case PlanTypeEnum.free:
      return {
        textColor: '#6F6C7D',
        bgColor: '#DFDEE6',
      };
    case PlanTypeEnum.basic:
    case PlanTypeEnum.starter:
    case PlanTypeEnum.essential:
      return {
        textColor: '#3F67C6',
        bgColor: '#DFEDFF',
      };
    case PlanTypeEnum.professional:
    case PlanTypeEnum.business:
    case PlanTypeEnum.plus:
      return {
        textColor: '#823FC6',
        bgColor: '#EADFFF',
      };
    case PlanTypeEnum.research:
    case PlanTypeEnum.intelligence:
    case PlanTypeEnum.institutional:
    case PlanTypeEnum.enterprise:
    case PlanTypeEnum.pro:
      return {
        textColor: '#FFFFFF',
        bgColor: '#363440',
      };
    default:
      return {
        textColor: '#6F6C7D',
        bgColor: '#DFDEE6',
      };
  }
};
