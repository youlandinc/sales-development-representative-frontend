import { create } from 'zustand';

import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import { TableHeaderProps } from '@/types/Prospect/table';

import { _fetchTableColumn, _fetchTableRowIds } from '@/request';

export type ProspectTableState = {
  headers: TableHeaderProps[];
  rowIds: string[];
};

export type ProspectTableActions = {
  fetchHeaders: (tableId: string) => Promise<void>;
  fetchRowIds: (tableId: string) => Promise<void>;
  resetTable: () => void;
};

export type ProspectTableStoreProps = ProspectTableState & ProspectTableActions;

export const useProspectTableStore = create<ProspectTableStoreProps>()(
  (set) => ({
    headers: [],
    rowIds: [],
    fetchHeaders: async (tableId) => {
      if (!tableId) {
        return;
      }
      try {
        const {
          data: { fields },
        } = await _fetchTableColumn(tableId);
        set({ headers: fields });
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
    resetTable: () => {
      set({ headers: [], rowIds: [] });
    },
  }),
);
