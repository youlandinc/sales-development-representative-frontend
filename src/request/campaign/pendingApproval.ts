import { get, post, put } from '@/request/request';
import {
  CampaignsPendingEmailsResponseData,
  CampaignsPendingResponseData,
  ICampaignsPendingEmailsItem,
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

export const _editCampaignPendingEmail = (param: {
  emailId: number;
  subject: string;
  content: string;
}) => {
  return put('/sdr/campaign/pending/email', param);
};

export const _rewriteCampaignPendingEmail = (emailId: number) => {
  return post<ICampaignsPendingEmailsItem>(
    `/sdr/campaign/pending/email/${emailId}`,
  );
};

export const _approveCampaignPendingEmail = (
  emailId: number,
  isApprove: boolean,
) => {
  return post('/sdr/campaign/pending/email', { emailId, isApprove });
};

export const _approveAllCampaignPendingEmail = (campaignId: number) => {
  return put(`/sdr/campaign/pending/email/all/${campaignId}`);
};
export const _suspendCampaignPendingEmail = (
  campaignId: number,
  active: boolean,
) => {
  return put(`/sdr/campaign/info/status/${campaignId}`, { active });
};
