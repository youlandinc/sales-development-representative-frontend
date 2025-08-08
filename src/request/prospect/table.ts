import { get, post } from '@/request/request';
import { TableHeaderProps } from '@/types/Prospect/table';

export const _fetchTableColumn = (tableId: string) => {
  return get<{ fields: TableHeaderProps[] }>(`/sdr/prospect/table/${tableId}`);
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
