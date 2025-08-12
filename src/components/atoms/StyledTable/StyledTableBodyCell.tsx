import { FC, memo, ReactNode, useEffect, useRef, useState } from 'react';
import { Box, InputBase, Stack } from '@mui/material';
import { Cell, flexRender } from '@tanstack/react-table';

interface StyledTableBodyCellProps {
  cell?: Cell<any, unknown>;
  children?: ReactNode;
  width: number;
  isPinned?: boolean;
  stickyLeft?: number;
  isEditing?: boolean;
  editValue?: any;
  isActive?: boolean;
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
    isEditing: _isEditing = false,
    editValue: _editValue,
    isActive: _isActive,
    onCellClick,
    onCellDoubleClick,
    onEditCommit,
    onEditStop,
  }) => {
    const recordId = cell ? String(cell.row.id) : '';
    const columnId = cell ? String(cell.column.id) : '';
    const value = cell?.getValue();
    const inputRef = useRef<HTMLInputElement>(null);

    const [localEditValue, setLocalEditValue] = useState<string>('');

    useEffect(() => {
      if (_isEditing) {
        const initValue = _editValue !== undefined ? _editValue : value;
        setLocalEditValue(String(initValue ?? ''));
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.select();
          }
        }, 0);
      }
    }, [_isEditing, _editValue, value]);

    const displayValue = _editValue !== undefined ? _editValue : value;

    const handleEditStop = () => {
      if (localEditValue !== String(displayValue ?? '')) {
        onEditCommit?.(recordId, columnId, localEditValue);
      }
      onEditStop?.(recordId, columnId);
    };

    const content =
      _isEditing && cell && cell.column.id !== '__select' ? (
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
      ) : (
        displayValue
      );

    return (
      <Stack
        onClick={(e) => {
          e.stopPropagation();
          if (cell && cell.column.id !== '__select' && onCellClick) {
            onCellClick(String(cell.row.id), String(cell.column.id));
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (cell && cell.column.id !== '__select' && onCellDoubleClick) {
            onCellDoubleClick(String(cell.row.id), String(cell.column.id));
          }
        }}
        sx={{
          width,
          minWidth: width,
          maxWidth: width,
          boxSizing: 'border-box',
          px: 2,
          position: isPinned ? 'sticky' : 'relative',
          left: isPinned ? stickyLeft : 'auto',
          zIndex: isPinned ? 1 : 0,
          bgcolor: isPinned ? '#FFFFFF' : 'transparent',
          borderRight: '0.5px solid #DFDEE6',
          borderTop: 'none',
          borderLeft: 'none',
          boxShadow:
            _isActive && cell?.column.id !== '__select'
              ? 'inset 0 0 0 2px #6E4EFB'
              : 'none',
          height: '100%',
          justifyContent: 'center',
          cursor: 'pointer',
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
          }}
        >
          {content}
        </Box>
      </Stack>
    );
  },
);
