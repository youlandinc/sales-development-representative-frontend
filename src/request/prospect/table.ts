import { get, patch, post } from '@/request/request';
import {
  TableHeaderProps,
  UpdateTableColumnConfigParams,
} from '@/types/Prospect/table';

export const _fetchTableColumn = (tableId: string) => {
  return get<{ fields: TableHeaderProps[]; tableName: string }>(
    `/sdr/prospect/table/${tableId}`,
  );
};

export const _fetchTableRowIds = (tableId: string) => {
  return get(`/sdr/prospect/table/${tableId}/data/ids`);
};

export const _fetchTableRowData = (params: {
  tableId: string;
  recordIds: string[];
}) => {
  return post(`/sdr/prospect/table/${params.tableId}/data`, {
    recordIds: params.recordIds,
  });
};

export const _updateTableColumnConfig = (
  params: Partial<UpdateTableColumnConfigParams>,
) => {
  return patch('/sdr/prospect/table/field', params);
};

export const _updateTableCellValue = (params: {
  tableId: string;
  recordId: string;
  fieldId: string;
  value: any;
}) => {
  return patch(
    `/sdr/prospect/table/${params.tableId}/records/${params.recordId}`,
    {
      fieldId: params.fieldId,
      value: params.value,
    },
  );
};
