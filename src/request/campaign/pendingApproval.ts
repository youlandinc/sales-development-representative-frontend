import { get } from '@/request/request';
import {
  CampaignsPendingEmailsResponseData,
  CampaignsPendingResponseData,
} from '@/types';

export const _fetchCampaignPendingInfo = (id: number) => {
  return get<CampaignsPendingResponseData>(`/sdr/campaign/info/${id}`);
};

export const _fetCampaignPendingEmails = (
  campaignId: number,
  pageSize: number,
  pageNumber: number,
) => {
  return get<CampaignsPendingEmailsResponseData>(
    `/sdr/campaign/pending/email/${campaignId}/${pageSize}/${pageNumber}`,
  );
};
