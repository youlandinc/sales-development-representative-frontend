import { get, post } from '../request';
import {
  CreateWaterfallConfigRequestParam,
  IntegrationAction,
  IntegrationActionType,
} from '@/types/Prospect';

export const _fetchAllActionsList = (actionType: IntegrationActionType) => {
  return get<IntegrationAction[]>(`/sdr/action/integration/${actionType}`);
};

export const _createIntegrationConfig = (
  tableId: string,
  param: CreateWaterfallConfigRequestParam,
) => {
  return post<string>(`/sdr/waterfall/table/${tableId}`, param);
};
