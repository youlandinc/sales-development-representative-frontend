import { create } from 'zustand';

import { _getAllColumns } from '@/request';
import { ColumnItem, ContactsTableTypeEnum, HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';

type DirectoryStoresStates = {
  keyword?: string;
  page: number;
  size: number;
  totalRecords: number;
  tableId?: number;
  loading?: boolean;
  tableLabel: string;
  tableName: string;
  metadataColumns: ColumnItem[];
  columnsFilterByActive: ColumnItem[];
  matchColumnOptions: {
    value: number | string;
    label: string;
    key: number | string;
  }[];
  columnOptions: TOption[];
};

type DirectoryStoresActions = {
  setTotalRecords: (total: number) => void;
  fetchAllColumns: (tableId: ContactsTableTypeEnum) => Promise<void>;
  setColumn: (data: ColumnItem[]) => void;
  setKeyword: (keyword: string) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
};

export const useGridStore = create<
  DirectoryStoresStates & DirectoryStoresActions
>((set) => ({
  totalRecords: 0,
  tableId: undefined,
  tableLabel: '',
  tableName: '',
  keyword: '',
  page: 0,
  size: 100,

  loading: false,
  metadataColumns: [],
  columnsFilterByActive: [],
  matchColumnOptions: [],
  columnOptions: [],

  setColumn: (data) => {
    set({
      metadataColumns: data,
      columnsFilterByActive: data.filter(
        (item) => item.active && item.columnName !== 'id',
      ),
    });
  },
  fetchAllColumns: async (tableId: ContactsTableTypeEnum) => {
    try {
      set({ loading: true });
      const { data } = await _getAllColumns(tableId);

      const metadataColumns = data.metadataColumns.filter(
        (item) => item.columnName !== 'id',
      );

      const columnsFilterByActive = metadataColumns.filter(
        (item) => item.active,
      );

      const matchColumnOptions = data.metadataColumns.map((column) => ({
        value: column.columnId,
        label: column.columnLabel,
        key: column.columnId,
      }));

      const columnOptions = data.metadataColumns.map(
        (column) =>
          ({
            value: column.columnName,
            label: column.columnLabel,
            key: column.columnId,
          }) as TOption,
      );

      set({
        metadataColumns,
        columnsFilterByActive,
        matchColumnOptions,
        columnOptions,
        tableLabel: data.tableLabel,
        tableName: data.tableName,
        tableId: data.tableId,
        loading: false,
        size: data.pageSize || 100,
      });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
  setTotalRecords: (total) => {
    set({ totalRecords: total });
  },
  setKeyword: (keyword) => set({ keyword, page: 0 }),
  setPage: (page) => set({ page }),
  setSize: (size) => set({ size }),
}));
