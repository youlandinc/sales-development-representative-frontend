import { FetchUsageTypeItem } from '@/types';
import { get, post } from '../request';

import {
  CreditUsageItemInfo,
  FetchCreditUsageListRequest,
} from '@/types/Settings/creditUsage';

export const _fetchCreditUsageList = (param: FetchCreditUsageListRequest) => {
  return post<PaginationResponse<CreditUsageItemInfo>>(
    '/sdr/pricing/credit/usage',
    param,
  );
};

export const _fetchUsageType = () => {
  return get<FetchUsageTypeItem[]>('/sdr/pricing/plan/purchased');
};
