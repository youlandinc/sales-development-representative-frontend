import { get } from '../request';
import { IntegrationActionType } from '@/types/Prospect/tableActions';
import { FetchAllActionsListResponse } from '@/types/Prospect/tableActions';

export const _fetchAllActionsList = (actionType: IntegrationActionType) => {
  return get<FetchAllActionsListResponse>(
    `/sdr/action/integration/${actionType}`,
  );
};
