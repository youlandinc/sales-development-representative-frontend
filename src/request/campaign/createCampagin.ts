import { get, post } from '@/request/request';

export const _sendChatMessage = (params: {
  chatId?: number;
  message: string;
}) => {
  return post('/sdr/ai/chat', params);
};

export const _fetchChatLeads = (chatId: string | number) => {
  return get(`/sdr/ai/chat/${chatId}`);
};
