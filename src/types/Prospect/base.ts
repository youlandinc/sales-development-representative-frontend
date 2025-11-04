import { IntegrationAction } from './integrations';

export interface ProspectTableItem {
  tableId: string | number;
  tableName: string;
  createdAt: string | null;
  updatedAt: string | null;
  contacts: number;
}

export interface ResponseProspectTable {
  content: ProspectTableItem[];
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface ColumnFieldGroupMapItem extends IntegrationAction {
  inputParameters: { name: string; formulaText: string }[];
}

export interface ColumnFieldGroupMap {
  [key: string]: {
    groupId: string;
    name: string;
    requiredInputsBinding: {
      name: string;
      formulaText: string;
      optional: boolean;
    }[];
    waterfallConfigs: ColumnFieldGroupMapItem[];
  };
}
