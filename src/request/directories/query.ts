import { get, post } from '@/request/request';

import {
  DirectoriesBizIdEnum,
  DirectoriesQueryAdditionalApiResponse,
  DirectoriesQueryDefaultApiResponse,
  DirectoriesQueryTableBodyApiResponse,
  DirectoriesQueryTableHeaderApiResponse,
} from '@/types/directories';
import { ResponseProspectTableViaSearch } from '@/types';

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

export const _fetchAllProspectTable = () => {
  return post<ResponseProspectTableViaSearch>('/sdr/table/all', {
    params: { size: 1000, page: 0 },
  });
};

export const _fetchCompanyNameViaTableId = (tableId: string) => {
  return get<string[]>(`/sdr/prospect/table/companyName/${tableId}`);
};
