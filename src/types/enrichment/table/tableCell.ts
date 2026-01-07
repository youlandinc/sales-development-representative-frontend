// ============================================================================
// Table Cell Types
// ============================================================================

export enum TableCellConfidenceEnum {
  high = 'HIGH',
  medium = 'MEDIUM',
  low = 'LOW',
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
  confidence: TableCellConfidenceEnum | null;
}

export interface TableCellProps {
  cellId: string;
  fieldId: string;
  recordId: string;
  value: string | null;
  status: string | null;
  error: string | null;
  metadata: TableCellMetadata | null;
}

// Cell field data (used in table row)
export interface TableCellFieldData {
  isFinished?: boolean;
  metaData?: {
    isValidate?: boolean;
    imagePreview?: string;
    confidence?: TableCellConfidenceEnum | null;
  } | null;
}
