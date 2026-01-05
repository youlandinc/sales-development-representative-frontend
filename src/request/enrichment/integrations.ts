import { get, patch, post, put } from '../request';
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

export const _saveIntegrationConfig = (params: {
  tableId: string;
  actionKey: string;
  inputBinding: {
    name: string;
    formulaText: string;
  }[];
}) => {
  return post<string>('/sdr/table/field/add', {
    tableId: params.tableId,
    actionKey: params.actionKey,
    fieldType: 'TEXT',
    typeSettings: {
      inputBinding: params.inputBinding,
    },
  });
};

export const _updateIntegrationConfig = (params: {
  tableId: string;
  fieldId: string;
  inputBinding: {
    name: string;
    formulaText: string;
  }[];
}) => {
  return patch('/sdr/table/field/aiField', {
    tableId: params.tableId,
    fieldId: params.fieldId,
    typeSettings: {
      inputBinding: params.inputBinding,
    },
  });
};
