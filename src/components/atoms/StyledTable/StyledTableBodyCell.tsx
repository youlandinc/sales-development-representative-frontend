import { FC, memo, ReactNode, useEffect, useRef, useState } from 'react';
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
    children,
    width,
    isPinned = false,
    stickyLeft = 0,
    isEditing: _isEditing,
    editValue: _editValue,
    isActive: _isActive,
    onCellClick,
    onCellDoubleClick,
    onEditCommit,
    onEditStop,
    rowSelected = false,
  }) => {
    const recordId = cell ? String(cell.row.id) : '';
    const columnId = cell ? String(cell.column.id) : '';
    const value = cell?.getValue();
    const inputRef = useRef<HTMLInputElement>(null);

    const [localEditValue, setLocalEditValue] = useState<string>('');

    const tableMeta = cell?.getContext?.()?.table?.options?.meta as any;
    const canEdit = tableMeta?.canEdit?.(recordId, columnId) ?? true;
    const isAiLoading = tableMeta?.isAiLoading?.(recordId, columnId) ?? false;
    const triggerAiProcess = tableMeta?.triggerAiProcess;

    const isEditingFromMeta =
      tableMeta?.isEditing?.(recordId, columnId) ?? false;
    const isActiveFromMeta = tableMeta?.isActive?.(recordId, columnId) ?? false;
    const isEditing = _isEditing !== undefined ? _isEditing : isEditingFromMeta;
    const isActive = _isActive !== undefined ? _isActive : isActiveFromMeta;

    const columnMeta = cell?.column?.columnDef?.meta as any;
    const actionKey = columnMeta?.actionKey;
    const fieldType = columnMeta?.fieldType;
    const isAiColumn = actionKey === 'use-ai';

    useEffect(() => {
      if (isEditing) {
        const initValue = _editValue !== undefined ? _editValue : value;
        setLocalEditValue(String(initValue ?? ''));
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.select();
          }
        }, 0);
      }
    }, [isEditing, _editValue, value]);

    const displayValue = _editValue !== undefined ? _editValue : value;

    useEffect(() => {
      if (isAiColumn && !isAiLoading && !displayValue && triggerAiProcess) {
        triggerAiProcess(recordId, columnId);
      }
    }, [
      isAiColumn,
      isAiLoading,
      displayValue,
      triggerAiProcess,
      recordId,
      columnId,
    ]);

    const handleEditStop = () => {
      if (localEditValue !== String(displayValue ?? '')) {
        onEditCommit?.(recordId, columnId, localEditValue);
      }
      onEditStop?.(recordId, columnId);
    };

    const content =
      isEditing && cell && cell.column.id !== '__select' && canEdit ? (
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
      ) : cell && cell.column.id === '__select' ? (
        flexRender(cell.column.columnDef.cell, cell.getContext())
      ) : isAiColumn && isAiLoading && !displayValue ? (
        <Stack alignItems="center" direction="row" spacing={1}>
          <CircularProgress size={16} />
          <Box component="span" sx={{ fontSize: 14, color: 'text.secondary' }}>
            Processing...
          </Box>
        </Stack>
      ) : (
        displayValue
      );

    return (
      <Stack
        onClick={(e) => {
          e.stopPropagation();
          if (cell && cell.column.id !== '__select' && canEdit && onCellClick) {
            onCellClick(String(cell.row.id), String(cell.column.id));
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (
            cell &&
            cell.column.id !== '__select' &&
            canEdit &&
            onCellDoubleClick
          ) {
            onCellDoubleClick(String(cell.row.id), String(cell.column.id));
          }
        }}
        sx={{
          width,
          minWidth: width < 100 ? 100 : width,
          maxWidth: width,
          boxSizing: 'border-box',
          position: isPinned ? 'sticky' : 'relative',
          left: isPinned ? stickyLeft : 'auto',
          zIndex: isPinned ? 1 : 0,
          bgcolor: (theme) =>
            isEditing && cell?.column.id !== '__select'
              ? alpha(theme.palette.primary.main, 0.1)
              : isActive && cell?.column.id !== '__select'
                ? alpha(theme.palette.primary.main, 0.06)
                : '#fff',
          borderRight: '0.5px solid #DFDEE6',
          borderTop: 'none',
          borderLeft: 'none',
          boxShadow: (theme) =>
            isActive && cell?.column.id !== '__select'
              ? `inset 0 0 0 .5px ${theme.palette.primary.main}`
              : 'none',
          height: '100%',
          justifyContent: 'center',
          cursor:
            canEdit && cell?.column.id !== '__select' ? 'pointer' : 'default',
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
