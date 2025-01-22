import { get, post, put } from '@/request/request';
import {
  ResponseCampaignInfo,
  ResponseCampaignLeadsInfo,
  SetupPhaseEnum,
} from '@/types';

export const _sendChatMessage = (params: {
  chatId?: number;
  message: string;
}) => {
  return post<{ chatId: number | string }>('/sdr/ai/chat', params);
};

export const _fetchChatLeads = (chatId: string | number) => {
  return get<ResponseCampaignLeadsInfo>(`/sdr/ai/leads/${chatId}`);
};

export const _createCampaign = (params: { chatId: number | string }) => {
  return post('/sdr/campaign/info', params);
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
