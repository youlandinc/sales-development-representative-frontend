import {
  FC,
  MouseEvent,
  ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Checkbox,
  CircularProgress,
  InputBase,
  Stack,
} from '@mui/material';
import { Cell } from '@tanstack/react-table';

import { SYSTEM_COLUMN_SELECT } from '@/constants/table';
import { TableCellFieldData, TableColumnMeta } from '@/types/enrichment/table';

import {
  StyledTableAiIcon,
  StyledTableBodyCellIcons,
  StyledTableMenuCellEditor,
  useRowHover,
} from './index';
import { StyledImage } from '../StyledImage';

const CELL_CONSTANTS = {
  MIN_WIDTH: 60,
  FONT_SIZE: 14,
  LINE_HEIGHT: '36px',
  PROGRESS_SIZE: 16,
  PADDING_X: 1.5,
} as const;

const CELL_COLORS = {
  ACTIVE_BG: '#fff',
  DEFAULT_BG: '#fff',
  BORDER: '#DFDEE6',
  PINNED_BORDER: '3px solid #DFDEE6',
  REGULAR_BORDER: '0.5px solid #DFDEE6',
  ACTIVE_BORDER: '#5B76BC',
} as const;

const CHECKBOX_ICON_CHECKED = (
  <StyledImage
    sx={{ width: 20, height: 20, position: 'relative' }}
    url="/images/icon-checkbox-check.svg"
  />
);

const CHECKBOX_ICON_UNCHECKED = (
  <StyledImage
    sx={{ width: 20, height: 20, position: 'relative' }}
    url="/images/icon-checkbox-static.svg"
  />
);

const CHECKBOX_ICON_INDETERMINATE = (
  <StyledImage
    sx={{ width: 20, height: 20, position: 'relative' }}
    url="/images/icon-checkbox-intermediate.svg"
  />
);

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

const getCellBackgroundColor = (
  isEditing: boolean,
  isActive: boolean,
  isSelectColumn: boolean,
  hasActiveInRow: boolean,
  isRowSelected: boolean,
  isColumnHighlighted: boolean,
): string => {
  if ((isEditing || isActive) && !isSelectColumn) {
    return CELL_COLORS.ACTIVE_BG;
  }
  if (isSelectColumn && hasActiveInRow) {
    return CELL_COLORS.ACTIVE_BG;
  }
  if (isRowSelected || isColumnHighlighted) {
    return CELL_COLORS.ACTIVE_BG;
  }
  return CELL_COLORS.DEFAULT_BG;
};

interface StyledTableBodyCellProps {
  cell?: Cell<any, unknown>;
  width: number;
  isPinned?: boolean;
  stickyLeft?: number;
  shouldShowPinnedRightShadow?: boolean;
  onCellClick: (columnId: string, rowId: string, data: any) => void;
}

