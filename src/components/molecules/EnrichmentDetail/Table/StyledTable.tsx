import {
  CSSProperties,
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
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';

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

import { StyledTableContainer } from './StyledTableContainer';
import { StyledTableHead, StyledTableHeadRow } from './StyledTableHead';
import { StyledTableBody, StyledTableBodyRow } from './StyledTableBody';
import { StyledTableFooter } from './StyledTableFooter';

import { HeadCell, SortableHeadCell } from './head';
import { BodyCell } from './body';
import { MenuColumnAi, MenuColumnInsert, MenuColumnNormal } from './menu';
import { CommonOverlay, CommonSpacer } from './common';

import ICON_TYPE_ADD from './assets/icon-type-add.svg';
import ICON_ARROW_DOWN from './assets/icon-arrow-down.svg';

import {
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';
import { SYSTEM_COLUMN_SELECT } from './config';
import { checkIsAiColumn, checkIsEditableColumn } from './utils';
import { UTypeOf } from '@/utils';

// ============================================
// Type Definitions
// ============================================

interface MenuItem {
  label: string;
  value: string;
  icon: any;
}

interface HeaderMenuClickParams {
  type: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
  columnId: string;
  value?: any;
  parentValue?: any;
}

interface VirtualizationConfig {
  enabled?: boolean;
  rowHeight?: number;
  scrollContainer?: RefObject<HTMLDivElement | null>;
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
}

type AiLoadingState = Record<string, Record<string, boolean>>;

interface AiRunParams {
  fieldId: string;
  recordId?: string;
  isHeader?: boolean;
  recordCount?: number;
}

interface CellState {
  recordId: string;
  columnId: string;
  isEditing?: boolean;
}

// ============================================
// Props Interface
// ============================================

interface StyledTableProps {
  tableId?: string;
  columns: any[];
  rowIds: string[];
  data: any[];
  addMenuItems?: MenuItem[];
  onAddMenuItemClick?: (item: { label: string; value: string }) => void;
  onHeaderMenuClick?: (params: HeaderMenuClickParams) => void;
  isScrolled?: boolean;
  virtualization?: VirtualizationConfig;
  onColumnResize?: (fieldId: string, width: number) => void;
  onCellEdit?: (recordId: string, fieldId: string, value: string) => void;
  onAiProcess?: (recordId: string, columnId: string) => void;
  onCellClick: (columnId: string, rowId: string, data: any) => void;
  aiLoading?: AiLoadingState;
  onRunAi?: (params: AiRunParams) => Promise<void>;
  onColumnSort?: (params: {
    tableId: string;
    currentFieldId: string;
    beforeFieldId?: string;
    afterFieldId?: string;
  }) => Promise<void>;
  onAddRows: (count: number) => Promise<void>;
  addRowsFooter?: ReactNode;
}

const columnHelper = createColumnHelper<any>();

/**
 * Header State - Manages table header interaction states
 *
 * @property activeColumnId - Column with background highlight
 *   - Set when: header clicked (single/right click)
 *   - Cleared when: click away from table
 *   - Used for: header background color, menu target column, body cell column highlight
 *
 * @property focusedColumnId - Column with bottom line indicator
 *   - Set when: header clicked
 *   - Cleared when: another header clicked (not on click away)
 *   - Used for: bottom line visual indicator, persists after click away
 *
 * @property isMenuOpen - Whether header menu is currently visible
 *   - Set when: header clicked to show menu
 *   - Cleared when: menu closed, click away, or action selected
 *
 * @property isEditing - Whether header is in rename/edit mode
 *   - Set when: header double-clicked or rename menu item selected
 *   - Cleared when: edit completed or cancelled
 *
 * @property selectedColumnIds - Array of selected column IDs for multi-select
 *   - Reserved for future multi-column selection feature
 */
type HeaderState = {
  activeColumnId: string | null;
  focusedColumnId: string | null;
  isMenuOpen: boolean;
  isEditing: boolean;
  selectedColumnIds: string[];
};

const HEADER_STATE_RESET: HeaderState = {
  activeColumnId: null,
  focusedColumnId: null,
  isMenuOpen: false,
  isEditing: false,
  selectedColumnIds: [],
};

export const StyledTable: FC<StyledTableProps> = ({
  tableId,
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
  onColumnSort,
  onAddRows,
  addRowsFooter,
}) => {
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnSizingInfo, setColumnSizingInfo] =
    useState<ColumnSizingInfoState>({} as ColumnSizingInfoState);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // TODO: Consider merging menu anchors into unified menuState
  const [cellState, setCellState] = useState<CellState | null>(null);

  const [headerState, setHeaderState] =
    useState<HeaderState>(HEADER_STATE_RESET);
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
  // Removed: selectedColumnId - now use headerState.activeColumnId
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

  // DnD sensors for column reordering
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  // Sortable column IDs - pinned (exclude select) and center separately
  const { sortablePinnedIds, sortableCenterIds } = useMemo(() => {
    const pinned = columns
      .filter((col) => col.pin && col.fieldId !== SYSTEM_COLUMN_SELECT)
      .map((col) => col.fieldId);
    const center = columns
      .filter((col) => !col.pin && col.fieldId !== SYSTEM_COLUMN_SELECT)
      .map((col) => col.fieldId);
    return { sortablePinnedIds: pinned, sortableCenterIds: center };
  }, [columns]);

  // Handle column drag end - works for both pinned and center columns
  const onColumnDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) {
        return;
      }

      const currentFieldId = String(active.id);
      const overFieldId = String(over.id);

      const overIndex = over.data.current?.sortable.index as number;

      if (overIndex === -1) {
        return;
      }

      let beforeFieldId: string | undefined;
      let afterFieldId: string | undefined;

      if (overIndex === 0) {
        afterFieldId = overFieldId;
      } else {
        beforeFieldId = overFieldId;
      }

      if (tableId && onColumnSort) {
        await onColumnSort({
          tableId,
          currentFieldId,
          beforeFieldId,
          afterFieldId,
        });
      }
    },
    [tableId, onColumnSort],
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
            cell: (info) => info, // Return context for flexRender
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
    // directly in HeadCell, bypassing TanStack's column caching.
    [columns],
  );

  // Stable callbacks - these don't depend on cellState/headerState
  // so tableMeta reference stays stable when cell/header state changes
  const setCellMode = useCallback(
    (recordId: string, columnId: string, mode: 'active' | 'edit' | 'clear') => {
      switch (mode) {
        case 'active':
          setCellState({ recordId, columnId });
          setHeaderState({
            activeColumnId: null,
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
    [],
  );

  const stopHeaderEdit = useCallback(() => {
    setHeaderState((prev) => ({ ...prev, isEditing: false }));
  }, []);

  const openAiRunMenu = useCallback(
    (anchorEl: HTMLElement, columnId: string) => {
      setAddMenuAnchor(null);
      setHeaderMenuAnchor(null);
      setAiRunMenuAnchor(anchorEl);
      setAiRunColumnId(columnId);
    },
    [],
  );

  const tableMeta = useMemo(
    () => ({
      // ===== Data Update =====
      onCellEdit,

      // ===== Cell State Management (stable callbacks) =====
      setCellMode,

      // ===== Header State =====
      setHeaderState,

      // ===== AI Features =====
      hasAiColumn,
      isAiLoading: (recordId: string, columnId: string) =>
        Boolean(aiLoading?.[recordId]?.[columnId]),
      onAiProcess,
      onRunAi,
      openAiRunMenu,

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
    }),
    [
      onCellEdit,
      setCellMode,
      hasAiColumn,
      aiLoading,
      onAiProcess,
      onRunAi,
      openAiRunMenu,
      stopHeaderEdit,
      onHeaderMenuClick,
    ],
  );

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
    if (isResizing && headerState.isEditing) {
      setHeaderState((prev) => ({ ...prev, isEditing: false }));
      setHeaderMenuAnchor(null);
    }
  }, [columnSizingInfo.isResizingColumn, headerState.isEditing]);

  // Get visible columns once per render (stable reference from TanStack)
  const visibleLeafColumns = table.getVisibleLeafColumns();

  const { leftPinnedColumns, centerColumns, stickyLeftMap, pinnedTotalWidth } =
    useMemo(() => {
      const leftPinned = visibleLeafColumns.filter(
        (col) => col.getIsPinned() === 'left',
      );
      const center = visibleLeafColumns.filter((col) => !col.getIsPinned());

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
        pinnedTotalWidth: acc,
      };
      // Depend on column count + pinning/sizing state, not method call result
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibleLeafColumns.length, columnPinning, columnSizing]);

  // Get select column width for pinned drag boundary
  const selectColumnWidth = useMemo(() => {
    const selectCol = leftPinnedColumns.find(
      (col) => col.id === SYSTEM_COLUMN_SELECT,
    );
    return selectCol?.getSize() ?? 100;
  }, [leftPinnedColumns]);

  // Custom modifier: restrict drag to horizontal axis and prevent going past boundaries
  const dragModifiers = useMemo<Modifier[]>(() => {
    return [
      ({ transform, draggingNodeRect, scrollableAncestorRects, active }) => {
        const containerRect = scrollableAncestorRects[0];
        if (!draggingNodeRect || !containerRect || !active) {
          return { ...transform, y: 0 };
        }

        const activeId = active.id as string;
        const isPinnedColumn = sortablePinnedIds.includes(activeId);

        let minX: number;
        if (isPinnedColumn) {
          // Pinned columns: cannot go left of select column
          minX = selectColumnWidth - draggingNodeRect.left + containerRect.left;
        } else {
          // Center columns: cannot go left of pinned area
          minX = pinnedTotalWidth - draggingNodeRect.left + containerRect.left;
        }

        return {
          ...transform,
          x: Math.max(transform.x, minX),
          y: 0, // Restrict to horizontal axis
        };
      },
    ];
  }, [pinnedTotalWidth, selectColumnWidth, sortablePinnedIds]);

  // CSS variables for performant column resizing (TanStack recommended approach)
  // This allows resize indicator to update smoothly without re-rendering cells
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: Record<string, number> = {};
    for (const header of headers) {
      colSizes[`--col-${header.column.id}-size`] = header.getSize();
    }
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  // Calculate selection overlay position based on cellState
  const selectionOverlayPosition = useMemo(() => {
    if (!cellState) {
      return null;
    }

    const { recordId, columnId } = cellState;
    const rowIndex = rowIds.indexOf(recordId);
    if (rowIndex === -1) {
      return null;
    }

    // Check if column is pinned
    const isPinned = leftPinnedColumns.some((col) => col.id === columnId);

    // Calculate left position
    let left = 0;
    if (isPinned) {
      // For pinned columns, use stickyLeftMap
      left = stickyLeftMap[columnId] ?? 0;
    } else {
      // For center columns, calculate offset from pinned width
      const pinnedWidth = leftPinnedColumns.reduce(
        (acc, col) => acc + col.getSize(),
        0,
      );
      let centerOffset = 0;
      for (const col of centerColumns) {
        if (col.id === columnId) {
          break;
        }
        centerOffset += col.getSize();
      }
      left = pinnedWidth + centerOffset;
    }

    // Calculate top position (overlay inside body, no header offset)
    const top = rowIndex * rowHeight;

    // Get column width
    const column = table.getColumn(columnId);
    const width = column?.getSize() ?? 200;

    // Calculate pinned width for the blocker
    const pinnedWidth = leftPinnedColumns.reduce(
      (acc, col) => acc + col.getSize(),
      0,
    );

    // Container height - body size only
    const containerHeight = rowIds.length * rowHeight;

    return {
      left: left - 0.5,
      top: top - 0.5,
      width,
      height: rowHeight,
      isEditing: cellState.isEditing ?? false,
      isPinned,
      pinnedWidth,
      containerHeight,
    };
  }, [
    cellState,
    rowIds,
    leftPinnedColumns,
    centerColumns,
    stickyLeftMap,
    rowHeight,
    table,
  ]);

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
      const activeColumnId = headerState.activeColumnId;
      if (!activeColumnId) {
        return;
      }

      switch (item.value) {
        case TableColumnMenuActionEnum.edit_description: {
          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.edit_description,
            columnId: activeColumnId,
          });
          break;
        }
        case TableColumnMenuActionEnum.edit_column: {
          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.edit_column,
            columnId: activeColumnId,
          });
          break;
        }
        case TableColumnMenuActionEnum.ai_agent: {
          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.ai_agent,
            columnId: activeColumnId,
          });
          break;
        }
        case TableColumnMenuActionEnum.rename_column: {
          setHeaderState({
            activeColumnId: null,
            focusedColumnId: activeColumnId,
            isMenuOpen: false,
            isEditing: true,
            selectedColumnIds: [],
          });
          break;
        }
        case TableColumnMenuActionEnum.pin: {
          const column = table.getColumn(activeColumnId);
          const isPinned = column?.getIsPinned() === 'left';

          column?.pin(isPinned ? false : 'left');

          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.pin,
            columnId: activeColumnId,
            value: !isPinned,
          });

          setHeaderState({
            activeColumnId: null,
            focusedColumnId: activeColumnId,
            isMenuOpen: false,
            isEditing: false,
            selectedColumnIds: [],
          });
          break;
        }
        case TableColumnMenuActionEnum.visible: {
          const column = table.getColumn(activeColumnId);
          const isVisible = column?.getIsVisible();

          column?.toggleVisibility(!isVisible);

          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.visible,
            columnId: activeColumnId,
            value: !isVisible,
          });
          break;
        }
        case TableColumnMenuActionEnum.delete: {
          onHeaderMenuClick?.({
            type: TableColumnMenuActionEnum.delete,
            columnId: activeColumnId,
          });
          break;
        }
        default:
          // Pass through item value and parentValue for custom handlers (like insert column, change column type)
          onHeaderMenuClick?.({
            type: item.value as TableColumnMenuActionEnum,
            columnId: activeColumnId,
            value: item.value,
            parentValue: item.parentValue,
          });
          // Keep header focused for change column type operation
          // Clear state for insert column operations
          if (
            item.parentValue === TableColumnMenuActionEnum.change_column_type
          ) {
            setHeaderState({
              activeColumnId: null,
              focusedColumnId: activeColumnId,
              isMenuOpen: false,
              isEditing: false,
              selectedColumnIds: [],
            });
          } else {
            setHeaderState(HEADER_STATE_RESET);
          }
          break;
      }
      setHeaderMenuAnchor(null);
    },
    [onHeaderMenuClick, headerState.activeColumnId, table],
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

      // Clear cell selection when clicking header
      setCellState(null);

      if (columnSizingInfo.isResizingColumn) {
        setHeaderState({
          activeColumnId: columnId,
          focusedColumnId: columnId,
          isMenuOpen: false,
          isEditing: false,
          selectedColumnIds: [],
        });
        return;
      }

      const isActive = headerState.activeColumnId === columnId;
      const isCurrentlyShowingMenu = isActive && headerState.isMenuOpen;
      const hasActiveCellInCurrentColumn =
        cellState?.columnId === columnId && cellState?.recordId;
      const hasActiveCellInOtherColumn =
        cellState?.columnId && cellState?.columnId !== columnId;

      // Single click on active header with menu open → close menu (keep active)
      if (isActive && isCurrentlyShowingMenu && !headerState.isEditing) {
        setHeaderState({
          activeColumnId: columnId,
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
          activeColumnId: columnId,
          focusedColumnId: columnId,
          isMenuOpen: true,
          isEditing: false,
          selectedColumnIds: [],
        });
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(e.currentTarget as HTMLElement);
        return;
      }

      // Click on active header without menu → show menu
      if (isActive && !isCurrentlyShowingMenu) {
        setHeaderState({
          activeColumnId: columnId,
          focusedColumnId: columnId,
          isMenuOpen: true,
          isEditing: false,
          selectedColumnIds: [],
        });
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(e.currentTarget as HTMLElement);
        return;
      }

      // Click on non-active header → activate and show menu
      if (!cellState || hasActiveCellInOtherColumn) {
        setHeaderState({
          activeColumnId: columnId,
          focusedColumnId: columnId,
          isMenuOpen: true,
          isEditing: false,
          selectedColumnIds: [],
        });
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(e.currentTarget as HTMLElement);
        return;
      }

      // Default: activate without menu
      setHeaderState({
        activeColumnId: columnId,
        focusedColumnId: columnId,
        isMenuOpen: false,
        isEditing: false,
        selectedColumnIds: [],
      });
    },
    [
      columnSizingInfo.isResizingColumn,
      headerState.activeColumnId,
      headerState.isMenuOpen,
      headerState.isEditing,
      cellState,
    ],
  );

  const onHeaderRightClick = useCallback(
    (e: MouseEvent, columnId: string) => {
      e.preventDefault();
      if (columnSizingInfo.isResizingColumn || headerState.isEditing) {
        return;
      }
      setHeaderState({
        activeColumnId: columnId,
        focusedColumnId: columnId,
        isMenuOpen: true,
        isEditing: false,
        selectedColumnIds: [],
      });
      setAddMenuAnchor(null);
      setHeaderMenuAnchor(e.currentTarget as HTMLElement);
    },
    [columnSizingInfo.isResizingColumn, headerState.isEditing],
  );

  const onHeaderDoubleClick = useCallback(
    (e: MouseEvent, columnId: string) => {
      if (columnSizingInfo.isResizingColumn) {
        return;
      }
      // Clear cell selection when double-clicking header
      setCellState(null);
      // Double click: enter edit mode, keep focusedColumnId for column highlight
      setHeaderState({
        activeColumnId: null,
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
  // 2. Reduce duplicate code (pinned cells and virtual cells have similar rendering logic)
  // Note: BodyCell has been extracted as independent component with memo optimization
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
          <DndContext
            collisionDetection={closestCenter}
            modifiers={dragModifiers}
            onDragEnd={onColumnDragEnd}
            sensors={sensors}
          >
            <StyledTableHead isScrolled={isScrolled ?? false}>
              {table.getHeaderGroups().map((headerGroup) => (
                <StyledTableHeadRow key={headerGroup.id}>
                  {/* Pinned left headers - wrapped in SortableContext */}
                  <SortableContext
                    items={sortablePinnedIds}
                    strategy={horizontalListSortingStrategy}
                  >
                    {leftPinnedColumns.map((col, index) => {
                      const header = headerGroup.headers.find(
                        (h) => h.id === col.id,
                      );
                      if (!header) {
                        return null;
                      }
                      const isSelectCol = col.id === SYSTEM_COLUMN_SELECT;

                      // Select column is not sortable
                      if (isSelectCol) {
                        return (
                          <HeadCell
                            headerContext={header.getContext()}
                            headerState={headerState}
                            indicatorHeight={indicatorHeight}
                            key={header.id}
                            shouldShowPinnedRightShadow={
                              index === leftPinnedColumns.length - 1
                            }
                            stickyLeft={stickyLeftMap[col.id] ?? 0}
                          />
                        );
                      }

                      // Pinned columns (non-select) are sortable
                      return (
                        <SortableHeadCell
                          headerContext={header.getContext()}
                          headerState={headerState}
                          indicatorHeight={indicatorHeight}
                          key={header.id}
                          onClick={(e) => onHeaderClick(e, header.id)}
                          onContextMenu={(e) => onHeaderRightClick(e, col.id)}
                          onDoubleClick={(e) =>
                            onHeaderDoubleClick(e, header.id)
                          }
                          onResizeStart={() => {
                            setHeaderMenuAnchor(null);
                            setHeaderState(HEADER_STATE_RESET);
                          }}
                          shouldShowPinnedRightShadow={
                            index === leftPinnedColumns.length - 1
                          }
                          sortableId={header.id}
                          stickyLeft={stickyLeftMap[col.id] ?? 0}
                        />
                      );
                    })}
                  </SortableContext>

                  {virtualPaddingLeft ? (
                    <CommonSpacer width={virtualPaddingLeft} />
                  ) : null}

                  {/* Center columns - wrapped in SortableContext */}
                  <SortableContext
                    items={sortableCenterIds}
                    strategy={horizontalListSortingStrategy}
                  >
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
                        <SortableHeadCell
                          dataIndex={virtualColumn.index}
                          headerContext={header.getContext()}
                          headerState={headerState}
                          indicatorHeight={indicatorHeight}
                          key={header.id}
                          measureRef={(node) =>
                            columnVirtualizer.measureElement(node)
                          }
                          onClick={(e) => {
                            onHeaderClick(e, header.id);
                          }}
                          onContextMenu={(e) =>
                            onHeaderRightClick(e, header.id)
                          }
                          onDoubleClick={(e) =>
                            onHeaderDoubleClick(e, header.id)
                          }
                          onResizeStart={() => {
                            setHeaderMenuAnchor(null);
                            setHeaderState(HEADER_STATE_RESET);
                          }}
                          sortableId={header.id}
                        />
                      );
                    })}
                  </SortableContext>

                  {virtualPaddingRight ? (
                    <CommonSpacer borderRight width={virtualPaddingRight} />
                  ) : null}

                  <HeadCell
                    onClick={(e) => {
                      setHeaderMenuAnchor(null);
                      setAddMenuAnchor(e.currentTarget);
                    }}
                    width={196}
                  >
                    <Icon
                      component={ICON_TYPE_ADD}
                      sx={{ width: 16, height: 16, mr: 1 }}
                    />
                    Add column
                    <Icon
                      component={ICON_ARROW_DOWN}
                      sx={{
                        width: 16,
                        height: 16,
                        ml: 'auto',
                      }}
                    />
                  </HeadCell>
                </StyledTableHeadRow>
              ))}
            </StyledTableHead>
          </DndContext>

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
                      <BodyCell
                        cellContext={cell.getContext()}
                        cellState={cellState}
                        headerState={headerState}
                        isPinned
                        isRowSelected={row.getIsSelected?.() ?? false}
                        key={cell.id}
                        onCellClick={onCellClick}
                        shouldShowPinnedRightShadow={
                          index === leftPinnedColumns.length - 1
                        }
                        stickyLeft={stickyLeftMap[col.id] ?? 0}
                      />
                    );
                  })}

                  {/* Left padding spacer */}
                  {virtualPaddingLeft ? (
                    <CommonSpacer width={virtualPaddingLeft} />
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
                      <BodyCell
                        cellContext={cell.getContext()}
                        cellState={cellState}
                        headerState={headerState}
                        isPinned={false}
                        isRowSelected={row.getIsSelected?.() ?? false}
                        key={cell.id}
                        onCellClick={onCellClick}
                        shouldShowPinnedRightShadow={false}
                        stickyLeft={0}
                      />
                    );
                  })}

                  {/* Right padding spacer */}
                  {virtualPaddingRight ? (
                    <CommonSpacer borderRight width={virtualPaddingRight} />
                  ) : null}

                  {/* Add-column trailing spacer to align with header and draw right edge */}
                  <CommonSpacer
                    bgcolor="background.paper"
                    borderBottom
                    borderRight
                    width={196}
                  />
                </StyledTableBodyRow>
              );
            })}

            {/* Selection overlay - rendered AFTER rows (Clay approach) */}
            {selectionOverlayPosition && (
              <CommonOverlay
                containerHeight={selectionOverlayPosition.containerHeight}
                height={selectionOverlayPosition.height}
                isEditing={selectionOverlayPosition.isEditing}
                isPinned={selectionOverlayPosition.isPinned}
                isVisible={true}
                left={selectionOverlayPosition.left}
                pinnedWidth={selectionOverlayPosition.pinnedWidth}
                top={selectionOverlayPosition.top}
                width={selectionOverlayPosition.width}
              />
            )}
          </StyledTableBody>
        </>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isScrolled,
      table,
      leftPinnedColumns,
      headerState,
      stickyLeftMap,
      onHeaderClick,
      onHeaderRightClick,
      onHeaderDoubleClick,
      centerColumns,
      rowHeight,
      onCellClick,
      selectionOverlayPosition,
      dragModifiers,
      sortablePinnedIds,
      sortableCenterIds,
    ],
  );

  return (
    <ClickAwayListener
      onClickAway={() => {
        setAddMenuAnchor(null);
        setHeaderMenuAnchor(null);
        setAiRunMenuAnchor(null);
        setAiRunColumnId('');

        // Cell selected: do nothing (keep all state)
        if (cellState) {
          return;
        }

        // Header selected: clear activeColumnId (no background), keep focusedColumnId (show bottom line)
        setHeaderState((prev) => ({
          ...prev,
          activeColumnId: null,
          isMenuOpen: false,
        }));
      }}
    >
      <Stack
        style={columnSizeVars as CSSProperties}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 'fit-content',
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

        {/* Footer outside StyledTableContainer for correct sticky left */}
        {addRowsFooter ?? <StyledTableFooter onAddRows={onAddRows} />}

        <MenuColumnInsert
          anchorEl={addMenuAnchor}
          menuItems={addMenuItems}
          onClose={() => setAddMenuAnchor(null)}
          onMenuItemClick={onAddMenuClick}
        />

        <MenuColumnNormal
          anchorEl={headerMenuAnchor}
          columnPinning={columnPinning}
          columns={columns}
          headerState={headerState}
          onClose={() => {
            setHeaderState(HEADER_STATE_RESET);
            setHeaderMenuAnchor(null);
          }}
          onMenuItemClick={onHeaderMenuItemClick}
        />

        <MenuColumnAi
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
