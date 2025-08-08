import { FC, useEffect, useMemo, useRef, useState } from 'react';
import type { UIEvent } from 'react';
import { Checkbox, Stack } from '@mui/material';

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type {
  ColumnSizingInfoState,
  ColumnSizingState,
  RowSelectionState,
} from '@tanstack/react-table';

import { StyledTableHeader, StyledTableRow } from './index';

import { TableHeaderProps } from '@/types/Prospect/table';

interface StyledTableProps {
  columns: TableHeaderProps[];
  rowIds: string[];
  data: any[];
  addMenuItems?: { label: string; value: string }[];
  onAddMenuItemClick?: (item: { label: string; value: string }) => void;
  // optional: number of pinned columns on the left
  pinnedLeftCount?: number;
  // optional: initial widths for columns
  initialColumnWidths?: Record<string, number>;
  // optional: notify parent when widths change
  onColumnWidthsChange?: (w: Record<string, number>) => void;
  // optional: key for localStorage persistence (e.g., tableId)
  columnWidthStorageKey?: string;
  virtualization?: {
    enabled?: boolean;
    containerHeight?: number; // px
    rowHeight: number; // px
    paddingTop: number; // px
    paddingBottom: number; // px
    onScroll?: (e: UIEvent<HTMLDivElement>) => void;
    onContainerRef?: (el: HTMLDivElement | null) => void;
  };
}

const columnHelper = createColumnHelper<any>();

