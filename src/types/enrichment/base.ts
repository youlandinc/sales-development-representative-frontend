import {
  EnrichmentTableEnum,
  IntegrationAction,
  ValidationActionConfigParam,
} from '@/types';
import {
  TableCellDetailPhaseEnum,
  TableCellDetailValidateStatusEnum,
} from '@/types/enum';

export interface EnrichmentTableItem {
  tableId: string;
  tableName: string;
  createdAt: string | null;
  updatedAt: string | null;
  contacts: number;
  source: EnrichmentTableEnum;
  children: EnrichmentTableItem[] | null;
}

export type ResponseEnrichmentTableViaSearch = EnrichmentTableItem[];

export interface ResponseEnrichmentTable {
  content: EnrichmentTableItem[];
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

export interface CellDetailSource {
  sourceUrl?: string;
  sourceName?: string;
}

export interface CellDetailLog {
  phase: TableCellDetailPhaseEnum;
  attemptNo: number;
  sources: CellDetailSource[] | null;
  content: string;
}

export interface CellDetailResponse {
  status: TableCellDetailValidateStatusEnum | null;
  attemptNo: number | null;
  content: string | null;
  validateSummary: string | null;
  logs: CellDetailLog[];
}

export interface ActiveCellParams {
  columnId: string;
  rowId: string;
}

export interface RunRecordItem {
  recordIds: string[];
  isAll: boolean;
}
