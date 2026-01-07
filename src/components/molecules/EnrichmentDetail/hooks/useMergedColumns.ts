import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

import { useEnrichmentTableStore } from '@/stores/enrichment';
import { TableColumnProps } from '@/types/enrichment/table';

/**
 * Merge metaColumns and activeView.fieldProps to generate final columns
 *
 * metaColumns: Field metadata (shared across all views)
 * fieldProps: Current view's column config (pin, visible, width, sort, color)
 *
 * Merge rule: metaColumns properties + fieldProps properties override
 *
 * @example const columns = useMergedColumns()
 */
export const useMergedColumns = (): TableColumnProps[] => {
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

    // If no fieldProps, fallback to metaColumns order
    if (fieldProps.length === 0) {
      return metaColumns;
    }

    // Create metaColumns lookup Map
    const metaColumnsMap = new Map<string, TableColumnProps>(
      metaColumns.map((col) => [col.fieldId, col]),
    );

    // Use fieldProps order, merge with metaColumns data
    const result: TableColumnProps[] = [];
    for (const fp of fieldProps) {
      const meta = metaColumnsMap.get(fp.fieldId);
      if (!meta) {
        // fieldId not found in metaColumns, skip
        continue;
      }
      // Override view-related properties with fieldProps
      result.push({
        ...meta,
        pin: fp.pin,
        visible: fp.visible,
        width: fp.width ?? meta.width,
        color: fp.color,
        csn: fp.sort,
      });
    }
    return result;
  }, [metaColumns, views, activeViewId]);
};
