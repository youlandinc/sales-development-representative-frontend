import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Menu, MenuItem, Stack } from '@mui/material';

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type {
  ColumnPinningState,
  ColumnSizingInfoState,
  ColumnSizingState,
  RowSelectionState,
} from '@tanstack/react-table';

import {
  StyledTableBody,
  StyledTableBodyCell,
  StyledTableBodyRow,
  StyledTableContainer,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableHeadRow,
  StyledTableSpacer,
} from './index';

import { TableHeaderProps } from '@/types/Prospect/table';

interface StyledTableProps {
  columns: any[];
  rowIds: string[];
  data: any[];
  addMenuItems?: { label: string; value: string }[];
  onAddMenuItemClick?: (item: { label: string; value: string }) => void;
  pinnedLeftCount?: number;
  initialColumnWidths?: Record<string, number>;
  onColumnWidthsChange?: (widths: Record<string, number>) => void;
  columnWidthStorageKey?: string;
  scrolled?: boolean;
  virtualization?: {
    enabled?: boolean;
    rowHeight?: number;
    scrollContainer?: React.RefObject<HTMLDivElement | null>;
    onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
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
  scrolled,
  virtualization,
}) => {
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnSizingInfo, setColumnSizingInfo] =
    useState<ColumnSizingInfoState>({} as ColumnSizingInfoState);
  const [scrolledState, setScrolledState] = useState(false);
  const pinnedLeftCount = pinnedLeftCountProp ?? 1;
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ['__select'],
    right: [],
  });

  // Add column menu state
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const addMenuItems_ = useMemo(
    () => addMenuItems ?? [{ label: '+ Add new column', value: 'add_column' }],
    [addMenuItems],
  );

  const rowHeight = virtualization?.rowHeight ?? 48;

  const table = useReactTable({
    data: data,
    columns: useMemo(() => {
      // First column: selection
      const selectCol = columnHelper.display({
        id: '__select',
        header: () => {
          const total = rowIds.length;
          const selectedCount = rowIds.reduce(
            (acc, id) => acc + (rowSelection[id] ? 1 : 0),
            0,
          );
          const allChecked = total > 0 && selectedCount === total;
          const someChecked = selectedCount > 0 && selectedCount < total;
          return (
            <Checkbox
              checked={allChecked}
              indeterminate={someChecked}
              onChange={(e, checked) => {
                if (checked) {
                  const next: RowSelectionState = {};
                  for (const id of rowIds) {
                    next[id] = true;
                  }
                  setRowSelection(next);
                } else {
                  setRowSelection({});
                }
              }}
              onClick={(e) => e.stopPropagation()}
              size="small"
            />
          );
        },
        cell: (info) => {
          const label = `${info.row.index + 1}`;
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
    }, [columns, rowIds, rowSelection]),
    getCoreRowModel: getCoreRowModel(),
    getRowId: (_row, index) => rowIds[index] ?? String(index),
    defaultColumn: {
      size: 160,
      minSize: 80,
    },
    enableRowSelection: true,
    enableColumnPinning: true,
    columnResizeMode: 'onEnd',
    state: {
      columnSizing,
      columnSizingInfo,
      rowSelection,
      columnPinning,
    },
    onColumnSizingChange: setColumnSizing,
    onColumnSizingInfoChange: setColumnSizingInfo,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
  });

  // Calculate sticky left offsets for pinned columns
  const { leftPinnedColumns, centerColumns, stickyLeftMap } = useMemo(() => {
    const visibleColumns = table.getVisibleLeafColumns();
    const leftPinned = visibleColumns.filter(
      (col) => col.getIsPinned() === 'left',
    );
    const center = visibleColumns.filter((col) => !col.getIsPinned());

    const map: Record<string, number> = {};
    let acc = 0;
    for (let i = 0; i < leftPinned.length; i++) {
      const col = leftPinned[i];
      map[col.id] = acc;
      acc += col.getSize();
    }

    return {
      leftPinnedColumns: leftPinned,
      centerColumns: center,
      stickyLeftMap: map,
    };
  }, [table.getVisibleLeafColumns(), columnSizing]);

  // Load persisted column sizing
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

  // Persist column sizing
  useEffect(() => {
    if (columnWidthStorageKey) {
      localStorage.setItem(
        `table_colwidths_${columnWidthStorageKey}`,
        JSON.stringify(columnSizing),
      );
    }
    onColumnWidthsChange?.(columnSizing as Record<string, number>);
  }, [columnSizing, columnWidthStorageKey, onColumnWidthsChange]);

  const handleAddMenuClick = useCallback(
    (item: { label: string; value: string }) => {
      onAddMenuItemClick?.(item);
      setAddMenuAnchor(null);
    },
    [onAddMenuItemClick],
  );

  // Memoize render content to avoid recreation on every render
  const renderContent = useCallback(
    ({
      tableContainerRef,
      columnVirtualizer,
      rowVirtualizer,
      virtualColumns,
      virtualRows,
      virtualPaddingLeft,
      virtualPaddingRight,
    }: any) => (
      <>
        {/* Column resize indicator - positioned relative to scroll container */}
        {columnSizingInfo.isResizingColumn && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: columnSizingInfo.startOffset || 0,
              transform: `translateX(${columnSizingInfo.deltaOffset || 0}px)`,
              height: `${rowVirtualizer.getTotalSize()}px`, // Use virtual total height
              width: '2px',
              backgroundColor: '#1976d2',
              zIndex: 1000,
              pointerEvents: 'none',
              opacity: 0.8,
            }}
          />
        )}
        
        <StyledTableHead scrolled={scrolled ?? scrolledState}>
          {/* Column resize indicator for header area - higher z-index */}
          {columnSizingInfo.isResizingColumn && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: columnSizingInfo.startOffset || 0,
                transform: `translateX(${columnSizingInfo.deltaOffset || 0}px)`,
                width: '2px',
                backgroundColor: '#1976d2',
                zIndex: 1001, // Higher than head cells (zIndex: 3)
                pointerEvents: 'none',
                opacity: 0.8,
              }}
            />
          )}
          
          {table.getHeaderGroups().map((headerGroup) => (
            <StyledTableHeadRow key={headerGroup.id}>
              {/* Pinned left headers */}
              {leftPinnedColumns.map((col, index) => {
                const header = headerGroup.headers.find((h) => h.id === col.id);
                if (!header) {
                  return null;
                }
                return (
                  <StyledTableHeadCell
                    header={header}
                    isPinned
                    key={header.id}
                    stickyLeft={stickyLeftMap[col.id] ?? 0}
                    width={header.getSize()}
                  />
                );
              })}

              {/* Left padding spacer */}
              {virtualPaddingLeft ? (
                <StyledTableSpacer width={virtualPaddingLeft} />
              ) : null}

              {/* Virtual columns */}
              {virtualColumns.map((virtualColumn: any) => {
                const col = centerColumns[virtualColumn.index];
                const header = headerGroup.headers.find((h) => h.id === col.id);
                if (!header) {
                  return null;
                }
                return (
                  <StyledTableHeadCell
                    dataIndex={virtualColumn.index}
                    header={header}
                    key={header.id}
                    measureRef={(node) =>
                      columnVirtualizer.measureElement(node)
                    }
                    width={header.getSize()}
                  />
                );
              })}

              {/* Right padding spacer */}
              {virtualPaddingRight ? (
                <StyledTableSpacer width={virtualPaddingRight} />
              ) : null}

              {/* Add column button */}
              <StyledTableHeadCell
                onClick={(e) => setAddMenuAnchor(e.currentTarget)}
                width={120}
              >
                Add column
              </StyledTableHeadCell>
            </StyledTableHeadRow>
          ))}
        </StyledTableHead>

        <StyledTableBody totalHeight={rowVirtualizer.getTotalSize()}>
          {virtualRows.map((virtualRow: any) => {
            const row = table.getRowModel().rows[virtualRow.index];
            const visibleCells = row.getVisibleCells();

            return (
              <StyledTableBodyRow
                key={row.id}
                measureRef={(node) => rowVirtualizer.measureElement(node)}
                rowHeight={rowHeight}
                rowIndex={virtualRow.index}
                virtualStart={virtualRow.start}
              >
                {/* Pinned left cells */}
                {leftPinnedColumns.map((col, index) => {
                  const cell = visibleCells.find((c) => c.column.id === col.id);
                  if (!cell) {
                    return null;
                  }
                  const isLoading = Boolean(
                    (cell.row.original as any)?.__loading,
                  );

                  return (
                    <StyledTableBodyCell
                      cell={cell}
                      isLoading={isLoading}
                      isPinned
                      key={cell.id}
                      stickyLeft={stickyLeftMap[col.id] ?? 0}
                      width={cell.column.getSize()}
                    />
                  );
                })}

                {/* Left padding spacer */}
                {virtualPaddingLeft ? (
                  <StyledTableSpacer width={virtualPaddingLeft} />
                ) : null}

                {/* Virtual cells */}
                {virtualColumns.map((vc: any) => {
                  const col = centerColumns[vc.index];
                  const cell = visibleCells.find((c) => c.column.id === col.id);
                  if (!cell) {
                    return null;
                  }
                  const isLoading = Boolean(
                    (cell.row.original as any)?.__loading,
                  );

                  return (
                    <StyledTableBodyCell
                      cell={cell}
                      isLoading={isLoading}
                      key={cell.id}
                      width={cell.column.getSize()}
                    />
                  );
                })}

                {/* Right padding spacer */}
                {virtualPaddingRight ? (
                  <StyledTableSpacer width={virtualPaddingRight} />
                ) : null}
              </StyledTableBodyRow>
            );
          })}
        </StyledTableBody>
      </>
    ),
    [
      scrolled ?? scrolledState,
      table.getHeaderGroups(),
      leftPinnedColumns,
      centerColumns,
      stickyLeftMap,
      rowHeight,
      columnSizingInfo,
    ],
  );

  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        position: 'relative',
      }}
    >
      <StyledTableContainer
        onVisibleRangeChange={virtualization?.onVisibleRangeChange}
        renderContent={renderContent}
        rowHeight={rowHeight}
        scrollContainer={virtualization?.scrollContainer}
        table={table}
      />

      {/* Add Column Menu */}
      <Menu
        anchorEl={addMenuAnchor}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        onClose={() => setAddMenuAnchor(null)}
        open={Boolean(addMenuAnchor)}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {addMenuItems_.map((item) => (
          <MenuItem key={item.value} onClick={() => handleAddMenuClick(item)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};
