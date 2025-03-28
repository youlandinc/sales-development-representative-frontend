import { get, post } from '@/request/request';
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
