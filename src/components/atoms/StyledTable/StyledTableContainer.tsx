import { FC, ReactNode, RefObject, useEffect, useMemo, useRef } from 'react';
import { Stack } from '@mui/material';
import { Table } from '@tanstack/react-table';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';

interface StyledTableContainerProps {
  table: Table<any>;
  rowHeight: number;
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
  scrollContainer?: RefObject<HTMLDivElement | null>;
  renderContent: (props: {
    columnVirtualizer: any;
    rowVirtualizer: any;
    virtualColumns: VirtualItem[];
    virtualRows: VirtualItem[];
    virtualPaddingLeft?: number;
    virtualPaddingRight?: number;
  }) => ReactNode;
}

export const StyledTableContainer: FC<StyledTableContainerProps> = ({
  table,
  rowHeight,
  onVisibleRangeChange,
  scrollContainer,
  renderContent,
}) => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const centerColumns = useMemo(
    () => {
      const visible = table.getVisibleLeafColumns();
      return visible.filter((col) => !col.getIsPinned());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getVisibleLeafColumns()],
  );

  const columnVirtualizer = useVirtualizer({
    count: centerColumns.length,
    estimateSize: (index) => centerColumns[index].getSize(),
    getScrollElement: () =>
      scrollContainer?.current ?? tableContainerRef.current,
    horizontal: true,
    overscan: 3,
  });

  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => rowHeight,
    getScrollElement: () => {
      return scrollContainer?.current ?? tableContainerRef.current;
    },
    overscan: 5,
    initialRect: {
      width: 0,
      height: 0,
    },
    enabled: true,
  });

  const virtualData = useMemo(
    () => {
      const virtualColumns = columnVirtualizer.getVirtualItems();
      const virtualRows = rowVirtualizer.getVirtualItems();

      let virtualPaddingLeft: number | undefined;
      let virtualPaddingRight: number | undefined;

      if (columnVirtualizer && virtualColumns?.length) {
        virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
        virtualPaddingRight =
          columnVirtualizer.getTotalSize() -
          (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
      }

      return {
        virtualColumns,
        virtualRows,
        virtualPaddingLeft,
        virtualPaddingRight,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnVirtualizer.getVirtualItems(), rowVirtualizer.getVirtualItems()],
  );

  // Track last range to avoid redundant calls
  const lastRangeRef = useRef<{ start: number; end: number } | null>(null);
  const rangeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Store latest callback in ref to avoid closure issues
  const onVisibleRangeChangeRef = useRef(onVisibleRangeChange);
  useEffect(() => {
    onVisibleRangeChangeRef.current = onVisibleRangeChange;
  }, [onVisibleRangeChange]);

  useEffect(() => {
    if (!onVisibleRangeChange || virtualData.virtualRows.length === 0) {
      return;
    }

    const startIndex = virtualData.virtualRows[0].index;
    const endIndex =
      virtualData.virtualRows[virtualData.virtualRows.length - 1].index;

    // Skip if range hasn't changed
    const lastRange = lastRangeRef.current;
    if (
      lastRange &&
      lastRange.start === startIndex &&
      lastRange.end === endIndex
    ) {
      return;
    }

    // Clear existing timer
    if (rangeTimerRef.current) {
      clearTimeout(rangeTimerRef.current);
    }

    // Debounce: immediate for large jumps (>50 rows), 50ms for small scrolls
    const jumpSize = lastRange ? Math.abs(startIndex - lastRange.start) : 0;
    const debounceTime = jumpSize > 50 ? 0 : 50;

    rangeTimerRef.current = setTimeout(() => {
      lastRangeRef.current = { start: startIndex, end: endIndex };
      onVisibleRangeChange(startIndex, endIndex);
      rangeTimerRef.current = null;
    }, debounceTime);
  }, [virtualData.virtualRows, onVisibleRangeChange]);

  // Force check when total rows change (e.g., new rowIds added)
  useEffect(() => {
    const callback = onVisibleRangeChangeRef.current;
    if (!callback || rows.length === 0) {
      return;
    }

    // Delay check to let virtualizer update after rows.length change
    const timer = setTimeout(() => {
      // Get fresh virtualRows from virtualizer
      const currentVirtualRows = rowVirtualizer.getVirtualItems();
      if (currentVirtualRows.length === 0) {
        return;
      }

      const startIndex = currentVirtualRows[0].index;
      const endIndex = currentVirtualRows[currentVirtualRows.length - 1].index;

      // Always trigger when total rows change, regardless of range
      lastRangeRef.current = { start: startIndex, end: endIndex };
      callback(startIndex, endIndex);
    }, 100);

    return () => clearTimeout(timer);
  }, [rows.length, rowVirtualizer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (rangeTimerRef.current) {
        clearTimeout(rangeTimerRef.current);
      }
    };
  }, []);

  return (
    <Stack
      ref={tableContainerRef}
      sx={{
        position: 'relative',
        width: 'fit-content',
        flexDirection: 'column',
        '& .column-resize-indicator': {
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: '#1976d2',
          zIndex: 1000,
          pointerEvents: 'none',
        },
        '& [data-column-resizing-indicator]': {
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: '#1976d2',
          zIndex: 1000,
          pointerEvents: 'none',
        },
      }}
    >
      {renderContent({
        columnVirtualizer,
        rowVirtualizer,
        virtualColumns: virtualData.virtualColumns,
        virtualRows: virtualData.virtualRows,
        virtualPaddingLeft: virtualData.virtualPaddingLeft,
        virtualPaddingRight: virtualData.virtualPaddingRight,
      })}
    </Stack>
  );
};
