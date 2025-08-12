import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import { Table } from '@tanstack/react-table';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';

interface StyledTableContainerProps {
  table: Table<any>;
  rowHeight: number;
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
  scrollContainer?: React.RefObject<HTMLDivElement | null>;
  renderContent: (props: {
    tableContainerRef: React.RefObject<HTMLDivElement | null>;
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

  const [isScrollContainerReady, setIsScrollContainerReady] = useState(false);

  useEffect(() => {
    const checkContainer = () => {
      const container = scrollContainer?.current ?? tableContainerRef.current;
      const height = container?.clientHeight || container?.offsetHeight || 0;

      if (container && height >= 300) {
        setIsScrollContainerReady(true);
        return true;
      }
      return false;
    };

    if (checkContainer()) {
      return;
    }

    const timeout = setTimeout(() => {
      checkContainer();
    }, 100);

    const interval = setInterval(() => {
      if (checkContainer()) {
        clearInterval(interval);
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [scrollContainer]);

  const { visibleColumns, centerColumns } = useMemo(() => {
    const visible = table.getVisibleLeafColumns();
    const center = visible.filter((col) => !col.getIsPinned());
    return { visibleColumns: visible, centerColumns: center };
  }, [table.getVisibleLeafColumns()]);

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
      const element = scrollContainer?.current ?? tableContainerRef.current;
      return element;
    },
    overscan: 5,
    initialRect: {
      width: 0,
      height: isScrollContainerReady ? 0 : 600,
    },
    enabled: isScrollContainerReady,
  });

  const virtualData = useMemo(() => {
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
  }, [
    columnVirtualizer.getVirtualItems(),
    rowVirtualizer.getVirtualItems(),
    isScrollContainerReady,
  ]);

  useEffect(() => {
    if (isScrollContainerReady && virtualData.virtualRows.length > 0) {
      const startIndex = virtualData.virtualRows[0].index;
      const endIndex =
        virtualData.virtualRows[virtualData.virtualRows.length - 1].index;
      onVisibleRangeChange?.(startIndex, endIndex);
    }
  }, [
    virtualData.virtualRows.length,
    onVisibleRangeChange,
    isScrollContainerReady,
    virtualData.virtualRows,
  ]);

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
      {isScrollContainerReady &&
        renderContent({
          tableContainerRef,
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
