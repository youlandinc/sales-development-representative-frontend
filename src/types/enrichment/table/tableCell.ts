// ============================================================================
// Table Cell Types
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

export interface TableCellSourceItem {
  type: string;
  url: string;
  title: string;
}

export interface TableCellMetadata {
  runType: string;
  sources: TableCellSourceItem[] | null;
  thinkingProcess: string | null;
  validateStatus: TableCellMetaDataValidateStatusEnum | null;
}

export interface TableCellProps {
  cellId: string;
  fieldId: string;
  recordId: string;
  value: string | null;
  status: string | null;
  error: string | null;
  aiPhase: TableCellAIPhaseEnum | null;
  metadata: TableCellMetadata | null;
}

// Cell field data (used in table row)
export interface TableCellFieldData {
  isFinished?: boolean;
  metaData?: {
    isValidate?: boolean;
    imagePreview?: string;
    validateStatus?: TableCellMetaDataValidateStatusEnum | null;
  } | null;
}