export const StyledTable: FC<StyledTableProps> = ({
  columns,
  rowIds,
  data,
  addMenuItems,
  onAddMenuItemClick,
  pinnedLeftCount: pinnedLeftCountProp,
  initialColumnWidths,
  onColumnWidthsChange,
  columnWidthStorageKey,
  virtualization,
}) => {
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnSizingInfo, setColumnSizingInfo] =
    useState<ColumnSizingInfoState>({} as ColumnSizingInfoState);
  const [scrolled, setScrolled] = useState(false);
  const pinnedLeftCount = pinnedLeftCountProp ?? 1; // default pin first column
  const [visibleIndexSet, setVisibleIndexSet] = useState<
    Set<number> | undefined
  >(undefined);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Map visible row index -> global index
  const startIndex = useMemo(() => {
    const rh = virtualization?.rowHeight ?? 0;
    const pt = virtualization?.paddingTop ?? 0;
    if (!rh) {
      return 0;
    }
    return Math.max(0, Math.floor(pt / rh));
  }, [virtualization?.rowHeight, virtualization?.paddingTop]);
  const table = useReactTable({
    data: data,
    columns: useMemo(() => {
      // First column: index + checkbox on hover; header: select-all checkbox
      const selectCol = columnHelper.display({
        id: '__select',
        header: (ctx) => (
          <Checkbox
            checked={ctx.table.getIsAllRowsSelected?.()}
            indeterminate={ctx.table.getIsSomeRowsSelected?.()}
            onChange={(e, checked) =>
              ctx.table.toggleAllRowsSelected?.(checked)
            }
            onClick={(e) => e.stopPropagation()}
            size="small"
          />
        ),
        cell: (info) => {
          const localIndex = info.row.index; // index within visible data
          const globalIndex = startIndex + localIndex;
          const label = `${globalIndex + 1}`;
          const checked = info.row.getIsSelected?.() ?? false;
          return (
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="center"
              sx={{
                position: 'relative',
                '&:hover .row-index': { display: 'none' },
                '&:hover .row-checkbox': { display: 'flex' },
              }}
            >
              <Stack
                className="row-index"
                sx={{ display: 'block', lineHeight: 1 }}
              >
                {label}
              </Stack>
              <Stack className="row-checkbox" sx={{ display: 'none' }}>
                <Checkbox
                  checked={checked}
                  onChange={(e, next) => info.row.toggleSelected?.(next)}
                  onClick={(e) => e.stopPropagation()}
                  size="small"
                />
              </Stack>
            </Stack>
          );
        },
        size: 56,
        minSize: 44,
        maxSize: 80,
        enableResizing: false,
      });

      const rest = columns.map((column) =>
        columnHelper.accessor(
          (row: any) => {
            const v = row?.[column.fieldId];
            if (v && typeof v === 'object' && 'value' in v) {
              return (v as any).value ?? '';
            }
            return v ?? '';
          },
          {
            id: column.fieldId,
            header: column.fieldName,
            cell: (info) => info.getValue(),
          },
        ),
      );

      return [selectCol, ...rest];
    }, [columns, startIndex]),
    getCoreRowModel: getCoreRowModel(),
    getRowId: (_row, index) =>
      rowIds[startIndex + index] ?? String(startIndex + index),
    defaultColumn: {
      size: 160,
      minSize: 80,
      maxSize: 800,
    },
    enableRowSelection: true,
    columnResizeMode: 'onChange',
    state: {
      columnSizing,
      columnSizingInfo,
      rowSelection,
    },
    onColumnSizingChange: setColumnSizing,
    onColumnSizingInfoChange: setColumnSizingInfo,
    onRowSelectionChange: setRowSelection,
  });

  // Load persisted column sizing (backward compatible with previous storage key)
  useEffect(() => {
    const key = columnWidthStorageKey;
    const saved = key ? localStorage.getItem(`table_colwidths_${key}`) : null;
    let next: Record<string, number> = {};
    if (saved) {
      try {
        next = JSON.parse(saved) || {};
      } catch {
        /* empty */
      }
    } else if (initialColumnWidths) {
      next = initialColumnWidths;
    }
    if (Object.keys(next).length) {
      setColumnSizing(next);
    }
  }, [columnWidthStorageKey, initialColumnWidths]);

  // Persist column sizing on change
  useEffect(() => {
    if (columnWidthStorageKey) {
      localStorage.setItem(
        `table_colwidths_${columnWidthStorageKey}`,
        JSON.stringify(columnSizing),
      );
    }
    onColumnWidthsChange?.(columnSizing as Record<string, number>);
  }, [columnSizing, columnWidthStorageKey, onColumnWidthsChange]);

  // No manual measuring needed; sizes come from TanStack state

  const stickyLeftMap = useMemo(() => {
    const headers = table.getHeaderGroups()[0]?.headers ?? [];
    const map: Record<string, number> = {};
    let acc = 0;
    for (let i = 0; i < Math.min(pinnedLeftCount, headers.length); i++) {
      const h: any = headers[i];
      map[h.id] = acc;
      const w = (h.getSize?.() as number) ?? h.column.getSize?.() ?? 160;
      acc += w;
    }
    return map;
  }, [pinnedLeftCount, table, columnSizing]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrolled(target.scrollTop > 0);
    // compute visible columns
    const sl = target.scrollLeft;
    const viewportW = target.clientWidth;
    const headers = table.getHeaderGroups()[0]?.headers ?? [];
    const overscanPx = 200; // px
    let x = 0;
    const indices: number[] = [];
    for (let i = 0; i < headers.length; i++) {
      const h: any = headers[i];
      const w = (h.getSize?.() as number) ?? h.column.getSize?.() ?? 100;
      const start = x;
      const end = x + w;
      // include if intersects with [sl-overscan, sl+viewportW+overscan]
      if (end >= sl - overscanPx && start <= sl + viewportW + overscanPx) {
        indices.push(i);
      }
      x = end;
    }
    setVisibleIndexSet(new Set(indices));

    virtualization?.onScroll?.(e);
  };

  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      {virtualization?.enabled ? (
        <Stack
          onScroll={handleScroll}
          ref={(el) => {
            scrollRef.current = el;
            virtualization.onContainerRef?.(el);
          }}
          sx={{
            overflowY: 'auto',
            overflowX: 'auto',
            flex: 1,
            minHeight: 0,
            height: virtualization.containerHeight
              ? `${virtualization.containerHeight}px`
              : undefined,
            willChange: 'scroll-position',
            contain: 'layout paint style',
          }}
        >
          <Stack
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: '#fff',
              boxShadow: scrolled ? '0 4px 10px rgba(0,0,0,0.06)' : 'none',
              borderBottom: '1px solid #DFDEE6',
            }}
          >
            <StyledTableHeader
              addMenuItems={addMenuItems}
              columnsData={table.getHeaderGroups()[0].headers}
              onAddMenuItemClick={onAddMenuItemClick}
              pinnedLeftCount={pinnedLeftCount}
              stickyLeftMap={stickyLeftMap}
              visibleIndexSet={visibleIndexSet}
            />
          </Stack>
          <Stack sx={{ height: `${virtualization.paddingTop}px` }} />
          <StyledTableRow
            pinnedLeftCount={pinnedLeftCount}
            rowHeight={virtualization.rowHeight}
            rows={table.getRowModel().rows}
            stickyLeftMap={stickyLeftMap}
            visibleIndexSet={visibleIndexSet}
          />
          <Stack sx={{ height: `${virtualization.paddingBottom}px` }} />
        </Stack>
      ) : (
        <>
          <StyledTableHeader
            addMenuItems={addMenuItems}
            columnsData={table.getHeaderGroups()[0].headers}
            onAddMenuItemClick={onAddMenuItemClick}
            pinnedLeftCount={pinnedLeftCount}
            stickyLeftMap={stickyLeftMap}
            visibleIndexSet={visibleIndexSet}
          />
          <StyledTableRow
            pinnedLeftCount={pinnedLeftCount}
            rows={table.getRowModel().rows}
            stickyLeftMap={stickyLeftMap}
            visibleIndexSet={visibleIndexSet}
          />
        </>
      )}
    </Stack>
  );
};
