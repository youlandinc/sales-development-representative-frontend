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
} from '@/request';

import {
  createTableFieldMetaSlice,
  createTableViewConfigSlice,
  TableFieldMetaSlice,
  TableViewConfigSlice,
} from './slices';

const onApiError = <T extends Record<string, any>>(
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

// ============================================================================
// Core Store Types (non-slice state)
// ============================================================================

export type EnrichmentTableCoreState = {
  // Dialog
  dialogVisible: boolean;
  dialogType: TableColumnMenuActionEnum | null;
  drawersType: TableColumnMenuActionEnum[];
  // Table
  tableId: string;
  tableName: string;
  // Rows
  rowIds: string[];
  runRecords: {
    [key: string]: { recordIds: string[]; isAll: boolean };
  } | null;
  fieldGroupMap: ColumnFieldGroupMap | null;
};

export type EnrichmentTableCoreActions = {
  fetchTable: (tableId: string) => Promise<{
    runRecords: {
      [key: string]: { recordIds: string[]; isAll: boolean };
    } | null;
    metaColumns: TableColumnProps[];
  }>;
  fetchRowIds: (tableId: string, viewId?: string) => Promise<void>;
  setRowIds: (rowIds: string[]) => void;
  // Dialog
  openDialog: (type: EnrichmentTableCoreState['dialogType']) => void;
  closeDialog: () => void;
  // Table
  renameTable: (tableId: string, name: string) => Promise<void>;
  // Column CRUD (non-meta operations)
  addColumn: (params: {
    tableId: string;
    fieldType: TableColumnTypeEnum;
    beforeFieldId?: string;
    afterFieldId?: string;
    fieldName?: string;
  }) => Promise<TableColumnProps | null>;
  deleteColumn: () => Promise<void>;
  updateColumnOrder: (params: {
    tableId: string;
    currentFieldId: string;
    beforeFieldId?: string;
    afterFieldId?: string;
  }) => Promise<void>;
  // Cell
  updateCellValue: (data: {
    tableId: string;
    recordId: string;
    fieldId: string;
    value: string;
  }) => Promise<any>;
  resetTable: () => void;
};

export type EnrichmentTableCoreSlice = EnrichmentTableCoreState &
  EnrichmentTableCoreActions;

// ============================================================================
// Combined Store Type
// ============================================================================

export type EnrichmentTableStoreProps = EnrichmentTableCoreSlice &
  TableFieldMetaSlice &
  TableViewConfigSlice;

// Legacy aliases for backward compatibility
export type EnrichmentTableState = EnrichmentTableStoreProps;
export type EnrichmentTableActions = EnrichmentTableStoreProps;

// ============================================================================
// Store Implementation
// ============================================================================

export const useEnrichmentTableStore = create<EnrichmentTableStoreProps>()(
  (set, get, api) => ({
    // Combine slices
    ...createTableFieldMetaSlice(set, get, api),
    ...createTableViewConfigSlice(set, get, api),

    // Core state
    dialogVisible: false,
    dialogType: null,
    drawersType: [
      TableColumnMenuActionEnum.actions_overview,
      TableColumnMenuActionEnum.edit_column,
      TableColumnMenuActionEnum.cell_detail,
      TableColumnMenuActionEnum.work_email,
      TableColumnMenuActionEnum.ai_agent,
    ],
    tableId: '',
    tableName: '',
    rowIds: [],
    runRecords: null,
    fieldGroupMap: null,

    // Core actions
    fetchTable: async (tableId) => {
      let result = null;
      if (!tableId) {
        return { runRecords: result, metaColumns: [] };
      }

      try {
        const {
          data: { fields, tableName, runRecords, fieldGroupMap, views },
        } = await _fetchTable(tableId);
        result = runRecords;
        const defaultView = (views ?? []).find(
          (view: TableViewData) => view.isDefaultOpen,
        );
        set({
          tableId,
          metaColumns: fields,
          tableName,
          runRecords: runRecords ?? null,
          fieldGroupMap,
          views: views ?? [],
          activeViewId: defaultView?.viewId ?? '',
        });
        return { runRecords: result, metaColumns: fields };
      } catch (err) {
        onApiError<EnrichmentTableCoreState>(err);
        return { runRecords: result, metaColumns: [] };
      }
    },

    fetchRowIds: async (tableId, viewId) => {
      if (!tableId) {
        return;
      }
      const { views, activeViewId } = get();
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
        onApiError<EnrichmentTableCoreState>(err);
      }
    },

    setRowIds: (rowIds) => {
      set({ rowIds });
    },

    openDialog: (type) => {
      set({ dialogVisible: true, dialogType: type });
    },

    closeDialog: () => {
      set({ dialogVisible: false, dialogType: null });
    },

    renameTable: async (tableId, name) => {
      if (!tableId || !name) {
        return;
      }
      const tableName = get().tableName;
      try {
        await _renameEnrichmentTable({ tableName: name, tableId });
      } catch (err) {
        onApiError<EnrichmentTableCoreState>(err, { tableName }, set);
      }
    },

    addColumn: async (params) => {
      try {
        const { data: newColumn } = await _createTableColumn(params);
        if (!newColumn) {
          return null;
        }

        const metaColumns = get().metaColumns;
        const { beforeFieldId, afterFieldId } = params;

        let newMetaColumns: TableColumnProps[];
        if (beforeFieldId) {
          const index = metaColumns.findIndex(
            (col) => col.fieldId === beforeFieldId,
          );
          if (index >= 0) {
            newMetaColumns = [
              ...metaColumns.slice(0, index),
              newColumn,
              ...metaColumns.slice(index),
            ];
          } else {
            newMetaColumns = [...metaColumns, newColumn];
          }
        } else if (afterFieldId) {
          const index = metaColumns.findIndex(
            (col) => col.fieldId === afterFieldId,
          );
          if (index >= 0) {
            newMetaColumns = [
              ...metaColumns.slice(0, index + 1),
              newColumn,
              ...metaColumns.slice(index + 1),
            ];
          } else {
            newMetaColumns = [...metaColumns, newColumn];
          }
        } else {
          newMetaColumns = [...metaColumns, newColumn];
        }

        set({ metaColumns: newMetaColumns });
        return newColumn;
      } catch (err) {
        onApiError<EnrichmentTableCoreState>(err);
        return null;
      }
    },

    deleteColumn: async () => {
      const { activeColumnId, metaColumns } = get();
      const metaColumn = metaColumns.find(
        (col) => col.fieldId === activeColumnId,
      );

      if (!activeColumnId || !metaColumn) {
        return;
      }

      const updatedMetaColumns = metaColumns.filter(
        (col) => col.fieldId !== activeColumnId,
      );
      set({ metaColumns: updatedMetaColumns });
      get().closeDialog();

      try {
        await _deleteTableColumn(activeColumnId);
      } catch (err) {
        onApiError<EnrichmentTableCoreState>(err);
        set({ metaColumns });
      }
    },

    updateColumnOrder: async (params) => {
      const { currentFieldId, beforeFieldId, afterFieldId } = params;
      const metaColumns = get().metaColumns;
      const currentIndex = metaColumns.findIndex(
        (col) => col.fieldId === currentFieldId,
      );

      if (currentIndex === -1) {
        return;
      }

      let newIndex: number;
      if (afterFieldId) {
        const afterIndex = metaColumns.findIndex(
          (col) => col.fieldId === afterFieldId,
        );
        if (afterIndex === -1) {
          return;
        }
        newIndex = afterIndex;
      } else if (beforeFieldId) {
        const beforeIndex = metaColumns.findIndex(
          (col) => col.fieldId === beforeFieldId,
        );
        if (beforeIndex === -1) {
          return;
        }
        newIndex = beforeIndex + 1;
      } else {
        return;
      }

      if (currentIndex < newIndex) {
        newIndex -= 1;
      }

      const oldMetaColumns = metaColumns;
      const newMetaColumns = arrayMove(metaColumns, currentIndex, newIndex);
      set({ metaColumns: newMetaColumns });

      try {
        await _reorderTableColumn(params);
      } catch (err) {
        set({ metaColumns: oldMetaColumns });
        onApiError(err);
        throw err;
      }
    },

    updateCellValue: async (data) => {
      try {
        return await _updateTableCellValue(data);
      } catch (err) {
        onApiError<EnrichmentTableCoreState>(err);
        throw err;
      }
    },

    resetTable: () => {
      set({
        tableId: '',
        tableName: '',
        metaColumns: [],
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
