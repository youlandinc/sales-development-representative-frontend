import { PlanTypeEnum } from './enum';

export interface pricingOption {
  planDateTypeName: string;
  type: null | string;
}

export interface PlanInfo {
  packages: string[];
  planName: string;
  isDefault: boolean;
  credit: null | number;
  creditType: string;
  monthlyPrice: null | number;
  planType: PlanTypeEnum;
  priceAdditionalInfo: string | null;
  yearlyPrice: null | number;
}

export interface PlanCategoryConfig {
  category: string;
  categoryName: string;
  pricingOptions: pricingOption[];
  plans: PlanInfo[];
}

export interface PricingPlanResponse {
  [key: string]: PlanCategoryConfig[];
}

export enum PaymentType {
  MONTHLY = 'MONTH',
  YEARLY = 'YEAR',
}

export enum CreditType {
  credit = 'CREDIT',
  record = 'RECORD',
  full_access = 'FULL_ACCESS',
}

export interface CreatePaymentLinkParam {
  planType: PlanTypeEnum;
  pricingType?: PaymentType;
  successUrl: string;
  cancelUrl: string;
}
