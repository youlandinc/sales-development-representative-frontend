import { del, get, post, put } from '@/request/request';
import {
  ResponseCampaignEmail,
  ResponseCampaignInfo,
  ResponseCampaignLeadsInfo,
  ResponseCampaignMessagingStep,
  SetupPhaseEnum,
} from '@/types';

// common
export const _sendChatMessage = (params: {
  chatId?: number;
  message: string;
}) => {
  return post<{ chatId: number | string }>('/sdr/ai/chat', params);
};

export const _fetchChatLeads = (chatId: string | number) => {
  return get<ResponseCampaignLeadsInfo>(`/sdr/ai/leads/${chatId}`);
};

export const _fetchCampaignInfo = (campaignId: string | number) => {
  return get<ResponseCampaignInfo>(`/sdr/campaign/info/${campaignId}`);
};

export const _updateCampaignProcessSnapshot = (params: {
  campaignId: string | number;
  setupPhase: SetupPhaseEnum;
}) => {
  return put('/sdr/campaign/redirect', params);
};

export const _closeSSE = (chatId: string | number) => {
  return del(`/sdr/ai/chat/subscriber/${chatId}`);
};

// first step
export const _createCampaign = (params: { chatId: number | string }) => {
  return post<ResponseCampaignInfo>('/sdr/campaign/info', params);
};

// second step
export const _fetchEmailByLead = (params: {
  campaignId: number | string;
  previewLeadId: number | string;
}) => {
  return get<ResponseCampaignEmail[]>(
    `/sdr/campaign/lead/preview/email/${params.campaignId}/${params.previewLeadId}`,
  );
};

export const _addStepEmail = (params: {
  campaignId: number | string;
  previewLeadId: number | string;
}) => {
  return post<ResponseCampaignMessagingStep>(
    `/sdr/campaign/step/${params.campaignId}`,
  );
};

export const _fetchStepEmail = (params: {
  stepId: string | number;
  previewLeadId: number | string;
}) => {
  return get<ResponseCampaignEmail>(
    `/srd/campaign/email/${params.previewLeadId}/${params.stepId}`,
  );
};

export const _deleteStepEmail = (stepId: string | number) => {
  return del(`/sdr/campaign/step/${stepId}`);
};
