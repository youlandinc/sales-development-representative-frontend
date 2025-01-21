import { get, post } from '@/request/request';
import { ResponseCampaignLeadsInfo } from '@/types';

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
