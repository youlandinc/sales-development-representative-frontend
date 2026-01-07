// ============================================================================
// Table API Types (Response / Request)
// ============================================================================

import { RunRecordItem, TableColumnProps, TableViewData } from './index';
import { ColumnFieldGroupMap } from '../base';

// GET /table/:id - Table detail response
export interface TableDetailResponse {
  tableId: string;
  tableName: string;
  description: string | null;
  source: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  fields: TableColumnProps[];
  fieldGroupMap: ColumnFieldGroupMap | null;
  runRecords: { [key: string]: RunRecordItem } | null;
  views: TableViewData[];
}

// POST /table/:id/column - Create column response
export interface ColumnCreationResponse {
  field: TableColumnProps;
  views: TableViewData[];
}

// DELETE /table/field/:tableId/:fieldId - Delete column response
export type ColumnDeletionResponse = TableViewData[];
