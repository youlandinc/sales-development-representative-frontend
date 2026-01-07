import { get } from '@/request/request';
import { TableDetailResponse } from '@/types/enrichment/table';

/**
 * Fetch table detail
 * API: GET /sdr/table/:tableId
 */
export const _fetchTableDetail = (tableId: string) => {
  return get<TableDetailResponse>(`/sdr/table/${tableId}`);
};

/**
 * Export table data as CSV
 * API: GET /sdr/table/data/export
 */
export const _exportTableDataAsCsv = (tableId: string) => {
  return get('/sdr/table/data/export', {
    params: { tableId },
    responseType: 'blob',
    headers: {
      Accept: 'text/csv',
    },
  });
};
