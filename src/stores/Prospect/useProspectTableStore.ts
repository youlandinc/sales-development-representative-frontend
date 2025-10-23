import { create } from 'zustand';

import { ColumnFieldGroupMap, HttpError } from '@/types';
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
  activeColumnId: string;
  // dialog
  dialogVisible: boolean;
  dialogType: TableColumnMenuEnum | null;

  rowIds: string[];
  runRecords: {
    [key: string]: { recordIds: string[]; isAll: boolean };
  } | null;

  fieldGroupMap: ColumnFieldGroupMap | null;
};

export type ProspectTableActions = {
  fetchTable: (tableId: string) => Promise<{
    runRecords: {
      [key: string]: { recordIds: string[]; isAll: boolean };
    } | null;
    fields: TableColumnProps[];
  }>;
  fetchRowIds: (tableId: string) => Promise<void>;
  setRowIds: (rowIds: string[]) => void;
  // helper
  setActiveColumnId: (columnId: string) => void;
  openDialog: (type: ProspectTableState['dialogType']) => void;
  closeDialog: () => void;
  // table
  renameTable: (tableId: string, name: string) => Promise<void>;
  // table header
  updateColumnWidth: (fieldId: string, width: number) => Promise<void>;
  updateColumnName: (newName: string) => Promise<void>;
  updateColumnVisible: (fieldId: string, visible: boolean) => Promise<void>;
  updateColumnPin: (pin: boolean) => Promise<void>;
  updateColumnDescription: (description: string) => Promise<void>;
  deleteColumn: () => Promise<void>;
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
    fieldGroupMap: null,
    fetchTable: async (tableId) => {
      let result = null;
      if (!tableId) {
        return { runRecords: result, fields: [] };
      }

      try {
        const {
          data: { fields, tableName, runRecords, fieldGroupMap },
        } = await _fetchTable(tableId);
        result = runRecords;
        set({
          columns: fields,
          tableName,
          runRecords: runRecords ?? null,
          fieldGroupMap,
        });
        return { runRecords: result, fields };
      } catch (err) {
        handleApiError<ProspectTableState>(err);
        return { runRecords: result, fields: [] };
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
    setRowIds: (rowIds) => {
      set({ rowIds });
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
    openDialog: (type) => {
      set({ dialogVisible: true, dialogType: type });
    },
    closeDialog: () => {
      set({ dialogVisible: false, dialogType: null });
    },
    // table header
    updateColumnWidth: async (fieldId, width) => {
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
    updateColumnName: async (newName) => {
      const fieldId = get().activeColumnId;
      const columns = get().columns;

      const column = get().columns.find((col) => col.fieldId === fieldId);

      const trimmedName = newName.trim();
      if (!fieldId || !column || !trimmedName) {
        return;
      }

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
    updateColumnVisible: async (fieldId, visible) => {
      if (!fieldId || !UNotUndefined(visible)) {
        return;
      }
      const columns = get().columns;
      const updatedColumns = columns.map((col) =>
        col.fieldId === fieldId ? { ...col, visible } : col,
      );

      set({ columns: updatedColumns });

      try {
        await _updateTableColumnConfig({ fieldId, visible });
      } catch (err) {
        handleApiError<ProspectTableState>(err, { columns }, set);
      }
    },
    updateColumnPin: async (pin) => {
      const fieldId = get().activeColumnId;
      const columns = get().columns;

      const column = get().columns.find((col) => col.fieldId === fieldId);

      if (!fieldId || !column || !UNotUndefined(pin)) {
        return;
      }

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
    updateColumnDescription: async (description) => {
      const fieldId = get().activeColumnId;
      const columns = get().columns;

      const column = get().columns.find((col) => col.fieldId === fieldId);

      const trimmedDescription = description.trim();
      if (!fieldId || !column || !UNotUndefined(trimmedDescription)) {
        return;
      }

      const updatedColumns = columns.map((col) =>
        col.fieldId === fieldId
          ? { ...col, description: trimmedDescription }
          : col,
      );
      set({
        columns: updatedColumns,
      });

      try {
        await _updateTableColumnConfig({
          fieldId,
          description: trimmedDescription,
        });
      } catch (err) {
        handleApiError<ProspectTableState>(err, { columns }, set);
      }
    },
    deleteColumn: async () => {
      const fieldId = get().activeColumnId;
      const columns = get().columns;

      const column = get().columns.find((col) => col.fieldId === fieldId);

      if (!fieldId || !column) {
        return;
      }

      try {
        await _deleteTableColumn(fieldId);
        const updatedColumns = columns.filter((col) => col.fieldId !== fieldId);
        get().closeDialog();
        set({ columns: updatedColumns });
      } catch (err) {
        handleApiError<ProspectTableState>(err, { columns }, set);
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
