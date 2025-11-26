import { post } from '@/request/request';

import {
  DirectoriesBizIdEnum,
  DirectoriesQueryAdditionalApiResponse,
  DirectoriesQueryDefaultApiResponse,
  DirectoriesQueryTableBodyApiResponse,
  DirectoriesQueryTableHeaderApiResponse,
} from '@/types/directories';

export const _fetchOptionsViaDirectoriesKey = (params: {
  dataType: string;
  keyword?: string;
}) => {
  return post('/sdr/search/dict/options', params);
};

export const _fetchDirectoriesConfig = (params: {
  bizId: DirectoriesBizIdEnum;
}) => {
  return post<DirectoriesQueryDefaultApiResponse>('/sdr/search/config', params);
};

export const _fetchDirectoriesAdditionalConfig = (params: any) => {
  return post<DirectoriesQueryAdditionalApiResponse>(
    '/sdr/search/config/additional',
    params,
  );
};

export const _fetchPreviewHeader = (params: any) => {
  return post<DirectoriesQueryTableHeaderApiResponse>(
    '/sdr/column/config/header',
    params,
  );
};

export const _fetchPreviewBody = (params: any) => {
  return post<DirectoriesQueryTableBodyApiResponse>('/sdr/search', params);
};
