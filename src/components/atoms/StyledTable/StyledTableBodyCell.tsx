import { FC, ReactNode } from 'react';
import { Skeleton, Stack } from '@mui/material';
import { Cell } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import React from 'react';

interface StyledTableBodyCellProps {
  cell?: Cell<any, unknown>;
  children?: ReactNode;
  width: number;
  isPinned?: boolean;
  stickyLeft?: number;
  isLoading?: boolean;
  // used to break React.memo when edit mode toggles for this cell
  isEditing?: boolean;
  // used to break React.memo when the edited value changes for this cell
  editValue?: any;
}

export const StyledTableBodyCell: FC<StyledTableBodyCellProps> = React.memo(
  ({
    cell,
    children,
    width,
    isPinned = false,
    stickyLeft = 0,
    isLoading = false,
    isEditing: _isEditing = false,
    editValue: _editValue,
  }) => {
    const content = cell
      ? flexRender(cell.column.columnDef.cell, cell.getContext())
      : children;

    return (
      <Stack
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
          borderRight: '1px solid #DFDEE6',
          borderBottom: '1px solid #F0EFF5',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        {content}
        {/*{isLoading ? (*/}
        {/*  <Skeleton height={16} variant="text" width={80} />*/}
        {/*) : (*/}
        {/*  content*/}
        {/*)}*/}
      </Stack>
    );
  },
);
