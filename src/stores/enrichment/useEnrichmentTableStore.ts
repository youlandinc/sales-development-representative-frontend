import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';

import { ColumnFieldGroupMap, HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import {
  TableColumnMenuActionEnum,
  TableColumnProps,
  TableColumnTypeEnum,
  TableViewData,
} from '@/types/enrichment/table';

import {
  _createTableColumn,
  _deleteTableColumn,
  _fetchTable,
  _fetchTableRowIds,
  _renameEnrichmentTable,
  _reorderTableColumn,
  _updateTableCellValue,
  _updateTableColumn,
  _updateTableColumns,
} from '@/request';
import { UTypeOf } from '@/utils';

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
  // dialog
  dialogVisible: boolean;
  dialogType: TableColumnMenuActionEnum | null;
  drawersType: TableColumnMenuActionEnum[];

  tableName: string;
  columns: TableColumnProps[];
  activeColumnId: string;
  views: TableViewData[];
  activeViewId: string;

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
  fetchRowIds: (tableId: string, viewId?: string) => Promise<void>;
  setRowIds: (rowIds: string[]) => void;
  // helper
  setActiveColumnId: (columnId: string) => void;
  openDialog: (type: EnrichmentTableState['dialogType']) => void;
  closeDialog: () => void;
  // table
  renameTable: (tableId: string, name: string) => Promise<void>;
  // table header
  // Single operation
  addColumn: (params: {
    tableId: string;
    fieldType: TableColumnTypeEnum;
    beforeFieldId?: string;
    afterFieldId?: string;
    fieldName?: string;
  }) => Promise<TableColumnProps | null>;
  updateColumnOrder: (params: {
    tableId: string;
    currentFieldId: string;
    beforeFieldId?: string;
    afterFieldId?: string;
  }) => Promise<void>;
  updateColumnName: (newName: string) => Promise<void>;
  updateColumnNameAndType: (params: {
    fieldName: string;
    fieldType: TableColumnTypeEnum;
  }) => Promise<void>;
  updateColumnPin: (pin: boolean) => Promise<void>;
  updateColumnWidth: (fieldId: string, width: number) => Promise<void>;
  // Multiple operation
  updateColumnVisible: (fieldId: string, visible: boolean) => Promise<void>;
  updateColumnsVisible: (
    updates: { fieldId: string; visible: boolean }[],
  ) => Promise<void>;
  updateColumnDescription: (description: string) => Promise<void>;
  updateColumnType: (fieldType: TableColumnTypeEnum) => Promise<void>;
  deleteColumn: () => Promise<void>;
  // table cell
  updateCellValue: (data: {
    tableId: string;
    recordId: string;
    fieldId: string;
    value: string;
  }) => Promise<any>;
  resetTable: () => void;
  getColumnById: (fieldId: string) => TableColumnProps | undefined;
};

export type EnrichmentTableStoreProps = EnrichmentTableState &
  EnrichmentTableActions;

