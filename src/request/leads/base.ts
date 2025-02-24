import { get, post } from '@/request/request';
import { ResponseLeadsInfo } from '@/types';

export const _fetchLeadsTableData = (params: {
  size: number;
  page: number;
  searchWord: string;
}) => {
  return post('/sdr/leads/list', params);
};

export const _fetchLeadsInfoByLeadId = (leadId: string | number) => {
  return get<ResponseLeadsInfo>(`/sdr/leads/info/${leadId}`);
};
