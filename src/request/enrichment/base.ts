import { del, get, post, put } from '@/request/request';
import {
  CellDetailResponse,
  ResponseEnrichmentTable,
} from '@/types/enrichment';

export const _fetchEnrichmentTableData = (params: {
  size: number;
  page: number;
  searchWord?: string;
}) => {
  return post<ResponseEnrichmentTable>('/sdr/table/list', params);
};

export const _renameEnrichmentTable = (params: {
  tableName: string;
  tableId: string | number;
}) => {
  return put('/sdr/table', params);
};

export const _deleteEnrichmentTableItem = (tableId: string | number) => {
  return del('/sdr/table', {
    params: {
      tableId,
    },
  });
};

export const _createEnrichmentTableViaCsv = (params: FormData) => {
  return post('/sdr/table/csv', params, {
    headers: { 'content-type': 'multipart/form-data' },
  });
};

export const _fetchCellDetails = (fieldId: string, recordId: string) => {
  return get<CellDetailResponse>(
    `/sdr/table/data/cellDetail/${fieldId}/${recordId}`,
  );
};
