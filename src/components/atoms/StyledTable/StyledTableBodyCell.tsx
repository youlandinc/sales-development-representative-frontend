import {
  FC,
  MouseEvent,
  ReactNode,
  startTransition,
  useEffect,
  useLayoutEffect,
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
import { useRowHover } from './StyledTableBodyRow';
import { StyledTableAiIcon } from './index';

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
  children?: ReactNode;
  width: number;
  isPinned?: boolean;
  stickyLeft?: number;
  isEditing?: boolean;
  editValue?: any;
  isActive?: boolean;
  rowSelected?: boolean;
  showPinnedRightShadow?: boolean;
  hasActiveInRow?: boolean;
  onCellClick: (columnId: string, rowId: string, data: any) => void;
}

export const StyledTableBodyCell: FC<StyledTableBodyCellProps> = ({
  cell,
  width,
  isPinned = false,
  stickyLeft = 0,
  isEditing: _isEditing,
  editValue: _editValue,
  isActive: _isActive,
  rowSelected = false,
  showPinnedRightShadow,
  hasActiveInRow = false,
  onCellClick,
}) => {
  const recordId = cell ? String(cell.row.id) : '';
  const columnId = cell ? String(cell.column.id) : '';
  const value = cell?.getValue();
  const displayValue = value != null ? String(value) : '';
  const isSelectColumn = cell?.column?.id === '__select';
  const isColumnSelected =
    (cell?.column?.columnDef?.meta as any)?.selectedColumnId === columnId;

  const inputRef = useRef<HTMLInputElement>(null);

  const [localEditValue, setLocalEditValue] = useState<string>('');

  const tableMeta = cell?.getContext?.()?.table?.options?.meta as any;

  const { isRowHovered } = useRowHover();

  const isEditingFromMeta = tableMeta?.isEditing?.(recordId, columnId) ?? false;
  const isActiveFromMeta = tableMeta?.isActive?.(recordId, columnId) ?? false;
  const isEditing = _isEditing !== undefined ? _isEditing : isEditingFromMeta;
  const isActive = _isActive !== undefined ? _isActive : isActiveFromMeta;

  const columnMeta = cell?.column?.columnDef?.meta as any;
  const actionKey = columnMeta?.actionKey;
  const fieldType = columnMeta?.fieldType;
  const isAiColumn = actionKey === 'use-ai' || actionKey?.includes('find');

  const canEdit = columnId !== '__select' && actionKey !== 'use-ai';
  const canInteract = Boolean(cell && !isSelectColumn && canEdit);

  const isAiLoading = tableMeta?.isAiLoading?.(recordId, columnId) ?? false;

  const cellValueObj = typeof value === 'object' && value !== null ? value : {};
  const isFinished =
    'isFinished' in cellValueObj ? cellValueObj.isFinished : false;
  const externalContent =
    'externalContent' in cellValueObj
      ? cellValueObj.externalContent
      : undefined;

  const triggerAiProcess = tableMeta?.triggerAiProcess;
  const hasAiColumnInRow = tableMeta?.hasAiColumnInRow?.(recordId) ?? false;

  const [isCellHovered, setIsCellHovered] = useState(false);

  const resolvedMinWidth =
    width < CELL_CONSTANTS.MIN_WIDTH ? CELL_CONSTANTS.MIN_WIDTH : width;

  useEffect(() => {
    if (isEditing) {
      const initValue = _editValue !== undefined ? _editValue : displayValue;
      setLocalEditValue(String(initValue ?? ''));
    }
  }, [isEditing, _editValue, displayValue]);

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
      triggerAiProcess
    ) {
      triggerAiProcess(recordId, columnId);
    }
  }, [
    isAiColumn,
    isAiLoading,
    displayValue,
    isFinished,
    triggerAiProcess,
    recordId,
    columnId,
  ]);

  const onStopEdit = () => {
    startTransition(() => {
      if (localEditValue !== String(displayValue ?? '')) {
        tableMeta?.updateData?.(recordId, columnId, localEditValue);
      }
      tableMeta?.setCellMode?.(recordId, columnId, 'clear');
    });
  };

  let content: ReactNode;
  if (isEditing && cell && !isSelectColumn && canEdit) {
    content = (
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
    const checked = cell.row.getIsSelected?.() ?? false;

    content = (
      <Stack
        flexDirection={'row'}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Box display={checked || isRowHovered ? 'none' : 'block'}>{label}</Box>
        <Box display={checked || isRowHovered ? 'block' : 'none'}>
          <Checkbox
            checked={checked}
            onChange={(e, next) => cell.row.toggleSelected?.(next)}
            onClick={(e) => e.stopPropagation()}
            size={'small'}
            sx={{ p: 0 }}
          />
        </Box>
      </Stack>
    );
  } else if (isAiColumn && isAiLoading && !displayValue && !isFinished) {
    content = (
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
  } else {
    content = displayValue;
  }

  const onClickCell = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onCellClick(columnId, recordId, cell?.row);
    if (canInteract || isAiColumn) {
      tableMeta?.setCellMode?.(recordId, columnId, 'active');
    }
  };

  const onDoubleClickCell = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (canInteract) {
      tableMeta?.setCellMode?.(recordId, columnId, 'edit');
    }
  };

  const onClickAiIcon = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    tableMeta?.onRunAi?.({
      fieldId: columnId,
      recordId: recordId,
      isHeader: false,
    });
  };

  const cellBackgroundColor = getCellBackgroundColor(
    isEditing,
    isActive,
    isSelectColumn,
    hasActiveInRow,
    rowSelected,
    isColumnSelected,
  );

  return (
    <Stack
      onClick={onClickCell}
      onDoubleClick={onDoubleClickCell}
      onMouseEnter={() => setIsCellHovered(true)}
      onMouseLeave={() => setIsCellHovered(false)}
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
        cursor: canInteract || isAiColumn ? 'pointer' : 'default',
      }}
    >
      <Box
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
          width: '100%',
          fontSize: CELL_CONSTANTS.FONT_SIZE,
          px: CELL_CONSTANTS.PADDING_X,
        }}
      >
        {content}
      </Box>
      {hasAiColumnInRow &&
        ((isSelectColumn && isRowHovered) || (isAiColumn && isCellHovered)) && (
          <StyledTableAiIcon
            backgroundColor={cellBackgroundColor}
            onClick={onClickAiIcon}
          />
        )}
    </Stack>
  );
};
