import {
  TableCellAIPhaseEnum,
  TableCellMetaDataValidateStatusEnum,
} from '@/types/enrichment/table/tableCell';
import { IntegrationAction, ValidationActionConfigParam } from './index';

export interface ColumnFieldGroupMapItem extends IntegrationAction {
  inputParameters: { name: string; formulaText: string }[];
}

export interface ColumnFieldGroupMap {
  [groupId: string]: {
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

export interface CellDetailSource {
  sourceUrl?: string;
  sourceName?: string;
}

export interface CellDetailLog {
  phase: TableCellAIPhaseEnum;
  attemptNo: number;
  sources: CellDetailSource[] | null;
  content: string;
}

export interface CellDetailResponse {
  status: TableCellMetaDataValidateStatusEnum | null;
  attemptNo: number | null;
  content: string | null;
  validateSummary: string | null;
  logs: CellDetailLog[];
}

export interface ActiveCellParams {
  columnId: string;
  rowId: string;
  rowData: Record<string, any>;
}
