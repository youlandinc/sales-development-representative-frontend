import { del, post, put } from '@/request/request';
import { ResponseProspectTable } from '@/types/Prospect';

export const _fetchProspectTableData = (params: {
  size: number;
  page: number;
  searchWord?: string;
}) => {
  return post<ResponseProspectTable>('/sdr/prospect/list', params);
};

export const _deleteProspectTableItem = (tableId: string | number) => {
  return del('/sdr/prospect/table', {
    params: {
      tableId,
    },
  });
};

export const _renameProspectTable = (params: {
  tableName: string;
  tableId: string | number;
}) => {
  return put('/sdr/prospect/table', params);
};
