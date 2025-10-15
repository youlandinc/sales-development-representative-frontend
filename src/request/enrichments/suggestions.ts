import { get, post } from '../request';
import { IntegrationActionType } from '@/types/Prospect/tableActions';
import { IntegrationAction } from '@/types/Prospect/tableActions';

export const _fetchAllActionsList = (actionType: IntegrationActionType) => {
  return get<IntegrationAction[]>(`/sdr/action/integration/${actionType}`);
};

export const _createIntegrationConfig = (
  tableId: string,
  param: Record<string, any>,
) => {
  return post(`/sdr/waterfall/table/${tableId}`, param);
};
