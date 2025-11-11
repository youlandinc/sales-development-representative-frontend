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

import { SYSTEM_COLUMN_SELECT } from '@/constant/table';
import { TableCellFieldData, TableColumnMeta } from '@/types/Prospect/table';

import {
  StyledTableAiIcon,
  StyledTableBodyCellIcons,
  useRowHover,
} from './index';

const CELL_CONSTANTS = {
  MIN_WIDTH: 60,
  FONT_SIZE: 14,
  LINE_HEIGHT: '36px',
  PROGRESS_SIZE: 16,
  PADDING_X: 1.5,
} as const;

const CELL_COLORS = {
  ACTIVE_BG: '#F7F4FD',
  DEFAULT_BG: '#fff',
  BORDER: '#DFDEE6',
  PINNED_BORDER: '3px solid #DFDEE6',
  REGULAR_BORDER: '0.5px solid #DFDEE6',
} as const;

const getCellBackgroundColor = (
  isEditing: boolean,
  isActive: boolean,
  isSelectColumn: boolean,
  hasActiveInRow: boolean,
  rowSelected: boolean,
  isColumnSelected: boolean,
): string => {
  if ((isEditing || isActive) && !isSelectColumn) {
    return CELL_COLORS.ACTIVE_BG;
  }
  if (isSelectColumn && hasActiveInRow) {
    return CELL_COLORS.ACTIVE_BG;
  }
  if (rowSelected || isColumnSelected) {
    return CELL_COLORS.ACTIVE_BG;
  }
  return CELL_COLORS.DEFAULT_BG;
};

interface StyledTableBodyCellProps {
  cell?: Cell<any, unknown>;
  width: number;
  isPinned?: boolean;
  stickyLeft?: number;
  showPinnedRightShadow?: boolean;
  onCellClick: (columnId: string, rowId: string, data: any) => void;
}

export const StyledTableBodyCell: FC<StyledTableBodyCellProps> = ({
  cell,
  width,
  isPinned = false,
  stickyLeft = 0,
  showPinnedRightShadow,
  onCellClick,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localEditValue, setLocalEditValue] = useState<string>('');

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

  const rowSelected = row?.getIsSelected?.() ?? false;

  const columnMeta = column?.columnDef?.meta as TableColumnMeta | undefined;
  const { fieldType, canEdit = false, isAiColumn = false } = columnMeta || {};

  const selectedColumnId = tableMeta?.selectedColumnId;
  const isColumnSelected = selectedColumnId === columnId;

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
    if (isEditing && cell && !isSelectColumn && isEditableCell) {
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
          <Box display={rowSelected || isRowHovered ? 'none' : 'block'}>
            {label}
          </Box>
          <Box display={rowSelected || isRowHovered ? 'block' : 'none'}>
            <Checkbox
              checked={rowSelected}
              onChange={(e, next) => cell.row.toggleSelected?.(next)}
              onClick={(e) => e.stopPropagation()}
              size={'small'}
              sx={{ p: 0 }}
            />
          </Box>
        </Stack>
      );
    } else if (isAiColumn && isAiLoading && !displayValue && !isFinished) {
      return (
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
    rowSelected,
    isRowHovered,
  ]);

  const onClickCell = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onCellClick(columnId, recordId, cell?.row);
      if (canInteract || isAiColumn) {
        tableMeta?.setCellMode?.(recordId, columnId, 'active');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCellClick, columnId, recordId, cell?.row, canInteract, isAiColumn],
  );

  const onDoubleClickCell = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (canInteract) {
        tableMeta?.setCellMode?.(recordId, columnId, 'edit');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canInteract, recordId, columnId],
  );

  const onClickAiIcon = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      tableMeta?.onRunAi?.({
        fieldId: isSelectColumn ? SYSTEM_COLUMN_SELECT : columnId,
        recordId: recordId,
        isHeader: false,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnId, recordId, isSelectColumn],
  );

  const cellBackgroundColor = getCellBackgroundColor(
    isEditing,
    isActive,
    isSelectColumn,
    hasActiveInRow,
    rowSelected,
    isColumnSelected,
  );

  const onMouseEnter = useCallback(() => setIsCellHovered(true), []);
  const onMouseLeave = useCallback(() => setIsCellHovered(false), []);

  return (
    <Stack
      onClick={onClickCell}
      onDoubleClick={onDoubleClickCell}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
          isPinned && showPinnedRightShadow && !isSelectColumn
            ? CELL_COLORS.PINNED_BORDER
            : CELL_COLORS.REGULAR_BORDER,
        ...(isPinned &&
          showPinnedRightShadow &&
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
        boxShadow: (theme) =>
          isActive && !isSelectColumn
            ? `inset 0 0 0 .5px ${theme.palette.primary.main}`
            : 'none',
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
      {hasAiColumn &&
        ((isSelectColumn && isRowHovered) || (isAiColumn && isCellHovered)) && (
          <StyledTableAiIcon
            backgroundColor={cellBackgroundColor}
            onClick={onClickAiIcon}
          />
        )}
    </Stack>
  );
};
