import { create } from 'zustand';

import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import { TableColumnProps } from '@/types/Prospect/table';

import {
  _deleteTableColumn,
  _fetchTable,
  _fetchTableRowIds,
  _renameProspectTable,
  _updateTableCellValue,
  _updateTableColumnConfig,
} from '@/request';
import { UNotUndefined } from '@/utils';
import { TableColumnMenuEnum } from '@/components/molecules';

const handleApiError = <T extends Record<string, any>>(
  err: unknown,
  rollbackState?: Partial<T>,
  set?: (state: Partial<T>) => void,
) => {
  if (rollbackState && set) {
    set(rollbackState);
  }
  const { message, header, variant } = err as HttpError;
  SDRToast({ message, header, variant });
};

export type ProspectTableState = {
  tableName: string;
  columns: TableColumnProps[];
  columnDeleting: boolean;
  activeColumnId: string;
  // dialog
  dialogVisible: boolean;
  dialogType:
    | TableColumnMenuEnum.edit_description
    | TableColumnMenuEnum.delete
    | null;

  rowIds: string[];
  runRecords: {
    [key: string]: { recordIds: string[]; isAll: boolean };
  } | null;
};

export type ProspectTableActions = {
  fetchTable: (tableId: string) => Promise<void>;
  fetchRowIds: (tableId: string) => Promise<void>;
  // helper
  setActiveColumnId: (columnId: string) => void;
  openDialog: (state: boolean, type: ProspectTableState['dialogType']) => void;
  resetDialog: () => void;
  // table
  renameTable: (tableId: string, name: string) => Promise<void>;
  // table header
  updateColumnWidth: (fieldId: string, width: number) => Promise<void>;
  updateColumnName: (fieldId: string, newName: string) => Promise<void>;
  updateColumnVisible: (fieldId: string, visible: boolean) => Promise<void>;
  updateColumnPin: (fieldId: string, pin: boolean) => Promise<void>;
  deleteColumn: (fieldId: string, cb?: () => void) => Promise<void>;
  // table cell
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
    columns: [],
    activeColumnId: '',
    dialogVisible: false,
    dialogType: null,
    rowIds: [],
    runRecords: null,
    columnDeleting: false,
    fetchTable: async (tableId) => {
      if (!tableId) {
        return;
      }
      try {
        const {
          data: { fields, tableName, runRecords },
        } = await _fetchTable(tableId);
        set({
          columns: fields,
          tableName,
          runRecords: runRecords ?? null,
        });
      } catch (err) {
        handleApiError<ProspectTableState>(err);
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
        handleApiError<ProspectTableState>(err);
      }
    },
    renameTable: async (tableId, name) => {
      if (!tableId || !name) {
        return;
      }
      const tableName = get().tableName;

      try {
        await _renameProspectTable({ tableName: name, tableId });
      } catch (err) {
        handleApiError<ProspectTableState>(err, { tableName }, set);
      }
    },
    setActiveColumnId: (columnId) => {
      set({ activeColumnId: columnId });
    },
    openDialog: (state, type) => {
      set({ dialogVisible: state, dialogType: type });
    },
    resetDialog: () => {
      set({ dialogVisible: false, dialogType: null });
    },
    // table header
    updateColumnWidth: async (fieldId: string, width: number) => {
      if (!fieldId || !width) {
        return;
      }
      const columns = get().columns;
      const updatedColumns = columns.map((col) =>
        col.fieldId === fieldId ? { ...col, width } : col,
      );
      set({ columns: updatedColumns });

      try {
        await _updateTableColumnConfig({ fieldId, width });
      } catch (err) {
        handleApiError<ProspectTableState>(err, { columns }, set);
      }
    },
    updateColumnName: async (fieldId: string, newName: string) => {
      if (!fieldId || !newName.trim()) {
        return;
      }

      const trimmedName = newName.trim();
      const columns = get().columns;
      const updatedColumns = columns.map((col) =>
        col.fieldId === fieldId ? { ...col, fieldName: trimmedName } : col,
      );
      set({ columns: updatedColumns });

      try {
        await _updateTableColumnConfig({ fieldId, fieldName: trimmedName });
      } catch (err) {
        handleApiError<ProspectTableState>(err, { columns }, set);
      }
    },
    updateColumnVisible: async (fieldId: string, visible: boolean) => {
      if (!fieldId || !UNotUndefined(visible)) {
        return;
      }
      const columns = get().columns;
      const updatedColumns = columns.map((col) =>
        col.fieldId === fieldId ? { ...col, visible } : col,
      );

      set({ columns: updatedColumns });

      //try {
      //  await _updateTableColumnConfig({ fieldId, visible });
      //} catch (err) {
      //  handleApiError<ProspectTableState>(err, { columns }, set);
      //}
    },
    updateColumnPin: async (fieldId: string, pin: boolean) => {
      if (!fieldId || !UNotUndefined(pin)) {
        return;
      }
      const columns = get().columns;
      const updatedColumns = columns.map((col) =>
        col.fieldId === fieldId ? { ...col, pin } : col,
      );
      set({
        columns: updatedColumns,
      });

      try {
        await _updateTableColumnConfig({ fieldId, pin });
      } catch (err) {
        handleApiError<ProspectTableState>(err, { columns }, set);
      }
    },
    deleteColumn: async (fieldId, cb) => {
      if (!fieldId) {
        return;
      }
      const column = get().columns.find((col) => col.fieldId === fieldId);
      if (!column) {
        return;
      }
      const columns = get().columns;
      const updatedColumns = columns.filter((col) => col.fieldId !== fieldId);
      set({ columns: updatedColumns, columnDeleting: true });

      try {
        await _deleteTableColumn(fieldId);
      } catch (err) {
        handleApiError<ProspectTableState>(err, { columns }, set);
      } finally {
        set({ columnDeleting: false });
        cb?.();
      }
    },
    // table cell
    updateCellValue: async (data) => {
      try {
        await _updateTableCellValue(data);
      } catch (err) {
        handleApiError<ProspectTableState>(err);
      }
    },
    resetTable: () => {
      set({ columns: [], rowIds: [], runRecords: null });
    },
  }),
);
