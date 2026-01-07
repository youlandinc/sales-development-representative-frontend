import {
  FC,
  memo,
  MouseEvent,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, CircularProgress, Stack } from '@mui/material';
import { CellContext } from '@tanstack/react-table';

import { SYSTEM_COLUMN_SELECT } from '../config';
import {
  TableCellFieldData,
  TableColumnMeta,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

import { CommonAiIcon } from '../common';
import { useRowHover } from '../StyledTableBody';
import {
  BodyCellCheckbox,
  BodyCellContainer,
  BodyCellContent,
  BodyCellEditorExpanded,
  BodyCellEditorInline,
  getCellBackgroundColor,
} from './index';

const CELL_CONSTANTS = {
  FONT_SIZE: 14,
  PROGRESS_SIZE: 16,
} as const;

const AI_LOADING_CONTENT = (
  <Stack alignItems="center" direction="row" spacing={1}>
    <CircularProgress size={CELL_CONSTANTS.PROGRESS_SIZE} />
    <Box
      component="span"
      sx={{
        fontSize: CELL_CONSTANTS.FONT_SIZE,
        color: 'text.secondary',
      }}
    >
      Processing...
    </Box>
  </Stack>
);

export interface CellState {
  recordId: string;
  columnId: string;
  isEditing?: boolean;
}

export interface HeaderState {
  activeColumnId: string | null;
  isMenuOpen: boolean;
  focusedColumnId: string | null;
  isEditing: boolean;
}

// Helper: check if cellState matches current cell
const isCellStateMatch = (
  cellState: CellState | null,
  rowId: string,
  columnId: string,
): boolean => {
  return cellState?.recordId === rowId && cellState?.columnId === columnId;
};

// Helper: check if cell should trigger AI auto-process
const shouldAutoTriggerAi = (
  isAiColumn: boolean,
  isAiLoading: boolean,
  displayValue: string,
  isFinished: boolean,
): boolean => {
  return isAiColumn && !isAiLoading && !displayValue && !isFinished;
};

// Helper: check if column is highlighted
const isColumnHighlightedCheck = (
  headerState: HeaderState | undefined,
  columnId: string,
): boolean => {
  if (!headerState) {
    return false;
  }
  return (
    (headerState.activeColumnId === columnId && headerState.isMenuOpen) ||
    (headerState.focusedColumnId === columnId && headerState.isEditing)
  );
};

export interface BodyCellProps {
  cellContext: CellContext<any, unknown>;
  // State passed directly - memo handles selective re-render
  cellState: CellState | null;
  headerState: HeaderState;
  // Row selection state - needed to trigger re-render on select all
  isRowSelected: boolean;
  // Pinned column layout - passed from parent for proper memo comparison
  isPinned: boolean;
  stickyLeft: number;
  shouldShowPinnedRightShadow: boolean;
  // Callback
  onCellClick: (columnId: string, rowId: string, data: any) => void;
}

const BodyCellComponent: FC<BodyCellProps> = ({
  cellContext,
  cellState,
  headerState,
  isRowSelected,
  isPinned,
  stickyLeft,
  shouldShowPinnedRightShadow,
  onCellClick,
}) => {
  // ========== 1. Context Data Extraction ==========
  const { getValue, row, column, table } = cellContext;
  const tableMeta = table.options.meta as any;
  const rowId = row.id;
  const columnId = column.id;
  const value = getValue() != null ? String(getValue()) : '';
  const originalData = row.original?.[columnId] as
    | TableCellFieldData
    | undefined;
  const columnMeta = column.columnDef.meta as TableColumnMeta | undefined;
  const rowIndex = row.index;
  const rowData = row;

  // ========== 2. Hooks (useRef → useState → useMemo → useContext) ==========
  const cellRef = useRef<HTMLDivElement>(null);
  const [localEditValue, setLocalEditValue] = useState<string>('');
  const [isTruncated, setIsTruncated] = useState(false);
  const [isCellHovered, setIsCellHovered] = useState(false);

  const width = column.getSize();

  const { isRowHovered } = useRowHover();

  // ========== 3. Derived State ==========
  const displayValue = value;
  const onToggleSelected = (next: boolean) => row.toggleSelected?.(next);
  const { fieldType, canEdit = false, isAiColumn = false } = columnMeta || {};
  const isAiLoading = tableMeta?.isAiLoading?.(rowId, columnId) ?? false;
  const isFinished = originalData?.isFinished ?? false;
  const hasAiColumn = tableMeta?.hasAiColumn ?? false;

  const metaData = originalData?.metaData;
  const isValidate = metaData?.isValidate ?? true;
  const imagePreview = metaData?.imagePreview;
  const validateStatus = metaData?.validateStatus;

  const isSelectColumn = columnId === SYSTEM_COLUMN_SELECT;
  const isActive = isCellStateMatch(cellState, rowId, columnId);
  const isEditing = isActive && cellState?.isEditing === true;
  const hasActiveInRow = isSelectColumn && cellState?.recordId === rowId;
  const isColumnHighlighted = isColumnHighlightedCheck(headerState, columnId);
  const isEditableCell = canEdit && !imagePreview && !validateStatus;
  const canInteract = Boolean(!isSelectColumn && isEditableCell);

  // ========== 4. Effects ==========
  useEffect(() => {
    if (isEditing) {
      setLocalEditValue(String(displayValue ?? ''));
    }
  }, [displayValue, isEditing]);

  useEffect(() => {
    if (
      shouldAutoTriggerAi(isAiColumn, isAiLoading, displayValue, isFinished)
    ) {
      tableMeta?.onAiProcess?.(rowId, columnId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiColumn, isAiLoading, displayValue, isFinished, rowId, columnId]);

  // ========== 5. Callbacks ==========
  const onStopEdit = useCallback(() => {
    startTransition(() => {
      if (localEditValue !== String(displayValue ?? '')) {
        tableMeta?.onCellEdit?.(rowId, columnId, String(localEditValue));
      }
      tableMeta?.setCellMode?.(rowId, columnId, 'clear');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localEditValue, displayValue, rowId, columnId]);

  const onTruncatedChange = useCallback((truncated: boolean) => {
    setIsTruncated(truncated);
  }, []);

  const onCellClickInternal = useCallback(() => {
    onCellClick(columnId, rowId, rowData);
    if (canInteract || isAiColumn) {
      tableMeta?.setCellMode?.(rowId, columnId, 'active');
    }
  }, [
    onCellClick,
    columnId,
    rowId,
    rowData,
    canInteract,
    isAiColumn,
    tableMeta,
  ]);

  const onCellDoubleClickInternal = useCallback(() => {
    if (canInteract) {
      tableMeta?.setCellMode?.(rowId, columnId, 'edit');
    }
  }, [canInteract, rowId, columnId, tableMeta]);

  const onAiIconClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
      tableMeta?.onRunAi?.({
        fieldId: isSelectColumn ? SYSTEM_COLUMN_SELECT : columnId,
        recordId: rowId,
        isHeader: false,
      });
    },
    [columnId, rowId, isSelectColumn, tableMeta],
  );

  const onMouseEnter = useCallback(() => setIsCellHovered(true), []);
  const onMouseLeave = useCallback(() => setIsCellHovered(false), []);

  // ========== 6. Render Helpers ==========
  const cellBackgroundColor = getCellBackgroundColor(
    isEditing,
    isActive,
    isSelectColumn,
    hasActiveInRow,
    isRowSelected,
    isColumnHighlighted,
  );

  const shouldShowExpandedEditor =
    isEditing && isTruncated && !isSelectColumn && isEditableCell;

  const cursor =
    canInteract || isAiColumn
      ? 'pointer'
      : imagePreview || validateStatus
        ? 'not-allowed'
        : 'default';

  const renderContent = () => {
    if (isSelectColumn) {
      return (
        <BodyCellCheckbox
          isRowHovered={isRowHovered}
          isRowSelected={isRowSelected}
          onToggleSelected={(next) => onToggleSelected?.(next)}
          rowIndex={rowIndex}
        />
      );
    }

    if (isAiColumn && isAiLoading && !displayValue && !isFinished) {
      return AI_LOADING_CONTENT;
    }

    if (isEditing && isEditableCell && !isTruncated) {
      return (
        <BodyCellEditorInline
          onChange={setLocalEditValue}
          onStopEdit={onStopEdit}
          value={localEditValue}
        />
      );
    }

    if (fieldType === TableColumnTypeEnum.url) {
      return (
        <Box
          sx={{
            textDecoration: 'underline',
            textDecorationColor: 'rgba(111, 108, 125, .5)',
            textUnderlineOffset: '2px',
            color: 'rgb(111 108 125 / 80%)',
          }}
        >
          {displayValue}
        </Box>
      );
    }
    return displayValue;
  };

  return (
    <BodyCellContainer
      backgroundColor={cellBackgroundColor}
      cellRef={cellRef}
      cursor={cursor}
      isPinned={isPinned}
      isSelectColumn={isSelectColumn}
      onClick={onCellClickInternal}
      onDoubleClick={onCellDoubleClickInternal}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      shouldShowPinnedRightShadow={shouldShowPinnedRightShadow}
      stickyLeft={stickyLeft}
      width={width}
    >
      <BodyCellContent
        displayValue={displayValue}
        fieldType={fieldType}
        imagePreview={imagePreview}
        isEditing={isEditing}
        isValidate={isValidate}
        onTruncatedChange={onTruncatedChange}
        validateStatus={validateStatus}
        width={width}
      >
        {renderContent()}
      </BodyCellContent>

      <BodyCellEditorExpanded
        anchorEl={cellRef.current}
        isOpen={shouldShowExpandedEditor}
        onCancel={onStopEdit}
        onChange={setLocalEditValue}
        onSave={onStopEdit}
        value={localEditValue}
        width={width}
      />

      {hasAiColumn &&
        ((isSelectColumn && isRowHovered) || (isAiColumn && isCellHovered)) && (
          <CommonAiIcon
            backgroundColor={cellBackgroundColor}
            onClick={onAiIconClick}
          />
        )}
    </BodyCellContainer>
  );
};

// Custom memo comparison - only re-render if cell is relevant to state change
const bodyCellAreEqual = (
  prev: BodyCellProps,
  next: BodyCellProps,
): boolean => {
  const prevRowId = prev.cellContext.row.id;
  const prevColId = prev.cellContext.column.id;
  const nextRowId = next.cellContext.row.id;
  const nextColId = next.cellContext.column.id;

  // Check if cellState is relevant to this cell
  const prevCellRelevant =
    prev.cellState?.recordId === prevRowId &&
    prev.cellState?.columnId === prevColId;
  const nextCellRelevant =
    next.cellState?.recordId === nextRowId &&
    next.cellState?.columnId === nextColId;

  // Check if this cell is in the active row (for select column)
  const prevInActiveRow = prev.cellState?.recordId === prevRowId;
  const nextInActiveRow = next.cellState?.recordId === nextRowId;

  // If cellState affects this cell, need to re-render
  if (prevCellRelevant || nextCellRelevant) {
    if (prev.cellState !== next.cellState) {
      return false;
    }
  }

  // For select column, check if row active state or selection state changed
  if (
    prevColId === SYSTEM_COLUMN_SELECT ||
    nextColId === SYSTEM_COLUMN_SELECT
  ) {
    if (prevInActiveRow !== nextInActiveRow) {
      return false;
    }
    // Check row selection state change (for checkbox) - use prop instead of method
    if (prev.isRowSelected !== next.isRowSelected) {
      return false;
    }
  }

  // Check headerState relevance
  const prevColHighlighted =
    (prev.headerState?.activeColumnId === prevColId &&
      prev.headerState?.isMenuOpen) ||
    (prev.headerState?.focusedColumnId === prevColId &&
      prev.headerState?.isEditing);
  const nextColHighlighted =
    (next.headerState?.activeColumnId === nextColId &&
      next.headerState?.isMenuOpen) ||
    (next.headerState?.focusedColumnId === nextColId &&
      next.headerState?.isEditing);

  if (prevColHighlighted !== nextColHighlighted) {
    return false;
  }

  // Check callback reference
  if (prev.onCellClick !== next.onCellClick) {
    return false;
  }

  // Check if cell id changed
  if (prev.cellContext.cell.id !== next.cellContext.cell.id) {
    return false;
  }

  // Check pinned layout props (passed from parent)
  if (
    prev.isPinned !== next.isPinned ||
    prev.stickyLeft !== next.stickyLeft ||
    prev.shouldShowPinnedRightShadow !== next.shouldShowPinnedRightShadow
  ) {
    return false;
  }

  // Check if cell value changed (for edit save / AI process complete)
  const prevValue = prev.cellContext.getValue();
  const nextValue = next.cellContext.getValue();
  if (prevValue !== nextValue) {
    return false;
  }

  // Check if row original data changed (for AI loading state, metadata, etc.)
  const prevOriginal = prev.cellContext.row.original?.[prevColId];
  const nextOriginal = next.cellContext.row.original?.[nextColId];
  if (prevOriginal !== nextOriginal) {
    return false;
  }

  return true;
};

export const BodyCell = memo(BodyCellComponent, bodyCellAreEqual);
//export const BodyCell = BodyCellComponent;