export const StyledTableBodyCell: FC<StyledTableBodyCellProps> = ({
  cell,
  width,
  isPinned = false,
  stickyLeft = 0,
  shouldShowPinnedRightShadow,
  onCellClick,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const [localEditValue, setLocalEditValue] = useState<string>('');
  const [isTruncated, setIsTruncated] = useState(false);

  const context = cell?.getContext?.();
  const { table, row, column } = context || {};
  const tableMeta = table?.options?.meta as any;

  const recordId = row?.id ? String(row.id) : '';
  const columnId = column?.id ? String(column.id) : '';
  const isSelectColumn = column?.id === SYSTEM_COLUMN_SELECT;

  const displayValue = cell?.getValue() != null ? String(cell.getValue()) : '';

  const originalCellData = cell?.row?.original?.[columnId] as
    | TableCellFieldData
    | undefined;

  const { isRowHovered } = useRowHover();

  const isEditing = tableMeta?.isEditing?.(recordId, columnId) ?? false;
  const isActive = tableMeta?.isActive?.(recordId, columnId) ?? false;
  const hasActiveInRow = isSelectColumn
    ? (tableMeta?.hasActiveInRow?.(recordId) ?? false)
    : false;

  const isRowSelected = row?.getIsSelected?.() ?? false;

  const columnMeta = column?.columnDef?.meta as TableColumnMeta | undefined;
  const { fieldType, canEdit = false, isAiColumn = false } = columnMeta || {};

  // Use headerState to highlight column when header menu is open or editing
  const headerActiveColumnId = tableMeta?.headerState?.activeColumnId;
  const headerFocusedColumnId = tableMeta?.headerState?.focusedColumnId;
  const isHeaderMenuOpen = tableMeta?.headerState?.isMenuOpen ?? false;
  const isHeaderEditing = tableMeta?.headerState?.isEditing ?? false;
  // Column highlight: menu open OR editing (rename mode)
  const isColumnHighlighted =
    (headerActiveColumnId === columnId && isHeaderMenuOpen) ||
    (headerFocusedColumnId === columnId && isHeaderEditing);

  const isAiLoading = tableMeta?.isAiLoading?.(recordId, columnId) ?? false;

  const isFinished = originalCellData?.isFinished ?? false;

  const metaData = originalCellData?.metaData;
  const isValidate = metaData?.isValidate ?? true;
  const imagePreview = metaData?.imagePreview;
  const confidence = metaData?.confidence;

  const isEditableCell = canEdit && !imagePreview && !confidence;

  const canInteract = Boolean(cell && !isSelectColumn && isEditableCell);

  const hasAiColumn = tableMeta?.hasAiColumn ?? false;

  const [isCellHovered, setIsCellHovered] = useState(false);

  const resolvedMinWidth =
    width < CELL_CONSTANTS.MIN_WIDTH ? CELL_CONSTANTS.MIN_WIDTH : width;

  useEffect(() => {
    if (isEditing) {
      setLocalEditValue(String(displayValue ?? ''));
    }
  }, [displayValue, isEditing]);

  useLayoutEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditing]);

  // Detect if text is truncated (has ellipsis)
  useLayoutEffect(() => {
    if (textRef.current && !isEditing) {
      const el = textRef.current;
      const isTrunc = el.scrollWidth > el.clientWidth;
      setIsTruncated(isTrunc);
    }
  }, [displayValue, width, isEditing]);

  useEffect(() => {
    if (
      isAiColumn &&
      !isAiLoading &&
      !displayValue &&
      !isFinished &&
      tableMeta?.onAiProcess
    ) {
      tableMeta.onAiProcess(recordId, columnId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiColumn, isAiLoading, displayValue, isFinished, recordId, columnId]);

  const onStopEdit = useCallback(() => {
    startTransition(() => {
      if (localEditValue !== String(displayValue ?? '')) {
        tableMeta?.onCellEdit?.(recordId, columnId, String(localEditValue));
      }
      tableMeta?.setCellMode?.(recordId, columnId, 'clear');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localEditValue, displayValue, recordId, columnId]);

  const content = useMemo<ReactNode>(() => {
    // If text is truncated and editing, show text (Popper handles editing)
    // If not truncated and editing, show simple inline input
    if (
      isEditing &&
      cell &&
      !isSelectColumn &&
      isEditableCell &&
      !isTruncated
    ) {
      return (
        <InputBase
          autoFocus
          inputRef={inputRef}
          onBlur={onStopEdit}
          onChange={(e) => setLocalEditValue(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              e.preventDefault();
              onStopEdit();
            }
          }}
          size={'small'}
          sx={{
            height: '100%',
            width: '100%',
            fontSize: CELL_CONSTANTS.FONT_SIZE,
            display: 'flex',
            alignItems: 'center',
            lineHeight: CELL_CONSTANTS.LINE_HEIGHT,
            '& input': {
              p: 0,
              m: 0,
              height: '100%',
              boxSizing: 'border-box',
              fontSize: CELL_CONSTANTS.FONT_SIZE,
              lineHeight: CELL_CONSTANTS.LINE_HEIGHT,
            },
          }}
          value={localEditValue}
        />
      );
    } else if (cell && isSelectColumn) {
      const label = `${cell.row.index + 1}`;

      return (
        <Stack
          flexDirection={'row'}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <Box display={isRowSelected || isRowHovered ? 'none' : 'block'}>
            {label}
          </Box>
          <Box display={isRowSelected || isRowHovered ? 'block' : 'none'}>
            <Checkbox
              checked={isRowSelected}
              checkedIcon={CHECKBOX_ICON_CHECKED}
              icon={CHECKBOX_ICON_UNCHECKED}
              indeterminateIcon={CHECKBOX_ICON_INDETERMINATE}
              onChange={(e, next) => cell.row.toggleSelected?.(next)}
              onClick={(e) => e.stopPropagation()}
              size={'small'}
              sx={{ p: 0 }}
            />
          </Box>
        </Stack>
      );
    } else if (isAiColumn && isAiLoading && !displayValue && !isFinished) {
      return AI_LOADING_CONTENT;
    }
    return displayValue;
  }, [
    isEditing,
    cell,
    isSelectColumn,
    isEditableCell,
    isAiColumn,
    isAiLoading,
    displayValue,
    isFinished,
    onStopEdit,
    localEditValue,
    isRowSelected,
    isRowHovered,
    isTruncated,
  ]);

  // Check if expanded editor should be shown (truncated text in edit mode)
  const shouldShowExpandedEditor =
    isEditing && isTruncated && !!cell && !isSelectColumn && isEditableCell;

  const onCellClickInternal = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onCellClick(columnId, recordId, cell?.row);
      if (canInteract || isAiColumn) {
        tableMeta?.setCellMode?.(recordId, columnId, 'active');
      }
    },
    [
      onCellClick,
      columnId,
      recordId,
      cell?.row,
      canInteract,
      isAiColumn,
      tableMeta,
    ],
  );

  const onCellDoubleClickInternal = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (canInteract) {
        tableMeta?.setCellMode?.(recordId, columnId, 'edit');
      }
    },
    [canInteract, recordId, columnId, tableMeta],
  );

  const onAiIconClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      tableMeta?.onRunAi?.({
        fieldId: isSelectColumn ? SYSTEM_COLUMN_SELECT : columnId,
        recordId: recordId,
        isHeader: false,
      });
    },
    [columnId, recordId, isSelectColumn, tableMeta],
  );

  const onExpandedEditorValueChange = useCallback((value: string) => {
    setLocalEditValue(value);
  }, []);

  const cellBackgroundColor = getCellBackgroundColor(
    isEditing,
    isActive,
    isSelectColumn,
    hasActiveInRow,
    isRowSelected,
    isColumnHighlighted,
  );

  const onMouseEnter = useCallback(() => setIsCellHovered(true), []);
  const onMouseLeave = useCallback(() => setIsCellHovered(false), []);

  return (
    <Stack
      onClick={onCellClickInternal}
      onDoubleClick={onCellDoubleClickInternal}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={cellRef}
      sx={{
        width,
        minWidth: resolvedMinWidth,
        maxWidth: width,
        boxSizing: 'border-box',
        position: isPinned ? 'sticky' : 'relative',
        left: isPinned ? stickyLeft : 'auto',
        zIndex: isPinned ? 20 : 1,
        bgcolor: cellBackgroundColor,
        borderRight:
          isPinned && shouldShowPinnedRightShadow && !isSelectColumn
            ? CELL_COLORS.PINNED_BORDER
            : CELL_COLORS.REGULAR_BORDER,
        ...(isPinned &&
          shouldShowPinnedRightShadow &&
          !isSelectColumn && {
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -1,
              right: -3,
              width: '3px',
              height: '1px',
              backgroundColor: CELL_COLORS.BORDER,
              zIndex: 10,
              pointerEvents: 'none',
            },
          }),
        height: '100%',
        justifyContent: 'center',
        cursor:
          canInteract || isAiColumn
            ? 'pointer'
            : imagePreview || confidence
              ? 'not-allowed'
              : 'default',
      }}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        fontSize={CELL_CONSTANTS.FONT_SIZE}
        gap={0.5}
        px={CELL_CONSTANTS.PADDING_X}
      >
        {/* Prefix icons: Image Preview & Confidence Indicator */}
        {!isEditing && (imagePreview || confidence) && (
          <StyledTableBodyCellIcons
            confidence={confidence}
            imagePreview={imagePreview}
          />
        )}

        <Box
          ref={textRef}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
            flex: 1,
          }}
        >
          {content}
        </Box>

        {/* Suffix icon: Validation Warning */}
        {!isEditing && !isValidate && fieldType && (
          <StyledTableBodyCellIcons
            fieldType={fieldType}
            isValidate={isValidate}
          />
        )}
      </Stack>

      {/* Expanded editor Popper for truncated text */}
      <StyledTableMenuCellEditor
        anchorEl={cellRef.current}
        isOpen={shouldShowExpandedEditor}
        minWidth={width}
        onCancel={onStopEdit}
        onChange={onExpandedEditorValueChange}
        onSave={onStopEdit}
        value={localEditValue}
      />

      {hasAiColumn &&
        ((isSelectColumn && isRowHovered) || (isAiColumn && isCellHovered)) && (
          <StyledTableAiIcon
            backgroundColor={cellBackgroundColor}
            onClick={onAiIconClick}
          />
        )}
    </Stack>
  );
};
