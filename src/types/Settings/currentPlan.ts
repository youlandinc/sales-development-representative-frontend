import { PlanTypeEnum } from '@/types/enum';
import { CreditTypeEnum } from '@/types/pricingPlan';

export interface CurrentPlanPlanInfoItem {
  categoryName: string;
  category: PlanTypeEnum;
  planName: string;
  planType: PlanTypeEnum;
  totalCredits: number;
  remainingCredits: number;
  creditType: CreditTypeEnum;
  planStartTime: string;
  planEndTime: string;
  remainingDays: number;
  status: PlanStatusEnum;
}

export interface FetchCurrentPlanResponse {
  currentPlans: CurrentPlanPlanInfoItem[];
}

export enum PlanStatusEnum {
  cancelled = 'CANCELED',
  succeeded = 'SUCCEEDED',
  created = 'CREATED',
}
