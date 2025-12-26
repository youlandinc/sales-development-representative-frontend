import { create } from 'zustand';

import { ColumnFieldGroupMap, HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import {
  TableColumnMenuActionEnum,
  TableColumnProps,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

import {
  _createTableColumn,
  _deleteTableColumn,
  _fetchTable,
  _fetchTableRowIds,
  _renameEnrichmentTable,
  _updateTableCellValue,
  _updateTableColumnConfig,
  _updateTableColumnSort,
} from '@/request';
import { UNotUndefined } from '@/utils';

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

/**
 * Helper function to get active column info from store
 *
 * Note: This is only used by methods that operate on the currently active column
 * (e.g., updateColumnName, updateColumnPin, deleteColumn).
 *
 * Methods like updateColumnWidth and updateColumnVisible receive fieldId as a parameter
 * because they may need to update any column, not just the active one.
 */
type GetActiveColumnResult = {
  fieldId: string;
  columns: TableColumnProps[];
  column: TableColumnProps | undefined;
};

const getActiveColumn = (
  get: () => EnrichmentTableStoreProps,
): GetActiveColumnResult => {
  const { activeColumnId, columns } = get();
  return {
    fieldId: activeColumnId,
    columns,
    column: columns.find((col) => col.fieldId === activeColumnId),
  };
};

export type EnrichmentTableState = {
  tableName: string;
  columns: TableColumnProps[];
  activeColumnId: string;
  // dialog
  dialogVisible: boolean;
  dialogType: TableColumnMenuActionEnum | null;
  drawersType: TableColumnMenuActionEnum[];

  rowIds: string[];
  runRecords: {
    [key: string]: { recordIds: string[]; isAll: boolean };
  } | null;

  fieldGroupMap: ColumnFieldGroupMap | null;
};

export type EnrichmentTableActions = {
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
  openDialog: (type: EnrichmentTableState['dialogType']) => void;
  closeDialog: () => void;
  // table
  renameTable: (tableId: string, name: string) => Promise<void>;
  // table header
  updateColumnWidth: (fieldId: string, width: number) => Promise<void>;
  updateColumnName: (newName: string) => Promise<void>;
  updateColumnVisible: (fieldId: string, visible: boolean) => Promise<void>;
  updateColumnPin: (pin: boolean) => Promise<void>;
  updateColumnDescription: (description: string) => Promise<void>;
  updateColumnType: (fieldType: TableColumnTypeEnum) => Promise<void>;
  updateColumnFieldName: (params: {
    fieldName: string;
    fieldType: TableColumnTypeEnum;
  }) => Promise<void>;
  deleteColumn: () => Promise<void>;
  updateColumnOrder: (params: {
    tableId: string;
    currentFieldId: string;
    beforeFieldId?: string;
    afterFieldId?: string;
  }) => Promise<void>;
  addColumn: (params: {
    tableId: string;
    fieldType: TableColumnTypeEnum;
    beforeFieldId?: string;
    afterFieldId?: string;
    fieldName?: string;
  }) => Promise<TableColumnProps | null>;
  // table cell
  updateCellValue: (data: {
    tableId: string;
    recordId: string;
    fieldId: string;
    value: string;
  }) => Promise<any>;
  resetTable: () => void;
};

export type EnrichmentTableStoreProps = EnrichmentTableState &
  EnrichmentTableActions;

export const useEnrichmentTableStore = create<EnrichmentTableStoreProps>()(
  (set, get) => ({
    tableName: '',
    columns: [],
    activeColumnId: '',
    dialogVisible: false,
    dialogType: null,
    drawersType: [
      TableColumnMenuActionEnum.actions_overview,
      TableColumnMenuActionEnum.edit_column,
      TableColumnMenuActionEnum.cell_detail,
      TableColumnMenuActionEnum.work_email,
      TableColumnMenuActionEnum.ai_agent,
    ],
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
        handleApiError<EnrichmentTableState>(err);
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
        handleApiError<EnrichmentTableState>(err);
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
        await _renameEnrichmentTable({ tableName: name, tableId });
      } catch (err) {
        handleApiError<EnrichmentTableState>(err, { tableName }, set);
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
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    updateColumnName: async (newName) => {
      const { fieldId, columns, column } = getActiveColumn(get);

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
        handleApiError<EnrichmentTableState>(err, { columns }, set);
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
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    updateColumnPin: async (pin) => {
      const { fieldId, columns, column } = getActiveColumn(get);

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
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    updateColumnDescription: async (description) => {
      const { fieldId, columns, column } = getActiveColumn(get);

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
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    updateColumnType: async (fieldType) => {
      const { fieldId, columns, column } = getActiveColumn(get);

      if (!fieldId || !column || !UNotUndefined(fieldType)) {
        return;
      }

      // Don't update if it's the same type
      if (column.fieldType === fieldType) {
        return;
      }

      const updatedColumns = columns.map((col) =>
        col.fieldId === fieldId ? { ...col, fieldType } : col,
      );
      set({
        columns: updatedColumns,
      });

      try {
        await _updateTableColumnConfig({
          fieldId,
          fieldType,
        });
      } catch (err) {
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    updateColumnFieldName: async (params) => {
      const { fieldId, columns, column } = getActiveColumn(get);

      const trimmedFieldName = params.fieldName.trim();
      if (!fieldId || !column || !trimmedFieldName || !params.fieldType) {
        return;
      }

      const updatedColumns = columns.map((col) =>
        col.fieldId === fieldId
          ? { ...col, fieldName: trimmedFieldName, fieldType: params.fieldType }
          : col,
      );
      set({
        columns: updatedColumns,
      });

      try {
        await _updateTableColumnConfig({
          fieldId,
          fieldName: trimmedFieldName,
          fieldType: params.fieldType,
        });
      } catch (err) {
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    deleteColumn: async () => {
      const { fieldId, columns, column } = getActiveColumn(get);

      if (!fieldId || !column) {
        return;
      }

      // Optimistic update
      const updatedColumns = columns.filter((col) => col.fieldId !== fieldId);
      set({ columns: updatedColumns });
      get().closeDialog();

      try {
        await _deleteTableColumn(fieldId);
      } catch (err) {
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    addColumn: async (params) => {
      try {
        const { data: newColumn } = await _createTableColumn(params);
        if (!newColumn) {
          return null;
        }

        const columns = get().columns;
        const { beforeFieldId, afterFieldId } = params;

        let newColumns: TableColumnProps[];
        if (beforeFieldId) {
          const index = columns.findIndex(
            (col) => col.fieldId === beforeFieldId,
          );
          if (index >= 0) {
            newColumns = [
              ...columns.slice(0, index),
              newColumn,
              ...columns.slice(index),
            ];
          } else {
            newColumns = [...columns, newColumn];
          }
        } else if (afterFieldId) {
          const index = columns.findIndex(
            (col) => col.fieldId === afterFieldId,
          );
          if (index >= 0) {
            newColumns = [
              ...columns.slice(0, index + 1),
              newColumn,
              ...columns.slice(index + 1),
            ];
          } else {
            newColumns = [...columns, newColumn];
          }
        } else {
          newColumns = [...columns, newColumn];
        }

        set({ columns: newColumns });
        return newColumn;
      } catch (err) {
        handleApiError<EnrichmentTableState>(err);
        return null;
      }
    },
    updateColumnOrder: async (params) => {
      const originalParams = params;

      const { currentFieldId, beforeFieldId, afterFieldId } = params;
      const targetFieldId = beforeFieldId ?? afterFieldId;

      if (!targetFieldId || targetFieldId === currentFieldId) {
        return;
      }

      const columns = get().columns;

      const currentIndex = columns.findIndex(
        (col) => col.fieldId === currentFieldId,
      );
      const targetIndex = columns.findIndex(
        (col) => col.fieldId === targetFieldId,
      );

      if (currentIndex === -1 || targetIndex === -1) {
        return;
      }

      const currentColumn = columns[currentIndex];
      const withoutCurrent = columns.filter(
        (col) => col.fieldId !== currentFieldId,
      );

      const targetIndexWithout = withoutCurrent.findIndex(
        (col) => col.fieldId === targetFieldId,
      );
      if (targetIndexWithout === -1) {
        return;
      }

      // ✅ 核心：方向决定插入位置
      // 往右拖（currentIndex < targetIndex）=> 插到 target 后面
      // 往左拖（currentIndex > targetIndex）=> 插到 target 前面
      const insertIndex =
        currentIndex < targetIndex
          ? targetIndexWithout + 1
          : targetIndexWithout;

      const newColumns: TableColumnProps[] = [
        ...withoutCurrent.slice(0, insertIndex),
        currentColumn,
        ...withoutCurrent.slice(insertIndex),
      ];

      const oldColumns = columns;
      set({ columns: newColumns });

      try {
        await _updateTableColumnSort(originalParams);
      } catch (err) {
        set({ columns: oldColumns });
        handleApiError(err, { columns: oldColumns }, set);
        throw err;
      }
    },
    // table cell
    updateCellValue: async (data) => {
      try {
        return await _updateTableCellValue(data);
      } catch (err) {
        handleApiError<EnrichmentTableState>(err);
        throw err;
      }
    },
    resetTable: () => {
      set({
        tableName: '',
        columns: [],
        activeColumnId: '',
        dialogVisible: false,
        dialogType: null,
        rowIds: [],
        runRecords: null,
        fieldGroupMap: null,
      });
    },
  }),
);
