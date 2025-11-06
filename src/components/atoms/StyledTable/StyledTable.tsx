import {
  FC,
  MouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Checkbox,
  CircularProgress,
  ClickAwayListener,
  Divider,
  Icon,
  MenuItem,
  Paper,
  Popper,
  Stack,
  TextField,
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

import {
  getAddColumnMenuActions,
  getAiColumnMenuActions,
  getNormalColumnMenuActions,
  isAiColumn,
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
  addMenuItems?: { label: string; value: string; icon: any }[];
  onAddMenuItemClick?: (item: { label: string; value: string }) => void;
  onHeaderMenuClick?: ({
    type,
    columnId,
    value,
  }: {
    type: TableColumnMenuEnum;
    columnId: string;
    value?: any;
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
  onCellClick: (columnId: string, rowId: string, data: any) => void;
  aiLoading?: Record<string, Record<string, boolean>>;
  onRunAi?: (params: {
    fieldId: string;
    recordId?: string;
    isHeader?: boolean;
    recordCount?: number;
  }) => Promise<void>;
  onAddRows?: (count: number) => Promise<void>;
}

const columnHelper = createColumnHelper<any>();

import ICON_TYPE_ADD from './assets/icon-type-add.svg';
import { StyledButton } from '@/components/atoms';

export const StyledTable: FC<StyledTableProps> = ({
  columns,
  rowIds,
  data,
  addMenuItems,
  onAddMenuItemClick,
  onHeaderMenuClick,
  scrolled,
  virtualization,
  onColumnResize,
  onCellEdit,
  onAiProcess,
  aiLoading,
  onCellClick,
  onRunAi,
  onAddRows,
}) => {
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
    isShowMenu?: boolean;
  } | null>(null);
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const [headerMenuAnchor, setHeaderMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [aiRunMenuAnchor, setAiRunMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [aiRunColumnId, setAiRunColumnId] = useState<string>('');
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ['__select'],
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [addRowCount, setAddRowCount] = useState<number>(10);
  const [isAddingRows, setIsAddingRows] = useState<boolean>(false);
  const addRowInputRef = useRef<HTMLInputElement>(null);

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
    () => addMenuItems ?? getAddColumnMenuActions(),
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
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
          size={'small'}
          sx={{ p: 0 }}
        />
      ),
      cell: (info) => info,
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
            selectedColumnId,
          },
        },
      ),
    );

    return [selectCol, ...rest];
  }, [columns, selectedColumnId]);

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
      hasActiveInRow: (recordId: string) => cellState?.recordId === recordId,
      setCellMode: (
        recordId: string,
        columnId: string,
        mode: 'active' | 'edit' | 'clear',
      ) => {
        switch (mode) {
          case 'active':
            setCellState({ recordId, columnId });
            setHeaderState({
              columnId,
              isActive: true,
              isEditing: false,
              isShowMenu: false,
            });
            break;
          case 'edit':
            setCellState({ recordId, columnId, isEditing: true });
            break;
          case 'clear':
            setCellState(null);
            break;
        }
      },
      isAiLoading: (recordId: string, columnId: string) =>
        Boolean(aiLoading?.[recordId]?.[columnId]),
      triggerAiProcess: (recordId: string, columnId: string) => {
        onAiProcess?.(recordId, columnId);
      },
      hasAiColumnInRow: (recordId: string) => {
        return columns.some(isAiColumn);
      },
      triggerBatchAiProcess: () => {
        const aiColumns = columns.filter(isAiColumn);
        rowIds.forEach((recordId) => {
          aiColumns.forEach((col) => {
            onAiProcess?.(recordId, col.fieldId);
          });
        });
      },
      triggerRelatedAiProcess: (recordId: string, columnId: string) => {
        const aiColumns = columns.filter(isAiColumn);

        aiColumns.forEach((col) => {
          onAiProcess?.(recordId, col.fieldId);

          if (col.dependentFieldId) {
            onAiProcess?.(recordId, col.dependentFieldId);
          }
        });
      },
      getAiColumns: () => {
        return columns.filter(isAiColumn);
      },
      onRunAi: onRunAi,
      openAiRunMenu: (anchorEl: HTMLElement, columnId: string) => {
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(null);
        setAiRunMenuAnchor(anchorEl);
        setAiRunColumnId(columnId);
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
        setHeaderState(null);
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
    (item: { label: string; value: TableColumnMenuEnum | string }) => {
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
          break;
        }
        case TableColumnMenuEnum.rename_column: {
          setHeaderState({
            columnId: selectedColumnId,
            isActive: false,
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
          onHeaderMenuClick?.({
            type: TableColumnMenuEnum.delete,
            columnId: selectedColumnId,
          });
          break;
        }
        default:
          setHeaderState(null);
          break;
      }
      setHeaderMenuAnchor(null);
    },
    [onHeaderMenuClick, selectedColumnId, table],
  );

  const handleHeaderClick = useCallback(
    (e: MouseEvent, columnId: string) => {
      const headerElement = e.currentTarget as HTMLElement;
      const rect = headerElement.getBoundingClientRect();
      const clickX = e.clientX;
      const rightEdge = rect.right;

      if (clickX > rightEdge - 12) {
        return;
      }

      if (columnSizingInfo.isResizingColumn) {
        setHeaderState({
          columnId,
          isActive: true,
          isEditing: false,
          isShowMenu: false,
        });
        return;
      }

      const isCurrentlyActive =
        headerState?.columnId === columnId && headerState?.isActive;
      const isCurrentlyShowingMenu =
        headerState?.columnId === columnId && headerState?.isShowMenu;
      const hasActiveCellInCurrentColumn =
        cellState?.columnId === columnId && cellState?.recordId;
      const hasActiveCellInOtherColumn =
        cellState?.columnId && cellState?.columnId !== columnId;

      if (
        isCurrentlyActive &&
        isCurrentlyShowingMenu &&
        !headerState?.isEditing
      ) {
        setHeaderState({
          columnId,
          isActive: true,
          isEditing: true,
          isShowMenu: false,
        });
        setHeaderMenuAnchor(null);
        return;
      }

      if (hasActiveCellInCurrentColumn) {
        setHeaderState({
          columnId,
          isActive: true,
          isShowMenu: true,
        });
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(e.currentTarget as HTMLElement);
        setSelectedColumnId(columnId);
        return;
      }

      if (isCurrentlyActive && !isCurrentlyShowingMenu) {
        setHeaderState({
          columnId,
          isActive: true,
          isShowMenu: true,
        });
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(e.currentTarget as HTMLElement);
        setSelectedColumnId(columnId);
        return;
      }

      if (!cellState || hasActiveCellInOtherColumn) {
        setHeaderState({
          columnId,
          isActive: true,
          isShowMenu: true,
        });
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(e.currentTarget as HTMLElement);
        setSelectedColumnId(columnId);
        return;
      }

      setHeaderState({
        columnId,
        isActive: true,
        isShowMenu: false,
      });
    },
    [
      columnSizingInfo.isResizingColumn,
      headerState?.columnId,
      headerState?.isActive,
      headerState?.isEditing,
      headerState?.isShowMenu,
      cellState?.columnId,
      cellState?.recordId,
    ],
  );

  const handleHeaderRightClick = useCallback(
    (e: MouseEvent, columnId: string) => {
      e.preventDefault();
      if (columnSizingInfo.isResizingColumn || headerState?.isEditing) {
        return;
      }
      setHeaderState({ columnId, isActive: true, isShowMenu: true });
      setAddMenuAnchor(null);
      setHeaderMenuAnchor(e.currentTarget as HTMLElement);
      setSelectedColumnId(columnId);
    },
    [columnSizingInfo.isResizingColumn, headerState],
  );

  const onAddRowsClick = useCallback(async () => {
    if (!onAddRows || isAddingRows) {
      return;
    }
    // Get the current value from input
    const inputValue = addRowInputRef.current?.value;
    const count = inputValue ? parseInt(inputValue, 10) : addRowCount;
    if (isNaN(count) || count < 1) {
      return;
    }
    setIsAddingRows(true);
    try {
      await onAddRows(count);
    } catch (error) {
      console.error('Failed to add rows:', error);
    } finally {
      setIsAddingRows(false);
    }
  }, [onAddRows, addRowCount, isAddingRows]);

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
                  width={140}
                >
                  <Icon
                    component={ICON_TYPE_ADD}
                    sx={{ width: 16, height: 16 }}
                  />
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

                    // 优化: O(1)检查而不是O(M)遍历所有columns
                    const hasActiveInRow =
                      cell.column.id === '__select'
                        ? ((table.options.meta as any)?.hasActiveInRow?.(
                            String(cell.row.id),
                          ) ?? false)
                        : false;

                    return (
                      <StyledTableBodyCell
                        cell={cell}
                        editValue={cell?.getValue()}
                        hasActiveInRow={hasActiveInRow}
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
                        onCellClick={onCellClick}
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

                    // 优化: O(1)检查而不是O(M)遍历所有columns
                    const hasActiveInRow =
                      cell.column.id === '__select'
                        ? ((table.options.meta as any)?.hasActiveInRow?.(
                            String(cell.row.id),
                          ) ?? false)
                        : false;

                    return (
                      <StyledTableBodyCell
                        cell={cell}
                        editValue={cell?.getValue()}
                        hasActiveInRow={hasActiveInRow}
                        isActive={(table.options.meta as any)?.isActive?.(
                          String(cell.row.id),
                          String(cell.column.id),
                        )}
                        isEditing={(table.options.meta as any)?.isEditing?.(
                          String(cell.row.id),
                          String(cell.column.id),
                        )}
                        key={cell.id}
                        onCellClick={onCellClick}
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
                    width={140}
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
      headerState?.columnId,
      headerState?.isActive,
      headerState?.isEditing,
      stickyLeftMap,
      handleHeaderClick,
      handleHeaderRightClick,
      centerColumns,
      rowHeight,
      reducedColumns,
      onCellClick,
    ],
  );

  return (
    <ClickAwayListener
      onClickAway={() => {
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(null);
        setAiRunMenuAnchor(null);
        setAiRunColumnId('');
        setSelectedColumnId('');
      }}
    >
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

        <Stack
          alignItems="center"
          flexDirection="row"
          gap={1.5}
          px={2}
          py={1.5}
          sx={{
            bgcolor: 'background.paper',
          }}
        >
          <StyledButton
            color={'info'}
            disabled={isAddingRows}
            loading={isAddingRows}
            onClick={onAddRowsClick}
            size={'small'}
            sx={{
              width: 64,
            }}
            variant={'outlined'}
          >
            + Add
          </StyledButton>
          <TextField
            defaultValue={addRowCount}
            disabled={isAddingRows}
            inputRef={addRowInputRef}
            onBlur={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value > 0) {
                setAddRowCount(value);
              } else {
                e.target.value = String(addRowCount);
              }
            }}
            size="small"
            sx={{
              width: 80,
              '& .MuiOutlinedInput-root': {
                height: 32,
              },
            }}
            type="number"
          />
          <Typography color="text.secondary" fontSize={14}>
            more rows at the bottom
          </Typography>
        </Stack>

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
                minWidth: 200,
              }}
            >
              <Stack gap={0}>
                {addMenuItems_.map((item, index) => {
                  if (item.value !== TableColumnMenuEnum.divider) {
                    return (
                      <MenuItem
                        key={item.value || item.label}
                        onClick={() => handleAddMenuClick(item)}
                        sx={{
                          minHeight: 'auto',
                          py: 1,
                          px: 2,
                          fontSize: 14,
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
                    <Divider
                      key={item.label + index}
                      sx={{ margin: '0 !important' }}
                    />
                  );
                })}
              </Stack>
            </Paper>
          </ClickAwayListener>
        </Popper>

        <Popper
          anchorEl={headerMenuAnchor}
          open={
            Boolean(headerMenuAnchor) &&
            !headerState?.isEditing &&
            !!headerState?.isActive
          }
          placement="bottom-start"
          sx={{ zIndex: 1300 }}
        >
          <ClickAwayListener
            onClickAway={(event) => {
              const target = event.target as HTMLElement;
              const isHeaderClick =
                target.closest('[data-table-header]') !== null;

              if (!isHeaderClick) {
                setHeaderState(null);
                setHeaderMenuAnchor(null);
                setSelectedColumnId('');
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
                {(() => {
                  // Determine menu type based on column actionKey
                  const selectedColumn = columns.find(
                    (col) => col.fieldId === selectedColumnId,
                  );
                  const actionKey = selectedColumn?.actionKey;
                  const isAiColumn =
                    actionKey === 'use-ai' || actionKey?.includes('find');
                  const isPinned =
                    columnPinning!.left!.includes(selectedColumnId);

                  // Select appropriate menu
                  const menuActions = isAiColumn
                    ? getAiColumnMenuActions(isPinned)
                    : getNormalColumnMenuActions(isPinned);

                  return menuActions;
                })().map((item, index) => {
                  if (item.value !== TableColumnMenuEnum.divider) {
                    const hasSubmenu = item.submenu && item.submenu.length > 0;

                    return (
                      <MenuItem
                        component={'div'}
                        key={item.label}
                        onClick={() =>
                          !hasSubmenu && handleHeaderMenuClick(item)
                        }
                        sx={{
                          minHeight: 'auto',
                          px: 2,
                          fontSize: 14,
                          py: 1,
                          alignItems: 'center',
                          gap: 1,
                          position: 'relative',
                          '&:hover > .submenu-container': {
                            display: 'block',
                          },
                        }}
                      >
                        {item.icon && (
                          <Icon
                            component={item.icon}
                            sx={{ width: 16, height: 16 }}
                          />
                        )}
                        {item.label}
                        {hasSubmenu && (
                          <>
                            <Icon
                              sx={{
                                marginLeft: 'auto',
                                fontSize: 16,
                              }}
                            >
                              chevron_right
                            </Icon>
                            <Paper
                              className="submenu-container"
                              sx={{
                                display: 'none',
                                position: 'absolute',
                                left: '100%',
                                top: 0,
                                minWidth: 200,
                                boxShadow: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                zIndex: 1,
                              }}
                            >
                              <Stack gap={0}>
                                {item.submenu!.map((subItem, subIndex) => {
                                  if (
                                    subItem.value !==
                                    TableColumnMenuEnum.divider
                                  ) {
                                    return (
                                      <MenuItem
                                        component={'div'}
                                        key={subItem.label}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleHeaderMenuClick(subItem);
                                        }}
                                        sx={{
                                          minHeight: 'auto',
                                          px: 2,
                                          fontSize: 14,
                                          py: 1,
                                          alignItems: 'center',
                                          gap: 1,
                                        }}
                                      >
                                        {subItem.icon && (
                                          <Icon
                                            component={subItem.icon}
                                            sx={{ width: 16, height: 16 }}
                                          />
                                        )}
                                        {subItem.label}
                                      </MenuItem>
                                    );
                                  }
                                  return (
                                    <Divider
                                      key={subItem.label + subIndex}
                                      sx={{ margin: '0 !important' }}
                                    />
                                  );
                                })}
                              </Stack>
                            </Paper>
                          </>
                        )}
                      </MenuItem>
                    );
                  }
                  return (
                    <Divider
                      key={item.label + index}
                      sx={{ margin: '0 !important' }}
                    />
                  );
                })}
              </Stack>
            </Paper>
          </ClickAwayListener>
        </Popper>

        <Popper
          anchorEl={aiRunMenuAnchor}
          open={Boolean(aiRunMenuAnchor)}
          placement="bottom-start"
          sx={{ zIndex: 1300 }}
        >
          <ClickAwayListener
            onClickAway={() => {
              setAiRunMenuAnchor(null);
              setAiRunColumnId('');
            }}
          >
            <Paper
              sx={{
                boxShadow: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                minWidth: 280,
              }}
            >
              <Stack gap={0}>
                {rowIds.length > 10 ? (
                  <>
                    <MenuItem
                      onClick={() => {
                        onRunAi?.({
                          fieldId: aiRunColumnId,
                          isHeader: true,
                          recordCount: 10,
                        });
                        setAiRunMenuAnchor(null);
                        setAiRunColumnId('');
                      }}
                      sx={{
                        minHeight: 'auto',
                        py: 1.5,
                        px: 2,
                        fontSize: 14,
                      }}
                    >
                      Run first 10 rows
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        onRunAi?.({
                          fieldId: aiRunColumnId,
                          isHeader: true,
                        });
                        setAiRunMenuAnchor(null);
                        setAiRunColumnId('');
                      }}
                      sx={{
                        minHeight: 'auto',
                        py: 1.5,
                        px: 2,
                        fontSize: 14,
                      }}
                    >
                      Run all rows that haven&#39;t run or have errors
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem
                    onClick={() => {
                      onRunAi?.({
                        fieldId: aiRunColumnId,
                        isHeader: true,
                        recordCount: rowIds.length,
                      });
                      setAiRunMenuAnchor(null);
                      setAiRunColumnId('');
                    }}
                    sx={{
                      minHeight: 'auto',
                      py: 1.5,
                      px: 2,
                      fontSize: 14,
                    }}
                  >
                    Run {rowIds.length} {rowIds.length === 1 ? 'row' : 'rows'}
                  </MenuItem>
                )}
              </Stack>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </Stack>
    </ClickAwayListener>
  );
};
