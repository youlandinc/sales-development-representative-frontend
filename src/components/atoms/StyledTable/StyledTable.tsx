import {
  FC,
  MouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  Checkbox,
  ClickAwayListener,
  Divider,
  Icon,
  MenuItem,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';

import type {
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingInfoState,
  ColumnSizingState,
  RowSelectionState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useSwitch } from '@/hooks';

import { StyledButton, StyledDialog } from '@/components/atoms';
import {
  getColumnMenuActions,
  TableColumnMenuEnum,
} from '@/components/molecules';

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
  columnDeleting: boolean;
  addMenuItems?: { label: string; value: string }[];
  onAddMenuItemClick?: (item: { label: string; value: string }) => void;
  onHeaderMenuClick?: ({
    type,
    columnId,
    value,
    cb,
  }: {
    type: TableColumnMenuEnum;
    columnId: string;
    value?: any;
    cb?: () => void;
  }) => void;
  scrolled?: boolean;
  virtualization?: {
    enabled?: boolean;
    rowHeight?: number;
    scrollContainer?: RefObject<HTMLDivElement | null>;
    onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
  };
  onColumnResize?: (fieldId: string, width: number) => void;
  onCellEdit?: (recordId: string, fieldId: string, value: string) => void;
  onAiProcess?: (recordId: string, columnId: string) => void;
  aiLoading?: Record<string, Record<string, boolean>>;
}

const columnHelper = createColumnHelper<any>();

