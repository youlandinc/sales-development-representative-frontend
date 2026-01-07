import { del, patch, post } from '@/request/request';
import {
  ColumnCreationResponse,
  ColumnDeletionResponse,
  MetaColumnUpdateParams,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

/**
 * Create new column in table
 * API: POST /sdr/table/field/v2
 */
export const _createTableColumn = (params: {
  tableId: string;
  viewId: string;
  fieldType: TableColumnTypeEnum;
  beforeFieldId?: string;
  afterFieldId?: string;
}) => {
  return post<ColumnCreationResponse>('/sdr/table/field/v2', params);
};

/**
 * Update table column metadata
 * API: PATCH /sdr/table/field
 */
export const _updateTableMetaColumn = (
  params: Partial<MetaColumnUpdateParams>,
) => {
  return patch('/sdr/table/field', params);
};

/**
 * Delete table column
 * API: DELETE /sdr/table/field/:tableId/:fieldId
 */
export const _deleteTableColumn = (params: {
  tableId: string;
  fieldId: string;
}) => {
  return del<ColumnDeletionResponse>(
    `/sdr/table/field/${params.tableId}/${params.fieldId}`,
  );
};

/**
 * Batch update table columns
 * @deprecated Use _updateTableMetaColumn instead
 * API: PATCH /sdr/table/field/batch
 */
export const _updateTableColumns = (
  params: Partial<MetaColumnUpdateParams>[],
) => {
  return patch('/sdr/table/field/batch', params);
};
