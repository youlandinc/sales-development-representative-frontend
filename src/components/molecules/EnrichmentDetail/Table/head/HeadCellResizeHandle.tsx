import { FC, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Table } from '@tanstack/react-table';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

import { TABLE_COLORS, TABLE_SIZES, TABLE_Z_INDEX } from '../styles';

interface HeadCellResizeHandleProps {
  columnId: string;
  width: number;
  indicatorHeight: number;
  table: Table<any>;
  onResizeStart?: () => void;
}

export const HeadCellResizeHandle: FC<HeadCellResizeHandleProps> = ({
  columnId,
  width,
  indicatorHeight,
  table,
  onResizeStart,
}) => {
  const [isResizeHovered, setIsResizeHovered] = useState<boolean>(false);
  const [isResizeDragging, setIsResizeDragging] = useState<boolean>(false);
  const [dragPosition, setDragPosition] = useState<number>(0);
  const draggableRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      onMouseEnter={() => setIsResizeHovered(true)}
      onMouseLeave={() => !isResizeDragging && setIsResizeHovered(false)}
      onPointerDown={(e) => e.stopPropagation()}
      sx={{
        position: 'absolute',
        right: -6,
        top: 0,
        height: '100%',
        width: TABLE_SIZES.RESIZE_HANDLE_WIDTH,
        cursor: 'col-resize',
        zIndex: TABLE_Z_INDEX.RESIZE_INDICATOR,
      }}
    >
      <Draggable
        axis="x"
        bounds={{ left: -width + TABLE_SIZES.MIN_COLUMN_WIDTH }}
        nodeRef={draggableRef}
        onDrag={(e: DraggableEvent, data: DraggableData) => {
          setDragPosition(data.x);
        }}
        onStart={() => {
          setIsResizeDragging(true);
          setIsResizeHovered(true);
          onResizeStart?.();
        }}
        onStop={(e: DraggableEvent, data: DraggableData) => {
          setIsResizeDragging(false);
          setIsResizeHovered(false);
          setDragPosition(0);
          // Update column size
          if (data.x !== 0) {
            const newWidth = Math.max(
              TABLE_SIZES.MIN_COLUMN_WIDTH,
              width + data.x,
            );
            table.setColumnSizing((prev: Record<string, number>) => ({
              ...prev,
              [columnId]: newWidth,
            }));
          }
        }}
        position={{ x: dragPosition, y: 0 }}
      >
        <Box
          ref={draggableRef}
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Resize indicator line - shows on hover and drag */}
          {(isResizeHovered || isResizeDragging) && (
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: 0,
                marginLeft: '-1px',
                width: TABLE_SIZES.RESIZE_INDICATOR_WIDTH,
                height: indicatorHeight,
                bgcolor: TABLE_COLORS.SELECTION_BORDER,
              }}
            />
          )}
        </Box>
      </Draggable>
    </Box>
  );
};
