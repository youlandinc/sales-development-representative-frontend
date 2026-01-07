import { get, patch } from '@/request/request';
import { CellDetailResponse } from '@/types/enrichment';

/**
 * Update single cell value
 * API: PATCH /sdr/table/data/:tableId/records/:recordId
 */
export const _updateTableCell = (params: {
  tableId: string;
  recordId: string;
  fieldId: string;
  value: any;
}) => {
  return patch(`/sdr/table/data/${params.tableId}/records/${params.recordId}`, {
    fieldId: params.fieldId,
    value: params.value,
  });
};

/**
 * Fetch cell details (history, sources, etc.)
 * API: GET /sdr/table/data/cellDetail/:fieldId/:recordId
 */
export const _fetchTableCellDetails = (fieldId: string, recordId: string) => {
  return get<CellDetailResponse>(
    `/sdr/table/data/cellDetail/${fieldId}/${recordId}`,
  );
};
