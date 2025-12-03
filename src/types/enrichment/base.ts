import {
  IntegrationAction,
  ProspectTableEnum,
  ValidationActionConfigParam,
} from '@/types';

export interface ProspectTableItem {
  tableId: string;
  tableName: string;
  createdAt: string | null;
  updatedAt: string | null;
  contacts: number;
  source: ProspectTableEnum;
  children: ProspectTableItem[] | null;
}

export type ResponseProspectTableViaSearch = ProspectTableItem[];

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
    validationActionConfig: ValidationActionConfigParam | null;
  };
}
