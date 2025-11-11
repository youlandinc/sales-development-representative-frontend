import { del, get, post, put } from '@/request/request';
import { BizCodeEnum, UserIntegrationItem } from '@/types';

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

// deprecated
export const _fetchEmailSignatures = () => {
  return get<
    { id: number; name: string; content: string; default?: boolean }[]
  >('/sdr/settings/signature/list');
};

//
export const _commonFetchSettings = (params: { bizCode: BizCodeEnum[] }) => {
  return get<
    Record<
      BizCodeEnum,
      { key: string; value: string; label: string; selected?: boolean }[]
    >
  >('/sdr/settings/config/options', {
    params,
    paramsSerializer: {
      indexes: null,
    },
  });
};

export const _deleteEmailSignature = (id: number) => {
  return del(`/sdr/settings/signature/${id}`);
};

export const _uploadFile = (files: FormData) => {
  return put('/usercenter/api/common/file/upload', files, {
    headers: { 'content-type': 'multipart/form-data' },
  });
};

export const _fetchCustomEmailDomains = (tenantId: string) => {
  return get(`/usercenter/api/customEmail/${tenantId}`);
};

export const _addCustomEmailDomain = (params: { domain: string }) => {
  return post('/usercenter/api/customEmail', { ...params });
};

export const _fetchIdentityCustomEmailDomain = (params: { domain: string }) => {
  return post('/usercenter/api/customEmail/identities', params);
};

export const _modifyCustomEmailDomain = (params: {
  id: number;
  userName: string;
}) => {
  return post('/usercenter/api/customEmail/modify', params);
};

export const _verifyCustomEmailDomain = (params: { domain: string }) => {
  return post('/usercenter/api/customEmail/verify', params);
};

export const _deleteCustomEmailDomain = (id: number | string) => {
  return del(`/usercenter/api/customEmail/${id}`);
};

export const _fetchMailboxes = () => {
  return get('/sdr/mailbox/list');
};
