import { post } from '@/request/request';
import { TableCellProps, TableFilterParams } from '@/types/enrichment/table';

/**
 * Fetch table row IDs with optional filters
 * API: POST /sdr/table/data/ids
 */
export const _fetchTableRowIds = (params: {
  tableId: string;
  viewId: string;
  filters?: TableFilterParams;
}) => {
  return post('/sdr/table/data/ids', params);
};

/**
 * Fetch table row data by record IDs
 * API: POST /sdr/table/data/:tableId
 */
export const _fetchTableRowData = (params: {
  tableId: string;
  recordIds: string[];
}) => {
  return post<TableCellProps[]>(`/sdr/table/data/${params.tableId}`, {
    recordIds: params.recordIds,
  });
};

/**
 * Create new rows in table
 * API: POST /sdr/table/rows/add
 */
export const _createTableRows = (params: {
  tableId: string;
  rowCounts: number;
}) => {
  return post<string[]>('/sdr/table/rows/add', {
    tableId: params.tableId,
    rowCounts: params.rowCounts,
  });
};
