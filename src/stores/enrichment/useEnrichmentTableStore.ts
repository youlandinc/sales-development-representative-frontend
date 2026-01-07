import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';

import { ColumnFieldGroupMap, HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import {
  RunRecordItem,
  TableColumnMenuActionEnum,
  TableColumnProps,
  TableColumnTypeEnum,
  TableViewData,
} from '@/types/enrichment/table';

import {
  _createTableColumn,
  _deleteTableColumn,
  _fetchTableDetail,
  _fetchTableRowIds,
  _renameEnrichmentTable,
  _reorderTableViewColumn,
  _updateTableCell,
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
    [key: string]: RunRecordItem;
  } | null;
  fieldGroupMap: ColumnFieldGroupMap | null;
};

export type EnrichmentTableCoreActions = {
  fetchTable: (tableId: string) => Promise<{
    runRecords: {
      [key: string]: RunRecordItem;
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
        } = await _fetchTableDetail(tableId);
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
        const {
          data: { field: newColumn, views: returnedViews },
        } = await _createTableColumn({ ...params, viewId: get().activeViewId });
        if (!newColumn) {
          return null;
        }

        // metaColumns only stores metadata, order is controlled by views.fieldProps
        // Simply append new column to metaColumns
        const metaColumns = get().metaColumns;
        const newMetaColumns = [...metaColumns, newColumn];

        // Replace views with API response (contains correct fieldProps order)
        const storedViews = get().views;
        const activeViewId = get().activeViewId;
        const returnedView = returnedViews?.find(
          (v) => v.viewId === activeViewId,
        );
        const updatedViews = returnedView
          ? storedViews.map((v) =>
              v.viewId === returnedView.viewId ? returnedView : v,
            )
          : storedViews;
        set({ metaColumns: newMetaColumns, views: updatedViews });
        return newColumn;
      } catch (err) {
        onApiError<EnrichmentTableCoreState>(err);
        return null;
      }
    },

    deleteColumn: async () => {
      const { activeColumnId, metaColumns, views } = get();
      const metaColumn = metaColumns.find(
        (col) => col.fieldId === activeColumnId,
      );

      if (!activeColumnId || !metaColumn) {
        return;
      }

      // Remove from metaColumns
      const updatedMetaColumns = metaColumns.filter(
        (col) => col.fieldId !== activeColumnId,
      );

      // Remove from all views' fieldProps
      const updatedViews = views.map((view) => ({
        ...view,
        fieldProps: view.fieldProps.filter(
          (fp) => fp.fieldId !== activeColumnId,
        ),
      }));

      set({ metaColumns: updatedMetaColumns, views: updatedViews });
      get().closeDialog();

      try {
        await _deleteTableColumn({
          tableId: get().tableId,
          fieldId: activeColumnId,
        });
      } catch (err) {
        onApiError<EnrichmentTableCoreState>(err);
        // Rollback both metaColumns and views
        set({ metaColumns, views });
      }
    },

    updateColumnOrder: async (params) => {
      const { currentFieldId, beforeFieldId, afterFieldId } = params;
      const { activeViewId, views } = get();
      if (!activeViewId) {
        return;
      }

      // Find active view and its fieldProps
      const activeView = views.find((v) => v.viewId === activeViewId);
      if (!activeView) {
        return;
      }

      const fieldProps = activeView.fieldProps;
      const currentIndex = fieldProps.findIndex(
        (fp) => fp.fieldId === currentFieldId,
      );
      if (currentIndex === -1) {
        return;
      }

      // Calculate new index
      let newIndex: number;
      if (afterFieldId) {
        const afterIndex = fieldProps.findIndex(
          (fp) => fp.fieldId === afterFieldId,
        );
        if (afterIndex === -1) {
          return;
        }
        newIndex = afterIndex;
      } else if (beforeFieldId) {
        const beforeIndex = fieldProps.findIndex(
          (fp) => fp.fieldId === beforeFieldId,
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

      // Optimistic update: reorder fieldProps locally
      const newFieldProps = arrayMove(fieldProps, currentIndex, newIndex);
      const optimisticView = { ...activeView, fieldProps: newFieldProps };
      const optimisticViews = views.map((v) =>
        v.viewId === activeViewId ? optimisticView : v,
      );
      set({ views: optimisticViews });

      try {
        const { data: updatedView } = await _reorderTableViewColumn({
          ...params,
          viewId: activeViewId,
        });
        // Replace with API response to ensure consistency
        const finalViews = get().views.map((v) =>
          v.viewId === updatedView.viewId ? updatedView : v,
        );
        set({ views: finalViews });
      } catch (err) {
        // Rollback on error
        set({ views });
        onApiError(err);
        throw err;
      }
    },

    updateCellValue: async (data) => {
      try {
        return await _updateTableCell(data);
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
