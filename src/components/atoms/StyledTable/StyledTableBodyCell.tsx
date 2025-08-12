import { FC, memo, ReactNode, useEffect, useRef, useState } from 'react';
import { InputBase, Stack } from '@mui/material';
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
  onCellClick?: (rowId: string, columnId: string) => void;
  onCellDoubleClick?: (rowId: string, columnId: string) => void;
  onEditCommit?: (rowId: string, columnId: string, value: any) => void;
  onEditStop?: (rowId: string, columnId: string) => void;
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
    const rowId = cell ? String(cell.row.id) : '';
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
        onEditCommit?.(rowId, columnId, localEditValue);
      }
      onEditStop?.(rowId, columnId);
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
          display: 'flex',
          width,
          minWidth: width,
          maxWidth: width,
          px: 2,
          py: 1,
          position: isPinned ? 'sticky' : 'relative',
          left: isPinned ? stickyLeft : 'auto',
          zIndex: isPinned ? 1 : 0,
          bgcolor: isPinned ? '#FFFFFF' : 'transparent',
          borderRight:
            _isActive && cell?.column.id !== '__select'
              ? '2px solid #6E4EFB'
              : '1px solid #DFDEE6',
          borderBottom:
            _isActive && cell?.column.id !== '__select'
              ? '2px solid #6E4EFB'
              : '1px solid #F0EFF5',
          borderTop:
            _isActive && cell?.column.id !== '__select'
              ? '2px solid #6E4EFB'
              : 'none',
          borderLeft:
            _isActive && cell?.column.id !== '__select'
              ? '2px solid #6E4EFB'
              : 'none',
          height: '100%',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {content}
      </Stack>
    );
  },
);