export const useEnrichmentTableStore = create<EnrichmentTableStoreProps>()(
  (set, get) => ({
    dialogVisible: false,
    dialogType: null,
    drawersType: [
      TableColumnMenuActionEnum.actions_overview,
      TableColumnMenuActionEnum.edit_column,
      TableColumnMenuActionEnum.cell_detail,
      TableColumnMenuActionEnum.work_email,
      TableColumnMenuActionEnum.ai_agent,
    ],
    views: [],
    activeViewId: '',
    tableName: '',
    columns: [],
    activeColumnId: '',
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
          data: { fields, tableName, runRecords, fieldGroupMap, views },
        } = await _fetchTable(tableId);
        result = runRecords;
        const defaultView = (views ?? []).find((view) => view.isDefaultOpen);
        set({
          columns: fields,
          tableName,
          runRecords: runRecords ?? null,
          fieldGroupMap,
          views: views ?? [],
          activeViewId: defaultView?.viewId ?? '',
        });
        return { runRecords: result, fields };
      } catch (err) {
        handleApiError<EnrichmentTableState>(err);
        return { runRecords: result, fields: [] };
      }
    },
    fetchRowIds: async (tableId, viewId) => {
      if (!tableId) {
        return;
      }
      const { views, activeViewId } = get();
      // Use passed viewId, or activeViewId from store, or find default
      const targetViewId = viewId || activeViewId;
      const targetView = targetViewId
        ? views.find((view) => view.viewId === targetViewId)
        : views.find((view) => view.isDefaultOpen);
      if (!targetView) {
        return;
      }
      try {
        const { data } = await _fetchTableRowIds({
          tableId,
          viewId: targetView.viewId,
          filters: targetView.filters ?? undefined,
        });
        set({ rowIds: data, activeViewId: targetView.viewId });
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
    getColumnById: (fieldId) => {
      const columns = get().columns;
      return columns.find((col) => col.fieldId === fieldId);
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
        await _updateTableColumn({ fieldId, width });
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
        await _updateTableColumn({ fieldId, fieldName: trimmedName });
      } catch (err) {
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    updateColumnVisible: async (fieldId, visible) => {
      if (!fieldId || UTypeOf.isUndefined(visible)) {
        return;
      }
      const columns = get().columns;
      const updatedColumns = columns.map((col) =>
        col.fieldId === fieldId ? { ...col, visible } : col,
      );

      set({ columns: updatedColumns });

      try {
        await _updateTableColumn({ fieldId, visible });
      } catch (err) {
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    updateColumnsVisible: async (updates) => {
      if (!updates.length) {
        return;
      }
      const columns = get().columns;
      const updateMap = new Map(updates.map((u) => [u.fieldId, u.visible]));
      const updatedColumns = columns.map((col) =>
        updateMap.has(col.fieldId)
          ? { ...col, visible: updateMap.get(col.fieldId)! }
          : col,
      );

      set({ columns: updatedColumns });

      try {
        await _updateTableColumns(updates);
      } catch (err) {
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    updateColumnPin: async (pin) => {
      const { fieldId, columns, column } = getActiveColumn(get);

      if (!fieldId || !column || UTypeOf.isUndefined(pin)) {
        return;
      }

      const updatedColumns = columns.map((col) =>
        col.fieldId === fieldId ? { ...col, pin } : col,
      );
      set({
        columns: updatedColumns,
      });

      try {
        await _updateTableColumn({ fieldId, pin });
      } catch (err) {
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    updateColumnDescription: async (description) => {
      const { fieldId, columns, column } = getActiveColumn(get);

      const trimmedDescription = description.trim();
      if (!fieldId || !column || UTypeOf.isUndefined(trimmedDescription)) {
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
        await _updateTableColumn({
          fieldId,
          description: trimmedDescription,
        });
      } catch (err) {
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    updateColumnType: async (fieldType) => {
      const { fieldId, columns, column } = getActiveColumn(get);

      if (!fieldId || !column || !fieldType) {
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
        await _updateTableColumn({
          fieldId,
          fieldType,
        });
      } catch (err) {
        handleApiError<EnrichmentTableState>(err, { columns }, set);
      }
    },
    updateColumnNameAndType: async (params) => {
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
        await _updateTableColumn({
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
      const { currentFieldId, beforeFieldId, afterFieldId } = params;

      const columns = get().columns;
      const currentIndex = columns.findIndex(
        (col) => col.fieldId === currentFieldId,
      );

      if (currentIndex === -1) {
        return;
      }

      // API semantics:
      // - afterFieldId = X means X will be AFTER the moved item (insert at X's position)
      // - beforeFieldId = X means X will be BEFORE the moved item (insert after X)
      let newIndex: number;

      if (afterFieldId) {
        const afterIndex = columns.findIndex(
          (col) => col.fieldId === afterFieldId,
        );
        if (afterIndex === -1) {
          return;
        }
        // Insert at afterFieldId's position (it will move after)
        newIndex = afterIndex;
      } else if (beforeFieldId) {
        const beforeIndex = columns.findIndex(
          (col) => col.fieldId === beforeFieldId,
        );
        if (beforeIndex === -1) {
          return;
        }
        // Insert after beforeFieldId
        newIndex = beforeIndex + 1;
      } else {
        return;
      }

      // Adjust newIndex if moving from before to after
      if (currentIndex < newIndex) {
        newIndex -= 1;
      }

      const oldColumns = columns;
      const newColumns = arrayMove(columns, currentIndex, newIndex);
      set({ columns: newColumns });

      try {
        await _reorderTableColumn(params);
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
        views: [],
        activeViewId: '',
      });
    },
  }),
);
