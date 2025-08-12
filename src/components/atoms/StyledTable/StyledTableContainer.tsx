import {
  FC,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react';
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

  const centerColumns = useMemo(() => {
    const visible = table.getVisibleLeafColumns();
    return visible.filter((col) => !col.getIsPinned());
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
      height: 0,
    },
    enabled: true,
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
  ]);

  useEffect(() => {
     if (onVisibleRangeChange && virtualData.virtualRows.length > 0) {
      const startIndex = virtualData.virtualRows[0].index;
      const endIndex = virtualData.virtualRows[virtualData.virtualRows.length - 1].index;
      onVisibleRangeChange(startIndex, endIndex);
    }
  }, [virtualData.virtualRows, onVisibleRangeChange]);

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
