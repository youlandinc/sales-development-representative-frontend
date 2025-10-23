import { del, get, post, put } from '@/request/request';
import { UserIntegrationItem } from '@/types';

export const _fetchSettingsInfo = async (tenantId: string) => {
  return get(`/sdr/settings/info/${tenantId}`);
};

export const _updateSettingsInfo = async (params: {
  tenantId: string;
  name: string;
  avatar: string;
}) => {
  return post('/sdr/settings/info/save', params);
};

export const _fetchHubspotIntegrations = async () => {
  return get<UserIntegrationItem[]>('/sdr/settings/integrations');
};

export const _createEmailSignature = (params: {
  id?: number;
  name: string;
  content: string;
}) => {
  return post('/sdr/settings/signature', params);
};

export const _fetchEmailSignatures = () => {
  return get<{ id: number; name: string; content: string }[]>(
    '/sdr/settings/signature/list',
  );
};

export const _deleteEmailSignature = (id: number) => {
  return del(`/sdr/settings/signature/${id}`);
};

export const _uploadFile = (files: FormData) => {
  return put('/usercenter/api/common/file/upload', files, {
    headers: { 'content-type': 'multipart/form-data' },
  });
};