export const StyledTable: FC<StyledTableProps> = ({
  columns,
  rowIds,
  data,
  columnDeleting,
  addMenuItems,
  onAddMenuItemClick,
  onHeaderMenuClick,
  scrolled,
  virtualization,
  onColumnResize,
  onCellEdit,
  onAiProcess,
  aiLoading,
}) => {
  const { open, visible, close } = useSwitch(false);

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnSizingInfo, setColumnSizingInfo] =
    useState<ColumnSizingInfoState>({} as ColumnSizingInfoState);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [cellState, setCellState] = useState<{
    recordId: string;
    columnId: string;
    isEditing?: boolean;
  } | null>(null);

  const [headerState, setHeaderState] = useState<{
    columnId: string;
    isActive?: boolean;
    isEditing?: boolean;
  } | null>(null);
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const [headerMenuAnchor, setHeaderMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ['__select'],
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  useEffect(() => {
    const pinnedColumns = columns
      .filter((col) => col.pin)
      .map((col) => col.fieldId);
    setColumnPinning({
      left: ['__select'].concat(pinnedColumns),
    });

    const visibilityState: VisibilityState = {};
    columns.forEach((col) => {
      visibilityState[col.fieldId] = col.visible;
    });

    setColumnVisibility(visibilityState);
  }, [columns]);

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

  const reducedColumns = useMemo(() => {
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
            size={'small'}
            sx={{ p: 0 }}
          />
        );
      },
      cell: (info) => {
        const label = `${info.row.index + 1}`;
        const checked = info.row.getIsSelected?.() ?? false;
        return (
          <Stack
            flexDirection={'row'}
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
            width={'100%'}
          >
            <Box className="row-index" lineHeight={1}>
              {label}
            </Box>
            <Box className="row-checkbox" display={'none'}>
              <Checkbox
                checked={checked}
                onChange={(e, next) => info.row.toggleSelected?.(next)}
                onClick={(e) => e.stopPropagation()}
                size={'small'}
                sx={{ p: 0 }}
              />
            </Box>
          </Stack>
        );
      },
      size: 100,
      minSize: 100,
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
          meta: {
            actionKey: column.actionKey,
            fieldType: column.fieldType,
            column: column,
          },
        },
      ),
    );

    return [selectCol, ...rest];
  }, [columns, rowIds, rowSelection]);

  const table = useReactTable({
    data: data,
    columns: reducedColumns,
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
      rowSelection,
      columnSizing,
      columnSizingInfo,
      columnPinning,
      columnVisibility,
      columnOrder,
    },
    onRowSelectionChange: setRowSelection,
    onColumnSizingChange: handleColumnSizingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingInfoChange: setColumnSizingInfo,
    meta: {
      updateData: (recordId: string, columnId: string, value: any) => {
        onCellEdit?.(recordId, columnId, String(value));
      },
      isEditing: (recordId: string, columnId: string) =>
        cellState?.recordId === recordId &&
        cellState?.columnId === columnId &&
        cellState?.isEditing === true,
      isActive: (recordId: string, columnId: string) =>
        cellState?.recordId === recordId && cellState?.columnId === columnId,
      setCellMode: (
        recordId: string,
        columnId: string,
        mode: 'active' | 'edit' | 'clear',
      ) => {
        switch (mode) {
          case 'active':
            setCellState({ recordId, columnId });
            break;
          case 'edit':
            setCellState({ recordId, columnId, isEditing: true });
            break;
          case 'clear':
            setCellState(null);
            break;
        }
      },
      canEdit: (recordId: string, columnId: string) => {
        if (columnId === '__select') {
          return false;
        }

        const column = table.getColumn(columnId);
        const actionKey = (column?.columnDef?.meta as any)?.actionKey;

        return actionKey !== 'use-ai';
      },
      isAiLoading: (recordId: string, columnId: string) =>
        Boolean(aiLoading?.[recordId]?.[columnId]),
      isFinished: (recordId: string, columnId: string) => {
        const rowData = data.find((row: any) => row.id === recordId);
        const cellValue = rowData?.[columnId];
        return typeof cellValue === 'object' &&
          cellValue !== null &&
          'isFinished' in cellValue
          ? cellValue.isFinished
          : false;
      },
      getExternalContent: (recordId: string, columnId: string) => {
        const rowData = data.find((row: any) => row.id === recordId);
        const cellValue = rowData?.[columnId];
        return typeof cellValue === 'object' &&
          cellValue !== null &&
          'externalContent' in cellValue
          ? cellValue.externalContent
          : undefined;
      },
      triggerAiProcess: (recordId: string, columnId: string) => {
        onAiProcess?.(recordId, columnId);
      },
      isHeaderEditing: (headerId: string) =>
        headerState?.columnId === headerId && headerState?.isEditing === true,
      startHeaderEdit: (headerId: string) => {
        setHeaderState({ columnId: headerId, isActive: true, isEditing: true });
      },
      stopHeaderEdit: () => {
        setHeaderState((prev) => (prev ? { ...prev, isEditing: false } : null));
      },
      updateHeaderName: (headerId: string, newName: string) => {
        onHeaderMenuClick?.({
          type: TableColumnMenuEnum.rename_column,
          columnId: headerId,
          value: newName,
        });
        setHeaderState((prev) => (prev ? { ...prev, isEditing: false } : null));
      },
    },
  });

  useEffect(() => {
    const isResizing = table.getState().columnSizingInfo.isResizingColumn;
    if (isResizing && headerState?.isEditing) {
      setHeaderState((prev) => (prev ? { ...prev, isEditing: false } : null));
      setHeaderMenuAnchor(null);
    }
  }, [
    table.getState().columnSizingInfo.isResizingColumn,
    headerState?.isEditing,
  ]);

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
    if (Object.keys(initialSizing).length) {
      setColumnSizing(initialSizing);
    }
  }, [columns]);

  const handleAddMenuClick = useCallback(
    (item: { label: string; value: string }) => {
      onAddMenuItemClick?.(item);
      setAddMenuAnchor(null);
    },
    [onAddMenuItemClick],
  );

  const handleHeaderMenuClick = useCallback(
    (item: { label: string; value: TableColumnMenuEnum }) => {
      switch (item.value) {
        case TableColumnMenuEnum.edit_description: {
          onHeaderMenuClick?.({
            type: TableColumnMenuEnum.edit_description,
            columnId: selectedColumnId,
          });
          break;
        }
        case TableColumnMenuEnum.edit_column: {
          onHeaderMenuClick?.({
            type: TableColumnMenuEnum.edit_column,
            columnId: selectedColumnId,
          });
          break;
        }
        case TableColumnMenuEnum.ai_agent: {
          onHeaderMenuClick?.({
            type: TableColumnMenuEnum.ai_agent,
            columnId: selectedColumnId,
          });
          setHeaderState({
            columnId: selectedColumnId,
            isActive: true,
            isEditing: false,
          });
          break;
        }
        case TableColumnMenuEnum.rename_column: {
          setHeaderState({
            columnId: selectedColumnId,
            isActive: true,
            isEditing: true,
          });
          break;
        }
        case TableColumnMenuEnum.pin: {
          const column = table.getColumn(selectedColumnId);
          const isPinned = column?.getIsPinned() === 'left';

          column?.pin(isPinned ? false : 'left');

          onHeaderMenuClick?.({
            type: TableColumnMenuEnum.pin,
            columnId: selectedColumnId,
            value: !isPinned,
          });

          setHeaderState({
            columnId: selectedColumnId,
            isActive: true,
            isEditing: false,
          });
          break;
        }
        case TableColumnMenuEnum.visible: {
          const column = table.getColumn(selectedColumnId);
          const isVisible = column?.getIsVisible();

          column?.toggleVisibility(!isVisible);

          onHeaderMenuClick?.({
            type: TableColumnMenuEnum.visible,
            columnId: selectedColumnId,
            value: !isVisible,
          });
          break;
        }
        case TableColumnMenuEnum.delete: {
          open();
          break;
        }
        default:
          setHeaderState(null);
          break;
      }
      setHeaderMenuAnchor(null);
      //setSelectedColumnId('');
    },
    [onHeaderMenuClick, open, selectedColumnId, table],
  );

  const handleHeaderClick = useCallback(
    (e: MouseEvent, columnId: string) => {
      if (columnSizingInfo.isResizingColumn) {
        return;
      }

      const isCurrentlyActive =
        headerState?.columnId === columnId && headerState?.isActive;

      if (isCurrentlyActive && !headerState?.isEditing) {
        setHeaderState({ columnId, isActive: true, isEditing: true });
      } else {
        setHeaderState({ columnId, isActive: true });
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(e.currentTarget as HTMLElement);
        setSelectedColumnId(columnId);
      }
    },
    [
      columnSizingInfo.isResizingColumn,
      headerState?.columnId,
      headerState?.isActive,
      headerState?.isEditing,
    ],
  );

  const handleHeaderRightClick = useCallback(
    (e: MouseEvent, columnId: string) => {
      e.preventDefault();
      if (headerState?.isEditing) {
        return;
      }
      setHeaderState({ columnId, isActive: true });
      setAddMenuAnchor(null);
      setHeaderMenuAnchor(e.currentTarget as HTMLElement);
      setSelectedColumnId(columnId);
    },
    [headerState],
  );

  const renderContent = useCallback(
    ({
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
                height: `${rowVirtualizer.getTotalSize() + 37}px`,
                width: '2px',
                backgroundColor: '#1976d2',
                zIndex: 1000,
                pointerEvents: 'none',
                opacity: 0.8,
              }}
            />
          )}

          <StyledTableHead scrolled={scrolled ?? false}>
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
                      enableResizing={col.id !== '__select'}
                      header={header}
                      isActive={
                        headerState?.columnId === header.id &&
                        headerState?.isActive
                      }
                      isEditing={
                        headerState?.columnId === header.id &&
                        headerState?.isEditing
                      }
                      isPinned
                      key={header.id}
                      onClick={
                        col.id !== '__select'
                          ? (e) => {
                              handleHeaderClick(e, header.id);
                            }
                          : undefined
                      }
                      onContextMenu={
                        col.id !== '__select'
                          ? (e) => handleHeaderRightClick(e, col.id)
                          : undefined
                      }
                      onEditSave={(newName) =>
                        (table.options.meta as any)?.updateHeaderName?.(
                          header.id,
                          newName,
                        )
                      }
                      showPinnedRightShadow={
                        index === leftPinnedColumns.length - 1
                      }
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
                  if (!col) {
                    return null;
                  }
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
                      isActive={
                        headerState?.columnId === header.id &&
                        headerState?.isActive
                      }
                      isEditing={
                        headerState?.columnId === header.id &&
                        headerState?.isEditing
                      }
                      key={header.id}
                      measureRef={(node) =>
                        columnVirtualizer.measureElement(node)
                      }
                      onClick={(e) => {
                        handleHeaderClick(e, header.id);
                      }}
                      onContextMenu={(e) =>
                        handleHeaderRightClick(e, header.id)
                      }
                      onEditSave={(newName) =>
                        (table.options.meta as any)?.updateHeaderName?.(
                          header.id,
                          newName,
                        )
                      }
                      width={header.getSize()}
                    />
                  );
                })}

                {virtualPaddingRight ? (
                  <StyledTableSpacer borderRight width={virtualPaddingRight} />
                ) : null}

                <StyledTableHeadCell
                  enableResizing={false}
                  onClick={(e) => {
                    setHeaderMenuAnchor(null);
                    setAddMenuAnchor(e.currentTarget);
                  }}
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
                  isSelected={row.getIsSelected?.() ?? false}
                  key={row.id}
                  measureRef={(node) => rowVirtualizer.measureElement(node)}
                  rowHeight={rowHeight}
                  rowIndex={virtualRow.index}
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
                        editValue={cell?.getValue()}
                        isActive={(table.options.meta as any)?.isActive?.(
                          String(cell.row.id),
                          String(cell.column.id),
                        )}
                        isEditing={(table.options.meta as any)?.isEditing?.(
                          String(cell.row.id),
                          String(cell.column.id),
                        )}
                        isPinned
                        key={cell.id}
                        rowSelected={row.getIsSelected?.() ?? false}
                        showPinnedRightShadow={
                          index === leftPinnedColumns.length - 1
                        }
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
                    if (!col) {
                      return null;
                    }
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
                        editValue={cell?.getValue()}
                        isActive={(table.options.meta as any)?.isActive?.(
                          String(cell.row.id),
                          String(cell.column.id),
                        )}
                        isEditing={(table.options.meta as any)?.isEditing?.(
                          String(cell.row.id),
                          String(cell.column.id),
                        )}
                        key={cell.id}
                        rowSelected={row.getIsSelected?.() ?? false}
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
                  <StyledTableSpacer
                    bgcolor="background.paper"
                    borderRight
                    width={120}
                  />
                </StyledTableBodyRow>
              );
            })}
          </StyledTableBody>
        </>
      );
    },
    [
      columnSizingInfo.isResizingColumn,
      columnSizingInfo.startOffset,
      columnSizingInfo.deltaOffset,
      scrolled,
      table,
      leftPinnedColumns,
      headerState,
      stickyLeftMap,
      handleHeaderClick,
      handleHeaderRightClick,
      centerColumns,
      rowHeight,
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

      <Popper
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={() => setAddMenuAnchor(null)}>
          <Paper
            sx={{
              boxShadow: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              minWidth: 120,
            }}
          >
            <Stack>
              {addMenuItems_.map((item) => (
                <MenuItem
                  key={item.value}
                  onClick={() => handleAddMenuClick(item)}
                  sx={{
                    minHeight: 'auto',
                    py: 1,
                    px: 2,
                    fontSize: 14,
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Stack>
          </Paper>
        </ClickAwayListener>
      </Popper>

      <Popper
        anchorEl={headerMenuAnchor}
        open={Boolean(headerMenuAnchor) && !headerState?.isEditing}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener
          onClickAway={(event) => {
            const target = event.target as HTMLElement;
            const isHeaderClick =
              target.closest('[data-table-header]') !== null;

            if (!isHeaderClick) {
              setHeaderMenuAnchor(null);
              setSelectedColumnId('');
              if (headerState?.isEditing) {
                setHeaderState((prev) =>
                  prev ? { ...prev, isEditing: false } : null,
                );
              }
            }
          }}
        >
          <Paper
            sx={{
              boxShadow: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              minWidth: 260,
            }}
          >
            <Stack gap={0}>
              {getColumnMenuActions(
                columnPinning!.left!.includes(selectedColumnId),
              ).map((item) => {
                if (item.value !== TableColumnMenuEnum.divider) {
                  return (
                    <MenuItem
                      key={item.label}
                      onClick={() => handleHeaderMenuClick(item)}
                      sx={{
                        minHeight: 'auto',
                        px: 2,
                        fontSize: 14,
                        py: 1,
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {item.icon && (
                        <Icon
                          component={item.icon}
                          sx={{ width: 16, height: 16 }}
                        />
                      )}
                      {item.label}
                    </MenuItem>
                  );
                }
                return (
                  <Divider key={item.label} sx={{ margin: '0 !important' }} />
                );
              })}
            </Stack>
          </Paper>
        </ClickAwayListener>
      </Popper>

      <StyledDialog
        content={
          <Typography color={'text.secondary'} fontSize={14} my={1.5}>
            Are you sure you want to delete{' '}
            <Typography component={'span'} fontWeight={600}>
              {columns.find((item) => item.fieldId === selectedColumnId)
                ?.fieldName || 'this column'}
            </Typography>
            ? You can&#39;t undo this.
          </Typography>
        }
        footer={
          <Stack flexDirection={'row'} gap={3}>
            <StyledButton
              color={'info'}
              onClick={close}
              size={'medium'}
              sx={{ width: 68 }}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              color={'error'}
              disabled={columnDeleting}
              loading={columnDeleting}
              onClick={() => {
                onHeaderMenuClick?.({
                  type: TableColumnMenuEnum.delete,
                  columnId: selectedColumnId,
                  cb: () => close(),
                });
              }}
              size={'medium'}
              sx={{ width: 68 }}
            >
              Delete
            </StyledButton>
          </Stack>
        }
        header={'Confirm delete column'}
        onClose={close}
        open={visible}
      />
    </Stack>
  );
};
