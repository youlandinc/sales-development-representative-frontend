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
import { Box, CircularProgress, InputBase, Stack } from '@mui/material';
import { Cell, flexRender } from '@tanstack/react-table';
import { alpha } from '@mui/material/styles';

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
  onCellClick?: (recordId: string, columnId: string) => void;
  onCellDoubleClick?: (recordId: string, columnId: string) => void;
  onEditCommit?: (recordId: string, columnId: string, value: any) => void;
  onEditStop?: (recordId: string, columnId: string) => void;
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
    onCellClick,
    onCellDoubleClick,
    onEditCommit,
    onEditStop,
  }) => {
    const recordId = cell ? String(cell.row.id) : '';
    const columnId = cell ? String(cell.column.id) : '';
    const value = cell?.getValue();
    const displayValue = value != null ? String(value) : '';
    const isSelectColumn = cell?.column?.id === '__select';

    const inputRef = useRef<HTMLInputElement>(null);

    const [localEditValue, setLocalEditValue] = useState<string>('');

    const tableMeta = cell?.getContext?.()?.table?.options?.meta as any;
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

    // 调试AI状态
    if (isAiColumn) {
      // console.log('AI Column Debug:', {
      //   recordId,
      //   columnId,
      //   isAiColumn,
      //   isAiLoading,
      //   isFinished,
      //   displayValue,
      //   actionKey,
      // });
    }

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
        onEditCommit?.(recordId, columnId, localEditValue);
      }
      onEditStop?.(recordId, columnId);
    }, [
      localEditValue,
      displayValue,
      onEditCommit,
      recordId,
      columnId,
      onEditStop,
    ]);

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
        return flexRender(cell.column.columnDef.cell, cell.getContext());
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
      localEditValue,
      handleEditStop,
      isAiColumn,
      isAiLoading,
      displayValue,
      isFinished,
    ]);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (canInteract && onCellClick) {
          onCellClick(recordId, columnId);
        }
      },
      [canInteract, onCellClick, recordId, columnId],
    );

    const handleDoubleClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (canInteract && onCellDoubleClick) {
          onCellDoubleClick(recordId, columnId);
        }
      },
      [canInteract, onCellDoubleClick, recordId, columnId],
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
          zIndex: isPinned ? 1 : 0,
          bgcolor: '#fff',
          '&::before':
            rowSelected || isEditing || isActive
              ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: (theme) =>
                    isEditing && !isSelectColumn
                      ? alpha(theme.palette.primary.main, 0.1)
                      : isActive && !isSelectColumn
                        ? alpha(theme.palette.primary.main, 0.06)
                        : rowSelected
                          ? alpha(theme.palette.primary.main, 0.06)
                          : 'transparent',
                  pointerEvents: 'none',
                  zIndex: 0,
                }
              : {},
          borderRight: '0.5px solid #DFDEE6',
          borderTop: 'none',
          borderLeft: 'none',
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
