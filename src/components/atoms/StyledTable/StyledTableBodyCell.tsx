import {
  FC,
  memo,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
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
import { useRowHover } from './StyledTableBodyRow';

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

export const StyledTableBodyCell: FC<StyledTableBodyCellProps> = memo(
  ({
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
    const isSelectAll =
      (cell?.column?.columnDef?.meta as any)?.selectedColumnId === columnId;

    const inputRef = useRef<HTMLInputElement>(null);

    const [localEditValue, setLocalEditValue] = useState<string>('');

    const tableMeta = cell?.getContext?.()?.table?.options?.meta as any;

    const { isRowHovered } = useRowHover();

    const canEdit = tableMeta?.canEdit?.(recordId, columnId) ?? true;
    const isAiLoading = tableMeta?.isAiLoading?.(recordId, columnId) ?? false;
    const isFinished = tableMeta?.isFinished?.(recordId, columnId) ?? false;
    const externalContent = tableMeta?.getExternalContent?.(recordId, columnId);
    const triggerAiProcess = tableMeta?.triggerAiProcess;
    const canInteract = Boolean(cell && !isSelectColumn && canEdit);

    const isEditingFromMeta =
      tableMeta?.isEditing?.(recordId, columnId) ?? false;
    const isActiveFromMeta = tableMeta?.isActive?.(recordId, columnId) ?? false;
    const isEditing = _isEditing !== undefined ? _isEditing : isEditingFromMeta;
    const isActive = _isActive !== undefined ? _isActive : isActiveFromMeta;

    const columnMeta = cell?.column?.columnDef?.meta as any;
    const actionKey = columnMeta?.actionKey;
    const fieldType = columnMeta?.fieldType;
    const isAiColumn = actionKey === 'use-ai';

    const resolvedMinWidth = width < 100 ? 100 : width;

    useEffect(() => {
      if (isEditing) {
        const initValue = _editValue !== undefined ? _editValue : displayValue;
        setLocalEditValue(String(initValue ?? ''));
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.select();
          }
        }, 0);
      }
    }, [isEditing, _editValue, displayValue]);

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

    const handleEditStop = useCallback(() => {
      if (localEditValue !== String(displayValue ?? '')) {
        tableMeta?.updateData?.(recordId, columnId, localEditValue);
      }
      tableMeta?.setCellMode?.(recordId, columnId, 'clear');
    }, [localEditValue, displayValue, tableMeta, recordId, columnId]);

    const content = useMemo(() => {
      if (isEditing && cell && !isSelectColumn && canEdit) {
        return (
          <InputBase
            autoFocus
            inputRef={inputRef}
            onBlur={handleEditStop}
            onChange={(e) => setLocalEditValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                handleEditStop();
              }
            }}
            size={'small'}
            sx={{
              height: '100%',
              width: '100%',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              lineHeight: '36px',
              '& input': {
                p: 0,
                m: 0,
                height: '100%',
                boxSizing: 'border-box',
                fontSize: 14,
                lineHeight: '36px',
              },
            }}
            value={localEditValue}
          />
        );
      }
      if (cell && isSelectColumn) {
        const label = `${cell.row.index + 1}`;
        const checked = cell.row.getIsSelected?.() ?? false;

        return (
          <Stack
            flexDirection={'row'}
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <Box display={checked || isRowHovered ? 'none' : 'block'}>
              {label}
            </Box>
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
      }
      if (isAiColumn && isAiLoading && !displayValue && !isFinished) {
        return (
          <Stack alignItems="center" direction="row" spacing={1}>
            <CircularProgress size={16} />
            <Box
              component="span"
              sx={{ fontSize: 14, color: 'text.secondary' }}
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
      canEdit,
      isAiColumn,
      isAiLoading,
      displayValue,
      isFinished,
      handleEditStop,
      localEditValue,
      isRowHovered,
    ]);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onCellClick(columnId, recordId, cell?.row);
        if (canInteract) {
          tableMeta?.setCellMode?.(recordId, columnId, 'active');
        }
      },
      [cell, onCellClick, recordId, columnId, canInteract, tableMeta],
    );

    const handleDoubleClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (canInteract) {
          tableMeta?.setCellMode?.(recordId, columnId, 'edit');
        }
      },
      [canInteract, tableMeta, recordId, columnId],
    );

    return (
      <Stack
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        sx={{
          width,
          minWidth: resolvedMinWidth,
          maxWidth: width,
          boxSizing: 'border-box',
          position: isPinned ? 'sticky' : 'relative',
          left: isPinned ? stickyLeft : 'auto',
          zIndex: isPinned ? 20 : 1,
          bgcolor:
            isEditing && !isSelectColumn
              ? '#F7F4FD'
              : isActive && !isSelectColumn
                ? '#F7F4FD'
                : isSelectColumn && hasActiveInRow
                  ? '#F7F4FD'
                  : rowSelected || isSelectAll
                    ? '#F7F4FD'
                    : '#fff',
          borderRight:
            isPinned && showPinnedRightShadow && !isSelectColumn
              ? '3px solid #DFDEE6'
              : '0.5px solid #DFDEE6',
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
                backgroundColor: '#DFDEE6',
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
          cursor: canInteract ? 'pointer' : 'default',
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
            width: '100%',
            fontSize: 14,
            px: 1.5,
          }}
        >
          {content}
        </Box>
      </Stack>
    );
  },
);
