import { del, get, post, put } from '@/request/request';
import { ResponseCampaignStatistics, ResponseCampaignTable } from '@/types';

export const _fetchCampaignStatistics = () => {
  return get<ResponseCampaignStatistics>('/sdr/campaign/statistics');
};

export const _fetchCampaignTableData = (params: {
  size: number;
  page: number;
  searchWord?: string;
}) => {
  return post<ResponseCampaignTable>('/sdr/campaign/infos', params);
};

export const _deleteCampaignTableItem = (campaignId: string | number) => {
  return del(`/sdr/campaign/info/${campaignId}`);
};

export const _renameCampaign = (params: {
  campaignName: string;
  campaignId: string | number;
}) => {
  return put('/sdr/campaign/name', params);
};
