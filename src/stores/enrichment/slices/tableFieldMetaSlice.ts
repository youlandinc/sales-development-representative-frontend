import { StateCreator } from 'zustand';

import { _updateTableMetaColumn } from '@/request';
import {
  TableColumnProps,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';
import { SDRToast } from '@/components/atoms';
import { HttpError } from '@/types';

// ============================================================================
// Types
// ============================================================================

export type TableFieldMetaState = {
  // Field metadata (shared across all views)
  metaColumns: TableColumnProps[];
  activeColumnId: string;
};

export type TableFieldMetaActions = {
  setMetaColumns: (metaColumns: TableColumnProps[]) => void;
  setActiveColumnId: (columnId: string) => void;
  getMetaColumnById: (fieldId: string) => TableColumnProps | undefined;
  // Meta operations (use _updateTableMetaColumn API)
  updateColumnName: (fieldName: string) => Promise<void>;
  updateColumnType: (fieldType: TableColumnTypeEnum) => Promise<void>;
  updateColumnDescription: (description: string) => Promise<void>;
  updateColumnNameAndType: (params: {
    fieldName: string;
    fieldType: TableColumnTypeEnum;
  }) => Promise<void>;
};

export type TableFieldMetaSlice = TableFieldMetaState & TableFieldMetaActions;

// ============================================================================
// Helpers
// ============================================================================

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

type GetActiveMetaColumnResult = {
  fieldId: string;
  metaColumns: TableColumnProps[];
  metaColumn: TableColumnProps | undefined;
};

const getActiveMetaColumn = (
  get: () => TableFieldMetaSlice & { tableId: string },
): GetActiveMetaColumnResult & { tableId: string } => {
  const { activeColumnId, metaColumns, tableId } = get();
  return {
    tableId,
    fieldId: activeColumnId,
    metaColumns,
    metaColumn: metaColumns.find((col) => col.fieldId === activeColumnId),
  };
};

// ============================================================================
// Slice
// ============================================================================

export const createTableFieldMetaSlice: StateCreator<
  TableFieldMetaSlice & { tableId: string },
  [],
  [],
  TableFieldMetaSlice
> = (set, get) => ({
  // State
  metaColumns: [],
  activeColumnId: '',

  // Actions
  setMetaColumns: (metaColumns) => set({ metaColumns }),
  setActiveColumnId: (columnId) => set({ activeColumnId: columnId }),
  getMetaColumnById: (fieldId) =>
    get().metaColumns.find((col) => col.fieldId === fieldId),

  updateColumnName: async (fieldName) => {
    const { tableId, fieldId, metaColumns, metaColumn } =
      getActiveMetaColumn(get);
    const trimmedName = fieldName.trim();

    if (!tableId || !fieldId || !metaColumn || !trimmedName) {
      return;
    }

    const updatedMetaColumns = metaColumns.map((col) =>
      col.fieldId === fieldId ? { ...col, fieldName: trimmedName } : col,
    );
    set({ metaColumns: updatedMetaColumns });

    try {
      await _updateTableMetaColumn({
        fieldId,
        fieldName: trimmedName,
      });
    } catch (err) {
      onApiError<TableFieldMetaState>(err, { metaColumns }, set);
    }
  },

  updateColumnType: async (fieldType) => {
    const { tableId, fieldId, metaColumns, metaColumn } =
      getActiveMetaColumn(get);

    if (!tableId || !fieldId || !metaColumn || !fieldType) {
      return;
    }

    if (metaColumn.fieldType === fieldType) {
      return;
    }

    const updatedMetaColumns = metaColumns.map((col) =>
      col.fieldId === fieldId ? { ...col, fieldType } : col,
    );
    set({ metaColumns: updatedMetaColumns });

    try {
      await _updateTableMetaColumn({
        fieldId,
        fieldType,
      });
    } catch (err) {
      onApiError<TableFieldMetaState>(err, { metaColumns }, set);
    }
  },

  updateColumnDescription: async (description) => {
    const { tableId, fieldId, metaColumns, metaColumn } =
      getActiveMetaColumn(get);
    const trimmedDescription = description.trim();

    if (!tableId || !fieldId || !metaColumn) {
      return;
    }

    const updatedMetaColumns = metaColumns.map((col) =>
      col.fieldId === fieldId
        ? { ...col, description: trimmedDescription }
        : col,
    );
    set({ metaColumns: updatedMetaColumns });

    try {
      await _updateTableMetaColumn({
        fieldId,
        description: trimmedDescription,
      });
    } catch (err) {
      onApiError<TableFieldMetaState>(err, { metaColumns }, set);
    }
  },

  updateColumnNameAndType: async ({ fieldName, fieldType }) => {
    const { tableId, fieldId, metaColumns, metaColumn } =
      getActiveMetaColumn(get);
    const trimmedFieldName = fieldName.trim();

    if (
      !tableId ||
      !fieldId ||
      !metaColumn ||
      !trimmedFieldName ||
      !fieldType
    ) {
      return;
    }

    const updatedMetaColumns = metaColumns.map((col) =>
      col.fieldId === fieldId
        ? { ...col, fieldName: trimmedFieldName, fieldType }
        : col,
    );
    set({ metaColumns: updatedMetaColumns });

    try {
      await _updateTableMetaColumn({
        fieldId,
        fieldName: trimmedFieldName,
        fieldType,
      });
    } catch (err) {
      onApiError<TableFieldMetaState>(err, { metaColumns }, set);
    }
  },
});
