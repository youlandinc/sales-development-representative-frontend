import { FC, memo, MouseEvent, ReactNode } from 'react';
import { Stack } from '@mui/material';
import { flexRender, Header } from '@tanstack/react-table';

interface StyledTableHeadCellProps {
  header?: Header<any, unknown>;
  children?: ReactNode;
  width: number;
  isPinned?: boolean;
  stickyLeft?: number;
  measureRef?: (node: HTMLElement | null) => void;
  dataIndex?: number;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export const StyledTableHeadCell: FC<StyledTableHeadCellProps> = memo(
  ({
    header,
    children,
    width,
    isPinned = false,
    stickyLeft = 0,
    measureRef,
    dataIndex,
    onClick,
  }) => {
    const content = header
      ? flexRender(header.column.columnDef.header, header.getContext())
      : children;

    return (
      <Stack
        data-index={dataIndex}
        onClick={onClick}
        ref={measureRef}
        sx={{
          userSelect: 'none',
          display: 'flex',
          width,
          minWidth: width,
          maxWidth: width,
          boxSizing: 'border-box',
          borderRight: '1px solid #DFDEE6',
          borderBottom: '1px solid #DFDEE6',
          px: 2,
          bgcolor: '#FFFFFF',
          cursor: 'pointer',
          position: isPinned ? 'sticky' : 'relative',
          left: isPinned ? stickyLeft : 'auto',
          zIndex: isPinned ? 3 : 1,
          '&:hover': { bgcolor: '#F6F6F6' },
          height: '36px',
          justifyContent: 'center',
          fontSize: 14,
          lineHeight: '36px',
          color: 'text.secondary',
          fontWeight: 600,
        }}
      >
        {content}

        {header?.column.getCanResize?.() !== false && (
          <Stack
            onMouseDown={(e) => {
              e.stopPropagation();
              header?.getResizeHandler?.()(e);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              header?.getResizeHandler?.()(e);
            }}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              width: '12px',
              cursor: 'col-resize',
              zIndex: 4,
              backgroundColor: 'transparent',
              borderRight: '2px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                borderRight: '2px solid #1976d2',
              },
              '&:active': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                borderRight: '2px solid #1565c0',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '3px',
                height: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '1.5px',
                opacity: 0,
                transition: 'opacity 0.2s ease',
              },
              '&:hover::after': {
                opacity: 1,
              },
            }}
          />
        )}
      </Stack>
    );
  },
);
