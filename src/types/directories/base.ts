import { PlanTypeEnum } from '@/types';

export enum DirectoriesBizIdEnum {
  capital_markets = 'CAPITAL_MARKETS',
  real_estate_lending = 'REAL_ESTATE_LENDING',
  business_corporate = 'BUSINESS_CORPORATE',
}

export interface DirectoryApiResponse {
  isAuth: boolean;
  planType: PlanTypeEnum;
  planLogo: string | null;
  planName: string | null;
  bizId: DirectoriesBizIdEnum;
  description: string;
  buttonDescription: string;
  logo: string;
  title: string;
  periodCount: number;
  statPeriod: string;
}

export interface DirectoriesImportApiResponse {
  tableId: string | null;
  remainingCredit: number | null;
  currentImportNumber: number | null;
  actualNeedCredit: number | null;
}
