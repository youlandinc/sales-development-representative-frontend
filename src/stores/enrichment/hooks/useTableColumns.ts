import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

import { useEnrichmentTableStore } from '../index';
import {
  TableColumnProps,
  TableViewColumnProps,
} from '@/types/enrichment/table';

/**
 * Merge metaColumns and activeView.fieldProps to generate final columns
 *
 * metaColumns: Field metadata (shared across all views)
 * fieldProps: Current view's column config (pin, visible, width, sort, color)
 *
 * Merge rule: metaColumns properties + fieldProps properties override
 */
export const useTableColumns = (): TableColumnProps[] => {
  const { metaColumns, views, activeViewId } = useEnrichmentTableStore(
    useShallow((state) => ({
      metaColumns: state.metaColumns,
      views: state.views,
      activeViewId: state.activeViewId,
    })),
  );

  return useMemo(() => {
    // Get fieldProps of current view
    const activeView = views.find((v) => v.viewId === activeViewId);
    const fieldProps = activeView?.fieldProps ?? [];

    // Create fieldProps lookup Map
    const fieldPropsMap = new Map<string, TableViewColumnProps>(
      fieldProps.map((fp) => [fp.fieldId, fp]),
    );

    // Merge metaColumns + fieldProps
    return metaColumns.map((meta) => {
      const fp = fieldPropsMap.get(meta.fieldId);
      if (!fp) {
        // No fieldProps, use default values from metaColumns
        return meta;
      }
      // Override view-related properties with fieldProps
      return {
        ...meta,
        pin: fp.pin,
        visible: fp.visible,
        width: fp.width,
        color: fp.color,
        csn: fp.sort,
      };
    });
  }, [metaColumns, views, activeViewId]);
};
