import { PlanCategoryEnum, PlanTypeEnum } from '../enum';

export interface FetchCreditUsageListRequest {
  size: number;
  page: number;
  startTime?: string;
  endTime?: string;
  dateType?: string;
  category?: PlanCategoryEnum;
}

export interface CreditUsageItemInfo {
  id: number;
  creditsUsed: number;
  remainingCredits: number;
  tableName: string;
  directory: string;
  searchTime: string;
  providers: {
    companyName: string;
    companyUrl: string;
    creditsUsed: number;
  }[];
  date: string;
  integrationName: string;
}

export interface UsageTypeChild {
  category: PlanCategoryEnum;
  categoryName: string;
  planType: PlanTypeEnum;
  choosePlanName: string;
}

export interface FetchUsageTypeItem {
  parentCategory: string;
  children: UsageTypeChild[];
}

export enum DateRangeEnum {
  this_month = 'THIS_MONTH',

  last_month = 'LAST_MONTH',

  last_3_months = 'LAST_3_MONTHS',

  last_6_months = 'LAST_6_MONTHS',

  range = 'RANGE',
}

export interface UsageTypeOptions extends TOption {
  planName?: string;
  planType?: PlanTypeEnum;
}
