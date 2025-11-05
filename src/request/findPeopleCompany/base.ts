import { get, post } from '@/request/request';
import {
  FetchFiltersByTypeResponse,
  FetchSearchTypeResponse,
  FindType,
  ResponseProspectTableViaSearch,
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

export const _fetchFindPeopleCompanyGridHeader = (bizId: string) => {
  return post<{ columnKey: string; columnName: string }[]>(
    `/sdr/prospect/search/tables/${bizId}`,
  );
};

export const _fetchGridDate = (param: Record<string, any>) => {
  return post<{
    findCount: number;
    findList: {
      id: string;
      name: string;
      companyName: string;
      jobTitle: string;
      linkedinUrl: string;
      location: string;
    }[];
  }>('/sdr/prospect/find/search', param);
};

export const _createTableByFindPeopleCompany = (param: Record<string, any>) => {
  return post<string>('/sdr/prospect/table/import', param);
};

export const _fetchAllProspectTable = () => {
  return post<ResponseProspectTableViaSearch>('/sdr/prospect/all', {
    params: { size: 1000, page: 0 },
  });
};

export const _fetchCompanyNameViaTableId = (tableId: string) => {
  return get<string[]>(`/sdr/prospect/table/companyName/${tableId}`);
};
