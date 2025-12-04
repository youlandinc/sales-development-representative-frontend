import { get, post, put } from '../request';
import {
  CreateWaterfallConfigRequestParam,
  IntegrationAction,
  IntegrationActionMenu,
  IntegrationActionType,
} from '@/types/enrichment';

export const _fetchAllActionsList = (actionType: IntegrationActionType) => {
  return get<IntegrationAction[]>(`/sdr/action/integration/${actionType}`);
};

export const _createIntegrationConfig = (
  tableId: string,
  param: CreateWaterfallConfigRequestParam,
) => {
  return post<string>(`/sdr/waterfall/table/${tableId}`, param);
};

export const _editIntegrationConfig = (
  groupId: string,
  param: CreateWaterfallConfigRequestParam,
) => {
  return put(`/sdr/waterfall/table/${groupId}`, param);
};

export const _fetchIntegrationMenus = () => {
  return get<IntegrationActionMenu[]>('/sdr/action/list');
};
