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

export enum PaymentTypeEnum {
  MONTHLY = 'MONTH',
  YEARLY = 'YEAR',
}

export enum CreditTypeEnum {
  credit = 'CREDIT',
  record = 'RECORD',
  full_access = 'FULL_ACCESS',
}

export interface CreatePaymentLinkParam {
  planType: PlanTypeEnum;
  pricingType?: PaymentTypeEnum;
  successUrl: string;
  cancelUrl: string;
}

export interface SendPricingEmailParam {
  firstName: string;
  lastName: string;
  workEmail: string;
  phone: string;
  companyName: string;
  position: string;
  useCase: string;
  planType: PlanTypeEnum;
  pricingType: PaymentTypeEnum;
}
