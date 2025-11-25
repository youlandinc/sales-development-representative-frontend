import { PlanTypeEnum } from '../enum';

export interface FetchCreditUsageListRequest {
  size: number;
  page: number;
  startTime?: string;
  endTime?: string;
  dateType?: string;
  category?: PlanTypeEnum;
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
  category: PlanTypeEnum;
  categoryName: string;
  planType: PlanTypeEnum;
  choosePlanName: string;
}

export interface FetchUsageTypeItem {
  parentCategory: string;
  children: UsageTypeChild[];
}
