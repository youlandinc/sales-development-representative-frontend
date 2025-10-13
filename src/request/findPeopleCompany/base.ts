import { get } from '@/request/request';
import {
  FetchFiltersByTypeResponse,
  FetchSearchTypeResponse,
  FindType,
} from '@/types';

export const _fetchSearchType = (type: FindType) => {
  return get<FetchSearchTypeResponse>(
    `/sdr/prospect/search/types?findType=${type}`,
  );
};

export const _fetchFiltersByType = (bizId: string) => {
  return get<FetchFiltersByTypeResponse>(
    `/sdr/prospect/search/configs/${bizId}`,
  );
};
