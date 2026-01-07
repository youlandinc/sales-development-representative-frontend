// ============================================================================
// AI Related Types
// ============================================================================

export type AiLoadingState = Record<string, Record<string, boolean>>;

export interface AiRunParams {
  fieldId: string;
  recordId?: string;
  isHeader?: boolean;
  recordCount?: number;
}
