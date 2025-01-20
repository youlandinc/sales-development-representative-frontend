import { get, post } from '@/request/request';

export const _fetchCampaignStatistics = () => {
  return get('/sdr/campaign/statistics');
};

export const _fetchCampaignTableData = (params: {
  size: number;
  page: number;
}) => {
  return post('/sdr/campaign/infos', params);
};
