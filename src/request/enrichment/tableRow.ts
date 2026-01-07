import { post } from '@/request/request';
import {
  TableFilterParams,
  TableRowDataResponse,
  TableRowIdsResponse,
  TableRowsCreationResponse,
} from '@/types/enrichment/table';

/**
 * Fetch table row IDs with optional filters
 * API: POST /sdr/table/data/ids
 * @returns string[] - Array of recordIds
 */
export const _fetchTableRowIds = (params: {
  tableId: string;
  viewId: string;
  filters?: TableFilterParams;
}) => {
  return post<TableRowIdsResponse>('/sdr/table/data/ids', params);
};

/**
 * Fetch table row data by record IDs
 * API: POST /sdr/table/data/:tableId
 */
export const _fetchTableRowData = (params: {
  tableId: string;
  recordIds: string[];
}) => {
  return post<TableRowDataResponse>(`/sdr/table/data/${params.tableId}`, {
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
  return post<TableRowsCreationResponse>('/sdr/table/rows/add', {
    tableId: params.tableId,
    rowCounts: params.rowCounts,
  });
};
