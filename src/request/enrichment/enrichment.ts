import { del, post, put } from '@/request/request';
import { EnrichmentTableListResponse } from '@/types/enrichment';

/**
 * Fetch paginated enrichment table list
 * API: POST /sdr/table/list
 */
export const _fetchEnrichmentTableList = (params: {
  size: number;
  page: number;
  searchWord?: string;
}) => {
  return post<EnrichmentTableListResponse>('/sdr/table/list', params);
};

/**
 * Rename enrichment table
 * API: PUT /sdr/table
 */
export const _renameEnrichmentTable = (params: {
  tableName: string;
  tableId: string | number;
}) => {
  return put('/sdr/table', params);
};

/**
 * Delete enrichment table
 * API: DELETE /sdr/table
 */
export const _deleteEnrichmentTable = (tableId: string | number) => {
  return del('/sdr/table', {
    params: {
      tableId,
    },
  });
};

/**
 * Create enrichment table via CSV upload
 * API: POST /sdr/table/csv
 */
export const _createEnrichmentTableViaCsv = (params: FormData) => {
  return post('/sdr/table/csv', params, {
    headers: { 'content-type': 'multipart/form-data' },
  });
};

/**
 * Create blank enrichment table
 * API: POST /sdr/table
 */
export const _createBlankEnrichmentTable = () => {
  return post('/sdr/table');
};
