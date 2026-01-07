import { get, post } from '@/request/request';

import {
  DirectoriesAdditionalConfigResponse,
  DirectoriesBizIdEnum,
  DirectoriesQueryConfigResponse,
  DirectoriesTableBodyResponse,
  DirectoriesTableHeaderResponse,
} from '@/types/directories';
import { EnrichmentTableAllResponse } from '@/types';
import { CreditTypeEnum } from '@/types/pricingPlan';

export const _fetchDirectoriesConfig = (params: {
  bizId: DirectoriesBizIdEnum;
}) => {
  return post<DirectoriesQueryConfigResponse>('/sdr/search/config', params);
};

export const _fetchDirectoriesAdditionalConfig = (params: any) => {
  return post<DirectoriesAdditionalConfigResponse>(
    '/sdr/search/config/additional',
    params,
  );
};

export const _fetchDirectoriesPreviewHeader = (params: any) => {
  return post<DirectoriesTableHeaderResponse>(
    '/sdr/column/config/header',
    params,
  );
};

export const _fetchDirectoriesPreviewBody = (params: any) => {
  return post<DirectoriesTableBodyResponse>('/sdr/search', params);
};

export const _fetchAllEnrichmentTable = () => {
  return post<EnrichmentTableAllResponse>('/sdr/table/all', {
    params: { size: 1000, page: 0 },
  });
};

export const _fetchCompanyNameViaTableId = (tableId: string) => {
  return get<string[]>(`/sdr/table/data/companyName/${tableId}`);
};

export const _fetchPlanCredits = (bizId: DirectoriesBizIdEnum) => {
  return post<{
    creditType: CreditTypeEnum;
    remainingCredits: number | null;
    totalCredits: number | null;
    planLimitRecordCount: number | null;
  }>('/sdr/pricing/plan/credits', {
    bizId,
  });
};
