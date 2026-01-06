import { StateCreator } from 'zustand';

import { _updateTableViewColumn, _updateTableViewColumns } from '@/request';
import { TableViewColumnProps, TableViewData } from '@/types/enrichment/table';
import { SDRToast } from '@/components/atoms';
import { HttpError } from '@/types';
import { UTypeOf } from '@/utils';

// ============================================================================
// Types
// ============================================================================

export type TableViewConfigState = {
  views: TableViewData[];
  activeViewId: string;
};

export type TableViewConfigActions = {
  setViews: (views: TableViewData[]) => void;
  setActiveViewId: (viewId: string) => void;
  getActiveView: () => TableViewData | undefined;
  getActiveFieldProps: () => TableViewColumnProps[];
  // View config operations (use _updateTableViewColumn API)
  updateViewColumnPin: (fieldId: string, pin: boolean) => Promise<void>;
  updateViewColumnWidth: (fieldId: string, width: number) => Promise<void>;
  updateViewColumnVisible: (fieldId: string, visible: boolean) => Promise<void>;
  updateViewColumnsVisible: (
    updates: { fieldId: string; visible: boolean }[],
  ) => Promise<void>;
};

export type TableViewConfigSlice = TableViewConfigState &
  TableViewConfigActions;

// Full store type that slice needs to access (avoid circular dependencies)
type StoreWithTableId = TableViewConfigSlice & { tableId: string };

// ============================================================================
// Helpers
// ============================================================================

const onApiError = (err: unknown) => {
  const { message, header, variant } = err as HttpError;
  SDRToast({ message, header, variant });
};

// Update fieldProps of the active view
const updateActiveViewFieldProps = (
  views: TableViewData[],
  activeViewId: string,
  updater: (fieldProps: TableViewColumnProps[]) => TableViewColumnProps[],
): TableViewData[] => {
  return views.map((view) =>
    view.viewId === activeViewId
      ? { ...view, fieldProps: updater(view.fieldProps ?? []) }
      : view,
  );
};

// Replace view in list with API response
const replaceViewInList = (
  views: TableViewData[],
  newView: TableViewData,
): TableViewData[] => {
  return views.map((view) => (view.viewId === newView.viewId ? newView : view));
};

// ============================================================================
// Slice
// ============================================================================

export const createTableViewConfigSlice: StateCreator<
  StoreWithTableId,
  [],
  [],
  TableViewConfigSlice
> = (set, get) => ({
  // State
  views: [],
  activeViewId: '',

  // Actions
  setViews: (views) => set({ views }),
  setActiveViewId: (viewId) => set({ activeViewId: viewId }),
  getActiveView: () => {
    const { views, activeViewId } = get();
    return views.find((v) => v.viewId === activeViewId);
  },
  getActiveFieldProps: () => {
    const activeView = get().getActiveView();
    return activeView?.fieldProps ?? [];
  },

  updateViewColumnPin: async (fieldId, pin) => {
    const { activeViewId, views } = get();

    if (!fieldId || !activeViewId || UTypeOf.isUndefined(pin)) {
      return;
    }

    // Optimistic update
    const updatedViews = updateActiveViewFieldProps(
      views,
      activeViewId,
      (fps) => fps.map((fp) => (fp.fieldId === fieldId ? { ...fp, pin } : fp)),
    );
    set({ views: updatedViews });

    try {
      const { data } = await _updateTableViewColumn({
        viewId: activeViewId,
        fieldId,
        pin,
      });
      // Replace with API response
      if (data) {
        set({ views: replaceViewInList(get().views, data) });
      }
    } catch (err) {
      onApiError(err);
      set({ views }); // rollback
    }
  },

  updateViewColumnWidth: async (fieldId, width) => {
    const { activeViewId, views } = get();

    if (!fieldId || !activeViewId || !width) {
      return;
    }

    // Optimistic update
    const updatedViews = updateActiveViewFieldProps(
      views,
      activeViewId,
      (fps) =>
        fps.map((fp) => (fp.fieldId === fieldId ? { ...fp, width } : fp)),
    );
    set({ views: updatedViews });

    try {
      const { data } = await _updateTableViewColumn({
        viewId: activeViewId,
        fieldId,
        width,
      });
      // Replace with API response
      if (data) {
        set({ views: replaceViewInList(get().views, data) });
      }
    } catch (err) {
      onApiError(err);
      set({ views });
    }
  },

  updateViewColumnVisible: async (fieldId, visible) => {
    const { activeViewId, views } = get();

    if (!fieldId || !activeViewId || UTypeOf.isUndefined(visible)) {
      return;
    }

    // Optimistic update
    const updatedViews = updateActiveViewFieldProps(
      views,
      activeViewId,
      (fps) =>
        fps.map((fp) => (fp.fieldId === fieldId ? { ...fp, visible } : fp)),
    );
    set({ views: updatedViews });

    try {
      const { data } = await _updateTableViewColumn({
        viewId: activeViewId,
        fieldId,
        visible,
      });
      // Replace with API response
      if (data) {
        set({ views: replaceViewInList(get().views, data) });
      }
    } catch (err) {
      onApiError(err);
      set({ views });
    }
  },

  updateViewColumnsVisible: async (updates) => {
    const { activeViewId, views } = get();

    if (!updates.length || !activeViewId) {
      return;
    }

    // Optimistic update
    const updateMap = new Map(updates.map((u) => [u.fieldId, u.visible]));
    const updatedViews = updateActiveViewFieldProps(
      views,
      activeViewId,
      (fps) =>
        fps.map((fp) =>
          updateMap.has(fp.fieldId)
            ? { ...fp, visible: updateMap.get(fp.fieldId)! }
            : fp,
        ),
    );
    set({ views: updatedViews });

    try {
      const payload = updates.map((u) => ({
        fieldId: u.fieldId,
        visible: u.visible,
      }));
      const { data } = await _updateTableViewColumns({
        tableId: get().tableId,
        viewId: activeViewId,
        fields: payload,
      });
      // Replace with API response
      if (data) {
        set({ views: replaceViewInList(get().views, data) });
      }
    } catch (err) {
      onApiError(err);
      set({ views });
    }
  },
});
