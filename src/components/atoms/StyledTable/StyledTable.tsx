import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

interface StyledTableProps {
  columns: any[];
  rowIds: string[];
  data: any[];
  addMenuItems?: { label: string; value: string }[];
  onAddMenuItemClick?: (item: { label: string; value: string }) => void;
  pinnedLeftCount?: number;
  columnWidthStorageKey?: string;
  scrolled?: boolean;
  virtualization?: {
    enabled?: boolean;
    rowHeight?: number;
    scrollContainer?: React.RefObject<HTMLDivElement | null>;
    onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
  };
  onColumnResize?: (fieldId: string, width: number) => void;
  onCellEdit?: (recordId: string, fieldId: string, value: string) => void;
}

const columnHelper = createColumnHelper<any>();

export const StyledTable: FC<StyledTableProps> = ({
  columns,
  rowIds,
  data,
  addMenuItems,
  onAddMenuItemClick,
  pinnedLeftCount: pinnedLeftCountProp,
  columnWidthStorageKey,
  scrolled,
  virtualization,
  onColumnResize,
  onCellEdit,
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

  const editsRef = useRef<Record<string, Record<string, any>>>({});
  const [, setEditVersion] = useState(0);
  const editingRef = useRef<Record<string, Record<string, boolean>>>({});
  const activeRef = useRef<Record<string, Record<string, boolean>>>({});

  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const addMenuItems_ = useMemo(
    () => addMenuItems ?? [{ label: '+ Add new column', value: 'add_column' }],
    [addMenuItems],
  );

  const rowHeight = virtualization?.rowHeight ?? 36;

  const handleColumnSizingChange = useCallback(
    (updater: any) => {
      const newColumnSizing =
        typeof updater === 'function' ? updater(columnSizing) : updater;
      setColumnSizing(newColumnSizing);

      Object.keys(newColumnSizing).forEach((columnId) => {
        const newSize = newColumnSizing[columnId];
        const oldSize = columnSizing[columnId];
        if (newSize !== oldSize && newSize != null) {
          onColumnResize?.(columnId, newSize);
        }
      });
    },
    [columnSizing, onColumnResize],
  );

  const table = useReactTable({
    data: data,
    columns: useMemo(() => {
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
                '.row-index': {
                  display: checked ? 'none' : 'block',
                },
                '.row-checkbox': {
                  display: checked ? 'flex' : 'none',
                },
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
            cell: (info) => {
              const value = info.getValue();
              return value as any;
            },
          },
        ),
      );

      return [selectCol, ...rest];
    }, [columns, rowIds, rowSelection]),
    getCoreRowModel: getCoreRowModel(),
    getRowId: (_row, index) => rowIds[index] ?? String(index),
    defaultColumn: {
      size: 200,
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
    onColumnSizingChange: handleColumnSizingChange,
    onColumnSizingInfoChange: setColumnSizingInfo,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
    meta: {
      getEdit: (recordId: string, columnId: string) => {
        return editsRef.current[recordId]?.[columnId];
      },
      updateData: (recordId: string, columnId: string, value: any) => {
        const rowEdits = editsRef.current[recordId] || {};
        editsRef.current = {
          ...editsRef.current,
          [recordId]: { ...rowEdits, [columnId]: value },
        };

        onCellEdit?.(recordId, columnId, String(value));

        setEditVersion((v) => v + 1);
      },
      isEditing: (recordId: string, columnId: string) =>
        Boolean(editingRef.current[recordId]?.[columnId]),
      isActive: (recordId: string, columnId: string) =>
        Boolean(activeRef.current[recordId]?.[columnId]),
      startEdit: (recordId: string, columnId: string) => {
        const row = editingRef.current[recordId] || {};
        editingRef.current = {
          ...editingRef.current,
          [recordId]: { ...row, [columnId]: true },
        };
        setEditVersion((v) => v + 1);
      },
      stopEdit: (recordId: string, columnId: string) => {
        const row = editingRef.current[recordId] || {};
        if (row[columnId]) {
          const { [columnId]: _omit, ...rest } = row;
          editingRef.current = {
            ...editingRef.current,
            [recordId]: rest,
          };
          setEditVersion((v) => v + 1);
        }
      },
      setActive: (recordId: string, columnId: string) => {
        const currentActive = activeRef.current[recordId]?.[columnId];
        const hasOtherActive = Object.keys(activeRef.current).some((rId) =>
          Object.keys(activeRef.current[rId] || {}).some(
            (cId) =>
              activeRef.current[rId][cId] &&
              (rId !== recordId || cId !== columnId),
          ),
        );

        if (!currentActive || hasOtherActive) {
          activeRef.current = { [recordId]: { [columnId]: true } };
          setEditVersion((v) => v + 1);
        }
      },
      clearActive: () => {
        activeRef.current = {};
        setEditVersion((v) => v + 1);
      },
    },
  });

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

  useEffect(() => {
    const initialSizing: ColumnSizingState = {};

    columns.forEach((column) => {
      if (column.width && column.width > 0) {
        initialSizing[column.fieldId] = column.width;
      }
    });

    const key = columnWidthStorageKey;
    const saved = key ? localStorage.getItem(`table_colwidths_${key}`) : null;
    if (saved) {
      try {
        Object.assign(initialSizing, JSON.parse(saved) || {});
      } catch {
        /* empty */
      }
    }

    if (Object.keys(initialSizing).length) {
      setColumnSizing(initialSizing);
    }
  }, [columnWidthStorageKey, columns]);

  useEffect(() => {
    if (columnWidthStorageKey) {
      localStorage.setItem(
        `table_colwidths_${columnWidthStorageKey}`,
        JSON.stringify(columnSizing),
      );
    }
  }, [columnSizing, columnWidthStorageKey]);

  const handleAddMenuClick = useCallback(
    (item: { label: string; value: string }) => {
      onAddMenuItemClick?.(item);
      setAddMenuAnchor(null);
    },
    [onAddMenuItemClick],
  );

  const renderContent = useCallback(
    ({
      tableContainerRef,
      columnVirtualizer,
      rowVirtualizer,
      virtualColumns,
      virtualRows,
      virtualPaddingLeft,
      virtualPaddingRight,
    }: any) => {
      return (
        <>
          {columnSizingInfo.isResizingColumn && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left:
                  (columnSizingInfo.startOffset ?? 0) +
                    (columnVirtualizer.scrollOffset ?? 0) || 0,
                transform: `translateX(${columnSizingInfo.deltaOffset || 0}px)`,
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '2px',
                backgroundColor: '#1976d2',
                zIndex: 1000,
                pointerEvents: 'none',
                opacity: 0.8,
              }}
            />
          )}

          <StyledTableHead scrolled={scrolled ?? scrolledState}>
            {columnSizingInfo.isResizingColumn && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left:
                    (columnSizingInfo.startOffset ?? 0) +
                      (columnVirtualizer.scrollOffset ?? 0) || 0,
                  transform: `translateX(${columnSizingInfo.deltaOffset || 0}px)`,
                  width: '2px',
                  backgroundColor: '#1976d2',
                  zIndex: 1001,
                  pointerEvents: 'none',
                  opacity: 0.8,
                }}
              />
            )}

            {table.getHeaderGroups().map((headerGroup) => (
              <StyledTableHeadRow key={headerGroup.id}>
                {/* Pinned left headers */}
                {leftPinnedColumns.map((col, index) => {
                  const header = headerGroup.headers.find(
                    (h) => h.id === col.id,
                  );
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

                {virtualPaddingLeft ? (
                  <StyledTableSpacer width={virtualPaddingLeft} />
                ) : null}

                {virtualColumns.map((virtualColumn: any) => {
                  const col = centerColumns[virtualColumn.index];
                  const header = headerGroup.headers.find(
                    (h) => h.id === col.id,
                  );
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

                {virtualPaddingRight ? (
                  <StyledTableSpacer width={virtualPaddingRight} />
                ) : null}

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
                  isSelected={row.getIsSelected?.() ?? false}
                  virtualStart={virtualRow.start}
                >
                  {/* Pinned left cells */}
                  {leftPinnedColumns.map((col, index) => {
                    const cell = visibleCells.find(
                      (c) => c.column.id === col.id,
                    );
                    if (!cell) {
                      return null;
                    }
                    const isLoading = Boolean(
                      (cell.row.original as any)?.__loading,
                    );

                    return (
                      <StyledTableBodyCell
                        cell={cell}
                        editValue={(table.options.meta as any)?.getEdit?.(
                          String(cell.row.id),
                          String(cell.column.id),
                        )}
                        isActive={Boolean(
                          (table.options.meta as any)?.isActive?.(
                            String(cell.row.id),
                            String(cell.column.id),
                          ),
                        )}
                        isEditing={Boolean(
                          (table.options.meta as any)?.isEditing?.(
                            String(cell.row.id),
                            String(cell.column.id),
                          ),
                        )}
                        isPinned
                        key={cell.id}
                        onCellClick={(table.options.meta as any)?.setActive}
                        onCellDoubleClick={
                          (table.options.meta as any)?.startEdit
                        }
                        onEditCommit={(table.options.meta as any)?.updateData}
                        onEditStop={(table.options.meta as any)?.stopEdit}
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
                    const cell = visibleCells.find(
                      (c) => c.column.id === col.id,
                    );
                    if (!cell) {
                      return null;
                    }
                    const isLoading = Boolean(
                      (cell.row.original as any)?.__loading,
                    );

                    return (
                      <StyledTableBodyCell
                        cell={cell}
                        editValue={(table.options.meta as any)?.getEdit?.(
                          String(cell.row.id),
                          String(cell.column.id),
                        )}
                        isActive={Boolean(
                          (table.options.meta as any)?.isActive?.(
                            String(cell.row.id),
                            String(cell.column.id),
                          ),
                        )}
                        isEditing={Boolean(
                          (table.options.meta as any)?.isEditing?.(
                            String(cell.row.id),
                            String(cell.column.id),
                          ),
                        )}
                        rowSelected={row.getIsSelected?.() ?? false}
                        key={cell.id}
                        onCellClick={(table.options.meta as any)?.setActive}
                        onCellDoubleClick={
                          (table.options.meta as any)?.startEdit
                        }
                        onEditCommit={(table.options.meta as any)?.updateData}
                        onEditStop={(table.options.meta as any)?.stopEdit}
                        width={cell.column.getSize()}
                      />
                    );
                  })}

                  {/* Right padding spacer */}
                  {virtualPaddingRight ? (
                    <StyledTableSpacer
                      borderRight
                      width={virtualPaddingRight}
                    />
                  ) : null}

                  {/* Add-column trailing spacer to align with header and draw right edge */}
                  <StyledTableSpacer borderRight width={120} />
                </StyledTableBodyRow>
              );
            })}
          </StyledTableBody>
        </>
      );
    },
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
