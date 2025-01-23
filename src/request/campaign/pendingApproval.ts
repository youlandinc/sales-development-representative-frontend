import { get } from '@/request/request';
import { CampaignsPendingResponseData } from '@/types';

export const _fetchCampaignPendingInfo = (id: number) => {
  return get<CampaignsPendingResponseData>(`/sdr/campaign/info/${id}`);
};
