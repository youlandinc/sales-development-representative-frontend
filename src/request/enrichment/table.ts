import { del, get, patch, post, put } from '@/request/request';
import {
  AddColumnApiData,
  TableCellProps,
  TableColumnProps,
  TableColumnTypeEnum,
  TableDataApiResponse,
  TableViewData,
  UpdateTableMetaColumnParams,
  UpdateTableViewColumnParams,
  UpdateTableViewColumnsParams,
} from '@/types/enrichment/table';
import { TableFilterRequestParams } from '@/types/enrichment/tableFilter';

export const _fetchTable = (tableId: string) => {
  return get<TableDataApiResponse>(`/sdr/table/${tableId}`);
};

export const _fetchTableRowIds = (params: {
  tableId: string;
  viewId: string;
  filters?: TableFilterRequestParams;
}) => {
  return post('/sdr/table/data/ids', params);
};

export const _fetchTableRowData = (params: {
  tableId: string;
  recordIds: string[];
}) => {
  return post<TableCellProps[]>(`/sdr/table/data/${params.tableId}`, {
    recordIds: params.recordIds,
  });
};

export const _updateTableCellValue = (params: {
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

export const _createTableRows = (params: {
  tableId: string;
  rowCounts: number;
}) => {
  return post<string[]>('/sdr/table/rows/add', {
    tableId: params.tableId,
    rowCounts: params.rowCounts,
  });
};

export const _exportTableData = (tableId: string) => {
  return get('/sdr/table/data/export', {
    params: { tableId },
    responseType: 'blob',
    headers: {
      Accept: 'text/csv',
    },
  });
};

export const _createBlankTable = () => {
  return post('/sdr/table');
};

// columns
export const _updateTableMetaColumn = (
  params: Partial<UpdateTableMetaColumnParams>,
) => {
  return patch('/sdr/table/field', params);
};

export const _updateTableViewColumn = (
  params: Partial<UpdateTableViewColumnParams>,
) => {
  return put<TableViewData>('/sdr/table/view/properties', params);
};

export const _updateTableViewColumns = (
  params: UpdateTableViewColumnsParams,
) => {
  return put<TableViewData>('/sdr/table/view/properties/batch', params);
};

/** @deprecated */
export const _updateTableColumns = (
  params: Partial<UpdateTableMetaColumnParams>[],
) => {
  return patch('/sdr/table/field/batch', params);
};

export const _createTableColumn = (params: {
  tableId: string;
  viewId: string;
  fieldType: TableColumnTypeEnum;
  beforeFieldId?: string; // Insert before this field
  afterFieldId?: string; // Insert after this field
}) => {
  // API v2 returns the created column directly
  return post<AddColumnApiData>('/sdr/table/field/v2', params);
};

export const _deleteTableColumn = (fieldId: string) => {
  return del(`/sdr/table/field/${fieldId}`);
};

export const _reorderTableColumn = (params: {
  tableId: string;
  currentFieldId: string;
  beforeFieldId?: string;
  afterFieldId?: string;
}) => {
  return put('/sdr/table/field/reorder', params);
};
