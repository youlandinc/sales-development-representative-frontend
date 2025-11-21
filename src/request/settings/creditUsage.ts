import { post } from '../request';

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
