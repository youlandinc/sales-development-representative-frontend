// ============================================================================
// Table Cell Enums
// ============================================================================

export enum TableCellAIPhaseEnum {
  thinking = 'THINKING',
  searching = 'SEARCHING',
  verifying = 'VERIFYING',
  re_searching = 'RE_SEARCHING',
  standardizing = 'STANDARDIZING',
  populating = 'POPULATING',
}

export enum TableCellMetaDataValidateStatusEnum {
  verified = 'VERIFIED',
  potential_issue = 'POTENTIAL_ISSUE',
  not_validated = 'NOT_VALIDATED',
  not_found = 'NOT_FOUND',
}

// ============================================================================
// Table Cell Metadata Types (Mutually Exclusive)
// ============================================================================

export type TableCellMetadata =
  | {
      isValidate: boolean;
      status: string;
      imagePreview: string;
      validateStatus?: never;
    }
  | {
      isValidate: boolean;
      status: string;
      validateStatus: TableCellMetaDataValidateStatusEnum;
      imagePreview?: never;
    }
  | {
      isValidate: boolean;
      status: string;
      imagePreview?: never;
      validateStatus?: never;
    };

// ============================================================================
// Table Cell Field Data Types
// ============================================================================

export interface TableCellFieldData {
  fid: string;
  value: any;
  isFinished?: boolean;
  aiPhase?: TableCellAIPhaseEnum | null;
  validateStatus?: TableCellMetaDataValidateStatusEnum | null;
  externalContent?: {
    validateStatus: TableCellMetaDataValidateStatusEnum;
    stepsTaken: [];
    reasoning: '';
    [key: string]: any;
  };
  metaData?: TableCellMetadata | null;
}

export interface TableRowBaseData {
  deleted?: boolean;
  id?: string;
  tableId?: string;
  sourceId?: string;
  createBy?: string;
  updateBy?: string;
  createdAt?: number;
  updatedAt?: number;
  tenantId?: string;
}

export interface TableRowCellData {
  [fieldId: string]: TableCellFieldData;
}

export type TableRowItemData = TableRowBaseData & TableRowCellData;

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
