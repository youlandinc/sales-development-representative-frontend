import {
  CreditUsageItemInfo,
  FetchCreditUsageListRequest,
  FetchUsageTypeItem,
} from '@/types';
import { get, post } from '../request';

export const _fetchCreditUsageList = (param: FetchCreditUsageListRequest) => {
  return post<PaginationResponse<CreditUsageItemInfo>>(
    '/sdr/pricing/credit/usage',
    param,
  );
};

export const _fetchUsageType = () => {
  return get<FetchUsageTypeItem[]>('/sdr/pricing/plan/purchased');
};
