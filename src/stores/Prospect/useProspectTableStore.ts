import { create } from 'zustand';

import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import { TableHeaderProps } from '@/types/Prospect/table';

import {
  _fetchTableColumn,
  _fetchTableRowIds,
  _updateTableCellValue,
  _updateTableColumnConfig,
} from '@/request';

export type ProspectTableState = {
  tableName: string;
  headers: TableHeaderProps[];
  rowIds: string[];
};

export type ProspectTableActions = {
  fetchHeaders: (tableId: string) => Promise<void>;
  fetchRowIds: (tableId: string) => Promise<void>;
  updateColumnWidth: (data: {
    fieldId: string;
    width: number;
  }) => Promise<void>;
  updateCellValue: (data: {
    tableId: string;
    recordId: string;
    fieldId: string;
    value: string;
  }) => Promise<void>;
  resetTable: () => void;
};

export type ProspectTableStoreProps = ProspectTableState & ProspectTableActions;

export const useProspectTableStore = create<ProspectTableStoreProps>()(
  (set, get) => ({
    tableName: '',
    headers: [],
    rowIds: [],
    fetchHeaders: async (tableId) => {
      if (!tableId) {
        return;
      }
      try {
        const {
          data: { fields, tableName },
        } = await _fetchTableColumn(tableId);
        set({ headers: fields, tableName });
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    fetchRowIds: async (tableId) => {
      if (!tableId) {
        return;
      }
      try {
        const { data } = await _fetchTableRowIds(tableId);
        set({ rowIds: data });
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    updateColumnWidth: async ({
      fieldId,
      width,
    }: {
      fieldId: string;
      width: number;
    }) => {
      if (!fieldId || !width) {
        return;
      }
      const target = get().headers.find((item) => item.fieldId === fieldId);
      if (!target) {
        return;
      }
      target.width = width;
      try {
        await _updateTableColumnConfig({ fieldId, width });
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    updateCellValue: async (data) => {
      try {
        await _updateTableCellValue(data);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    resetTable: () => {
      set({ headers: [], rowIds: [] });
    },
  }),
);
