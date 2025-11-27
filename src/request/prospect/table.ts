import { del, get, patch, post } from '@/request/request';
import { ColumnFieldGroupMap, ResponseProspectTableViaSearch } from '@/types';
import {
  TableCellProps,
  TableColumnProps,
  TableColumnTypeEnum,
  UpdateTableColumnConfigParams,
} from '@/types/Prospect/table';

export const _fetchTable = (tableId: string) => {
  return get<{
    fields: TableColumnProps[];
    tableName: string;
    runRecords: {
      [key: string]: { recordIds: string[]; isAll: boolean };
    };
    fieldGroupMap: ColumnFieldGroupMap;
  }>(`/sdr/table/${tableId}`);
};

export const _fetchTableRowIds = (tableId: string) => {
  return get(`/sdr/table/data/${tableId}/ids`);
};

export const _fetchTableRowData = (params: {
  tableId: string;
  recordIds: string[];
}) => {
  return post<TableCellProps[]>(`/sdr/table/data/${params.tableId}`, {
    recordIds: params.recordIds,
  });
};

export const _updateTableColumnConfig = (
  params: Partial<UpdateTableColumnConfigParams>,
) => {
  return patch('/sdr/table/field', params);
};

export const _deleteTableColumn = (fieldId: string) => {
  return del(`/sdr/table/field/${fieldId}`);
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

export const _createTableColumn = (params: {
  tableId: string;
  fieldType: TableColumnTypeEnum;
  beforeFieldId?: string; // Insert before this field
  afterFieldId?: string; // Insert after this field
  // If neither beforeFieldId nor afterFieldId provided, insert at end
  //actionKey?: string;
  //groupId?: string;
  //isExtractedField?: boolean;
  //dependentFieldId?: string;
  //typeSettings?: {
  //  inputBinding?: Array<{
  //    name: string;
  //    optional?: boolean;
  //    formulaText?: string;
  //  }>;
  //  optionalPathsInInputs?: Record<string, any>;
  //};
  //actionDefinition?: any;
}) => {
  // API v2 returns the created column directly
  return post<TableColumnProps>('/sdr/table/field/v2', params);
};
