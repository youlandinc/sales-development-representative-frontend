import { del, post, put } from '@/request/request';

export const _saveMailbox = (params: {
  prefixName: string;
  domain: string;
}) => {
  return post('/sdr/mailbox/info', params);
};

export const _updateMailbox = (params: {
  id: string;
  prefixName: string;
  domain: string;
}) => {
  return put('/sdr/mailbox/info', params);
};

export const _deleteMailbox = (id: string) => {
  return del(`/sdr/mailbox/info/${id}`);
};
