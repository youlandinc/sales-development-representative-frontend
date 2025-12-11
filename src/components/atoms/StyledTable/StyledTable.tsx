import {
  FC,
  MouseEvent,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Checkbox, ClickAwayListener, Icon, Stack } from '@mui/material';

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
  StyledTableAddRowsFooter,
  StyledTableBody,
  StyledTableBodyCell,
  StyledTableBodyRow,
  StyledTableContainer,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableHeadRow,
  StyledTableMenuAddColumn,
  StyledTableMenuAiRun,
  StyledTableMenuHeader,
  StyledTableSpacer,
} from './index';

import ICON_TYPE_ADD from './assets/icon-type-add.svg';

import {
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';
import {
  checkIsAiColumn,
  checkIsEditableColumn,
  SYSTEM_COLUMN_SELECT,
} from '@/constants/table';
import { UTypeOf } from '@/utils';

// TODO: Props optimization
// 1. Use strict TypeScript type definitions instead of any[]
// 2. Split complex Props into smaller configuration objects
// 3. Consider using generics to support different data types
// 4. Merge related callback functions into unified event handlers
interface StyledTableProps {
  columns: any[]; // TODO: Define TableColumn type
  rowIds: string[];
  data: any[]; // TODO: Use generic <TData>
  addMenuItems?: { label: string; value: string; icon: any }[]; // TODO: Define MenuItem type
  onAddMenuItemClick?: (item: { label: string; value: string }) => void;
  onHeaderMenuClick?: ({
    type,
    columnId,
    value,
    parentValue,
  }: {
    type: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
    columnId: string;
    value?: any;
    parentValue?: any;
  }) => void; // TODO: Simplify event handling types
  isScrolled?: boolean;
  virtualization?: {
    enabled?: boolean;
    rowHeight?: number;
    scrollContainer?: RefObject<HTMLDivElement | null>;
    onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
  }; // TODO: Extract as independent VirtualizationConfig type
  onColumnResize?: (fieldId: string, width: number) => void;
  onCellEdit?: (recordId: string, fieldId: string, value: string) => void;
  onAiProcess?: (recordId: string, columnId: string) => void;
  onCellClick: (columnId: string, rowId: string, data: any) => void;
  aiLoading?: Record<string, Record<string, boolean>>; // TODO: Define LoadingState type
  onRunAi?: (params: {
    fieldId: string;
    recordId?: string;
    isHeader?: boolean;
    recordCount?: number;
  }) => Promise<void>; // TODO: Extract as AiRunParams type
  onAddRows: (count: number) => Promise<void>;
  addRowsFooter?: ReactNode;
}

const columnHelper = createColumnHelper<any>();

export const StyledTable: FC<StyledTableProps> = ({
  columns,
  rowIds,
  data,
  addMenuItems,
  onAddMenuItemClick,
  onHeaderMenuClick,
  isScrolled,
  virtualization,
  onColumnResize,
  onCellEdit,
  onAiProcess,
  aiLoading,
  onCellClick,
  onRunAi,
  onAddRows,
  addRowsFooter,
}) => {
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnSizingInfo, setColumnSizingInfo] =
    useState<ColumnSizingInfoState>({} as ColumnSizingInfoState);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // TODO: State management optimization
  // 1. Consider using useReducer instead of multiple useState
  // 2. Extract state type definitions to independent types file
  // 3. State update logic is too scattered, needs centralized management
  const [cellState, setCellState] = useState<{
    recordId: string;
    columnId: string;
    isEditing?: boolean;
  } | null>(null);

  // Header state: single focus + multi-select (mutually exclusive)
  const [headerState, setHeaderState] = useState<{
    focusedColumnId: string | null;
    isMenuOpen: boolean;
    isEditing: boolean;
    selectedColumnIds: string[];
  } | null>(null);
  // TODO: Menu state optimization
  // 1. Merge three menu anchors into unified menuState object
  // 2. Reduce state count, improve maintainability
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
    left: [SYSTEM_COLUMN_SELECT],
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  // Calculate if table has AI columns (global check, not per-row)
  const hasAiColumn = useMemo(
    () => columns.some((col) => checkIsAiColumn(col)),
    [columns],
  );

  useEffect(() => {
    const pinnedColumns = columns
      .filter((col) => col.pin)
      .map((col) => col.fieldId);
    setColumnPinning({
      left: [SYSTEM_COLUMN_SELECT].concat(pinnedColumns),
    });

    const visibilityState: VisibilityState = {};
    columns.forEach((col) => {
      visibilityState[col.fieldId] = col.visible;
    });

    setColumnVisibility(visibilityState);
  }, [columns]);

  const rowHeight = virtualization?.rowHeight ?? 36;

  const onColumnSizingChange = useCallback(
    (updater: any) => {
      const newColumnSizing = UTypeOf.isFunction(updater)
        ? updater(columnSizing)
        : updater;
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

  const reducedColumns = useMemo(
    () => {
      const selectCol = columnHelper.display({
        id: SYSTEM_COLUMN_SELECT,
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

      const rest = columns.map((column) => {
        return columnHelper.accessor(
          (row: any) => {
            const v = row?.[column.fieldId];
            if (v && UTypeOf.isObject(v) && 'value' in v) {
              return (v as any).value ?? '';
            }
            return v ?? '';
          },
          {
            id: column.fieldId,
            header: column.fieldName,
            meta: {
              fieldType: column.fieldType,
              actionKey: column.actionKey,
              actionDefinition: column.actionDefinition,
              isAiColumn: checkIsAiColumn(column),
              canEdit: checkIsEditableColumn(column.fieldId, column.actionKey),
            },
          },
        );
      });

      return [selectCol, ...rest];
    },
    // Note: rowSelection dependency removed - header Checkbox now rendered
    // directly in StyledTableHeadCell, bypassing TanStack's column caching.
    [columns],
  );

  const tableMeta = useMemo(() => {
    const stopHeaderEdit = () => {
      setHeaderState((prev) => (prev ? { ...prev, isEditing: false } : null));
    };

    return {
      // ===== Data Update =====
      onCellEdit,

      // ===== Cell State Management =====
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
              focusedColumnId: columnId,
              isMenuOpen: false,
              isEditing: false,
              selectedColumnIds: [],
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

      // ===== Header State (via meta) =====
      headerState,
      setHeaderState,

      // ===== AI Features =====
      hasAiColumn,
      isAiLoading: (recordId: string, columnId: string) =>
        Boolean(aiLoading?.[recordId]?.[columnId]),
      onAiProcess,
      onRunAi,
      openAiRunMenu: (anchorEl: HTMLElement, columnId: string) => {
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(null);
        setAiRunMenuAnchor(anchorEl);
        setAiRunColumnId(columnId);
      },

      // ===== Header Editing =====
      stopHeaderEdit,
      updateHeaderName: (columnId: string, newName: string) => {
        stopHeaderEdit();
        onHeaderMenuClick?.({
          type: TableColumnMenuActionEnum.rename_column,
          columnId,
          value: newName,
        });
      },

      // ===== Dynamic State =====
      selectedColumnId,
    };
  }, [
    onCellEdit,
    cellState,
    hasAiColumn,
    aiLoading,
    onAiProcess,
    onRunAi,
    onHeaderMenuClick,
    selectedColumnId,
  ]);

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
    onColumnSizingChange: onColumnSizingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingInfoChange: setColumnSizingInfo,
    meta: tableMeta,
  });

  useEffect(() => {
    const isResizing = columnSizingInfo.isResizingColumn;
    if (isResizing && headerState?.isEditing) {
      setHeaderState((prev) => (prev ? { ...prev, isEditing: false } : null));
      setHeaderMenuAnchor(null);
    }
  }, [columnSizingInfo.isResizingColumn, headerState?.isEditing]);

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

  // CSS variables for performant column resizing (TanStack recommended approach)
  // This allows resize indicator to update smoothly without re-rendering cells
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: Record<string, number> = {};
    for (const header of headers) {
      colSizes[`--col-${header.column.id}-size`] = header.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

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

  const onAddMenuClick = useCallback(
    (item: { label: string; value: string }) => {
      onAddMenuItemClick?.(item);
      setAddMenuAnchor(null);
    },
    [onAddMenuItemClick],
  );

  const onHeaderMenuItemClick = useCallback(
    (item: {
      label: string;
      value: TableColumnMenuActionEnum | string;
      parentValue?: TableColumnMenuActionEnum | string;
    }) => {
      switch (item.value) {
        case TableColumnMenuActionEnum.edit_description: {
          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.edit_description,
            columnId: selectedColumnId,
          });
          break;
        }
        case TableColumnMenuActionEnum.edit_column: {
          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.edit_column,
            columnId: selectedColumnId,
          });
          break;
        }
        case TableColumnMenuActionEnum.ai_agent: {
          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.ai_agent,
            columnId: selectedColumnId,
          });
          break;
        }
        case TableColumnMenuActionEnum.rename_column: {
          setHeaderState({
            focusedColumnId: selectedColumnId,
            isMenuOpen: false,
            isEditing: true,
            selectedColumnIds: [],
          });
          break;
        }
        case TableColumnMenuActionEnum.pin: {
          const column = table.getColumn(selectedColumnId);
          const isPinned = column?.getIsPinned() === 'left';

          column?.pin(isPinned ? false : 'left');

          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.pin,
            columnId: selectedColumnId,
            value: !isPinned,
          });

          setHeaderState({
            focusedColumnId: selectedColumnId,
            isMenuOpen: false,
            isEditing: false,
            selectedColumnIds: [],
          });
          break;
        }
        case TableColumnMenuActionEnum.visible: {
          const column = table.getColumn(selectedColumnId);
          const isVisible = column?.getIsVisible();

          column?.toggleVisibility(!isVisible);

          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.visible,
            columnId: selectedColumnId,
            value: !isVisible,
          });
          break;
        }
        case TableColumnMenuActionEnum.delete: {
          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.delete,
            columnId: selectedColumnId,
          });
          break;
        }
        default:
          // Pass through item value and parentValue for custom handlers (like insert column, change column type)
          onHeaderMenuClick?.({
            type: item.value as TableColumnMenuActionEnum,
            columnId: selectedColumnId,
            value: item.value,
            parentValue: item.parentValue,
          });
          // Keep header focused for change column type operation
          // Clear state for insert column operations
          if (
            item.parentValue === TableColumnMenuActionEnum.change_column_type
          ) {
            setHeaderState({
              focusedColumnId: selectedColumnId,
              isMenuOpen: false,
              isEditing: false,
              selectedColumnIds: [],
            });
          } else {
            setHeaderState(null);
          }
          break;
      }
      setHeaderMenuAnchor(null);
    },
    [onHeaderMenuClick, selectedColumnId, table],
  );

  // TODO: Interaction logic optimization
  // 1. onHeaderClick logic is too complex with nested if-else
  // 2. Consider extracting as independent handler utility functions
  // 3. Use state machine pattern to simplify click state transitions
  const onHeaderClick = useCallback(
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
          focusedColumnId: columnId,
          isMenuOpen: false,
          isEditing: false,
          selectedColumnIds: [],
        });
        return;
      }

      const isFocused = headerState?.focusedColumnId === columnId;
      const isCurrentlyShowingMenu = isFocused && headerState?.isMenuOpen;
      const hasActiveCellInCurrentColumn =
        cellState?.columnId === columnId && cellState?.recordId;
      const hasActiveCellInOtherColumn =
        cellState?.columnId && cellState?.columnId !== columnId;

      // Single click on focused header with menu open → close menu (keep focused)
      if (isFocused && isCurrentlyShowingMenu && !headerState?.isEditing) {
        setHeaderState({
          focusedColumnId: columnId,
          isMenuOpen: false,
          isEditing: false,
          selectedColumnIds: [],
        });
        setHeaderMenuAnchor(null);
        return;
      }

      // Click on header with active cell in same column → show menu
      if (hasActiveCellInCurrentColumn) {
        setHeaderState({
          focusedColumnId: columnId,
          isMenuOpen: true,
          isEditing: false,
          selectedColumnIds: [],
        });
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(e.currentTarget as HTMLElement);
        setSelectedColumnId(columnId);
        return;
      }

      // Click on focused header without menu → show menu
      if (isFocused && !isCurrentlyShowingMenu) {
        setHeaderState({
          focusedColumnId: columnId,
          isMenuOpen: true,
          isEditing: false,
          selectedColumnIds: [],
        });
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(e.currentTarget as HTMLElement);
        setSelectedColumnId(columnId);
        return;
      }

      // Click on non-focused header → focus and show menu
      if (!cellState || hasActiveCellInOtherColumn) {
        setHeaderState({
          focusedColumnId: columnId,
          isMenuOpen: true,
          isEditing: false,
          selectedColumnIds: [],
        });
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(e.currentTarget as HTMLElement);
        setSelectedColumnId(columnId);
        return;
      }

      // Default: focus without menu
      setHeaderState({
        focusedColumnId: columnId,
        isMenuOpen: false,
        isEditing: false,
        selectedColumnIds: [],
      });
    },
    [
      columnSizingInfo.isResizingColumn,
      headerState?.focusedColumnId,
      headerState?.isMenuOpen,
      headerState?.isEditing,
      cellState?.columnId,
      cellState?.recordId,
    ],
  );

  const onHeaderRightClick = useCallback(
    (e: MouseEvent, columnId: string) => {
      e.preventDefault();
      if (columnSizingInfo.isResizingColumn || headerState?.isEditing) {
        return;
      }
      setHeaderState({
        focusedColumnId: columnId,
        isMenuOpen: true,
        isEditing: false,
        selectedColumnIds: [],
      });
      setAddMenuAnchor(null);
      setHeaderMenuAnchor(e.currentTarget as HTMLElement);
      setSelectedColumnId(columnId);
    },
    [columnSizingInfo.isResizingColumn, headerState?.isEditing],
  );

  const onHeaderDoubleClick = useCallback(
    (e: MouseEvent, columnId: string) => {
      if (columnSizingInfo.isResizingColumn) {
        return;
      }
      setHeaderState({
        focusedColumnId: columnId,
        isMenuOpen: false,
        isEditing: true,
        selectedColumnIds: [],
      });
      setHeaderMenuAnchor(null);
    },
    [columnSizingInfo.isResizingColumn],
  );

  // TODO: Rendering logic optimization
  // 1. renderContent function is too long (~300 lines), needs splitting
  // 2. Extract Header and Body rendering as independent components
  // 3. Reduce duplicate code (pinned cells and virtual cells have similar rendering logic)
  const renderContent = useCallback(
    ({
      columnVirtualizer,
      rowVirtualizer,
      virtualColumns,
      virtualRows,
      virtualPaddingLeft,
      virtualPaddingRight,
    }: any) => {
      const indicatorHeight = rowVirtualizer.getTotalSize() + 37;

      return (
        <>
          <StyledTableHead isScrolled={isScrolled ?? false}>
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
                  const isSelectCol = col.id === SYSTEM_COLUMN_SELECT;
                  return (
                    <StyledTableHeadCell
                      canResize={!isSelectCol}
                      header={header}
                      indicatorHeight={indicatorHeight}
                      isEditing={
                        headerState?.focusedColumnId === header.id &&
                        headerState?.isEditing
                      }
                      isFocused={headerState?.focusedColumnId === header.id}
                      isPinned
                      key={header.id}
                      onClick={
                        !isSelectCol
                          ? (e) => {
                              onHeaderClick(e, header.id);
                            }
                          : undefined
                      }
                      onContextMenu={
                        !isSelectCol
                          ? (e) => onHeaderRightClick(e, col.id)
                          : undefined
                      }
                      onDoubleClick={
                        !isSelectCol
                          ? (e) => onHeaderDoubleClick(e, header.id)
                          : undefined
                      }
                      onEditSave={(newName) =>
                        (table.options.meta as any)?.updateHeaderName?.(
                          header.id,
                          newName,
                        )
                      }
                      onResizeStart={() => {
                        setHeaderMenuAnchor(null);
                        setHeaderState(null);
                      }}
                      shouldShowPinnedRightShadow={
                        index === leftPinnedColumns.length - 1
                      }
                      stickyLeft={stickyLeftMap[col.id] ?? 0}
                      width={header.getSize()}
                      // Select column checkbox props (bypass TanStack column caching)
                      {...(isSelectCol && {
                        isAllRowsSelected: table.getIsAllPageRowsSelected(),
                        isSomeRowsSelected: table.getIsSomePageRowsSelected(),
                        onToggleAllRows:
                          table.getToggleAllPageRowsSelectedHandler(),
                      })}
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
                      indicatorHeight={indicatorHeight}
                      isEditing={
                        headerState?.focusedColumnId === header.id &&
                        headerState?.isEditing
                      }
                      isFocused={headerState?.focusedColumnId === header.id}
                      key={header.id}
                      measureRef={(node) =>
                        columnVirtualizer.measureElement(node)
                      }
                      onClick={(e) => {
                        onHeaderClick(e, header.id);
                      }}
                      onContextMenu={(e) => onHeaderRightClick(e, header.id)}
                      onDoubleClick={(e) => onHeaderDoubleClick(e, header.id)}
                      onEditSave={(newName) =>
                        (table.options.meta as any)?.updateHeaderName?.(
                          header.id,
                          newName,
                        )
                      }
                      onResizeStart={() => {
                        setHeaderMenuAnchor(null);
                        setHeaderState(null);
                      }}
                      width={header.getSize()}
                    />
                  );
                })}

                {virtualPaddingRight ? (
                  <StyledTableSpacer borderRight width={virtualPaddingRight} />
                ) : null}

                <StyledTableHeadCell
                  canResize={false}
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
                    return (
                      <StyledTableBodyCell
                        cell={cell}
                        isPinned
                        key={cell.id}
                        onCellClick={onCellClick}
                        shouldShowPinnedRightShadow={
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
                    return (
                      <StyledTableBodyCell
                        cell={cell}
                        key={cell.id}
                        onCellClick={onCellClick}
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
      isScrolled,
      table,
      leftPinnedColumns,
      headerState?.focusedColumnId,
      headerState?.isEditing,
      stickyLeftMap,
      onHeaderClick,
      onHeaderRightClick,
      centerColumns,
      rowHeight,
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
        style={columnSizeVars as React.CSSProperties}
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

        {addRowsFooter ?? <StyledTableAddRowsFooter onAddRows={onAddRows} />}

        <StyledTableMenuAddColumn
          anchorEl={addMenuAnchor}
          menuItems={addMenuItems}
          onClose={() => setAddMenuAnchor(null)}
          onMenuItemClick={onAddMenuClick}
        />

        <StyledTableMenuHeader
          anchorEl={headerMenuAnchor}
          columnPinning={columnPinning}
          columns={columns}
          headerState={headerState}
          onClose={() => {
            setHeaderState(null);
            setHeaderMenuAnchor(null);
            setSelectedColumnId('');
          }}
          onMenuItemClick={onHeaderMenuItemClick}
          selectedColumnId={selectedColumnId}
        />

        <StyledTableMenuAiRun
          anchorEl={aiRunMenuAnchor}
          columnId={aiRunColumnId}
          onClose={() => {
            setAiRunMenuAnchor(null);
            setAiRunColumnId('');
          }}
          onRunAi={onRunAi}
          rowIds={rowIds}
        />
      </Stack>
    </ClickAwayListener>
  );
};
