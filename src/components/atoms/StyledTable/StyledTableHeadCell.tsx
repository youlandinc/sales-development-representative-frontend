import {
  FC,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, Checkbox, Icon, InputBase, Stack } from '@mui/material';
import { flexRender, Header } from '@tanstack/react-table';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

import { StyledTableAiIcon } from './index';

import { COLUMN_TYPE_ICONS, SYSTEM_COLUMN_SELECT } from '@/constants/table';
import { UTypeOf } from '@/utils';
import { TableColumnMeta, TableColumnTypeEnum } from '@/types/enrichment/table';
import { StyledImage } from '@/components/atoms/StyledImage';

interface StyledTableHeadCellProps {
  header?: Header<any, unknown>;
  children?: ReactNode;
  width: number;
  isPinned?: boolean;
  stickyLeft?: number;
  measureRef?: (node: HTMLElement | null) => void;
  dataIndex?: number;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onDoubleClick?: (e: MouseEvent<HTMLElement>) => void;
  onContextMenu?: (e: MouseEvent<HTMLElement>) => void;
  canResize?: boolean;
  isActive?: boolean; // Background color (cleared on click away)
  isFocused?: boolean; // Bottom line (persists until clicking another header)
  isEditing?: boolean;
  onEditSave?: (newName: string) => void;
  shouldShowPinnedRightShadow?: boolean;
  // For non-pinned columns adjacent to pinned columns, extend focus line left
  isAdjacentToPinnedColumn?: boolean;
  // Select column checkbox props (passed directly to bypass TanStack column caching)
  isAllRowsSelected?: boolean;
  isSomeRowsSelected?: boolean;
  onToggleAllRows?: (event: unknown) => void;
  // Resize indicator height (table body height)
  indicatorHeight?: number;
  // Callback when resize starts
  onResizeStart?: () => void;
}

export const StyledTableHeadCell: FC<StyledTableHeadCellProps> = ({
  header,
  children,
  width,
  isPinned = false,
  stickyLeft = 0,
  measureRef,
  dataIndex,
  onClick,
  onDoubleClick,
  onContextMenu,
  canResize,
  isActive = false,
  isFocused = false,
  isEditing = false,
  onEditSave,
  shouldShowPinnedRightShadow,
  isAllRowsSelected,
  isSomeRowsSelected,
  onToggleAllRows,
  indicatorHeight = 500,
  onResizeStart,
}) => {
  const [localEditValue, setLocalEditValue] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResizeHovered, setIsResizeHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragPosition, setDragPosition] = useState<number>(0);
  const draggableRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const originalValueRef = useRef<string>('');

  const tableMeta = header?.getContext?.()?.table?.options?.meta as any;
  const isSelectColumn = header?.column?.id === SYSTEM_COLUMN_SELECT;

  // Get column meta from columnDef (contains all column configuration)
  const columnMeta = header?.column?.columnDef?.meta as
    | TableColumnMeta
    | undefined;
  const { isAiColumn = false, actionDefinition } = columnMeta || {};

  // For select column, render Checkbox directly (bypass TanStack column caching)
  const content =
    isSelectColumn && onToggleAllRows ? (
      <Checkbox
        checked={isAllRowsSelected}
        checkedIcon={
          <StyledImage
            sx={{ width: 20, height: 20, position: 'relative' }}
            url={'/images/icon-checkbox-check.svg'}
          />
        }
        icon={
          <StyledImage
            sx={{ width: 20, height: 20, position: 'relative' }}
            url={'/images/icon-checkbox-static.svg'}
          />
        }
        indeterminate={isSomeRowsSelected}
        indeterminateIcon={
          <StyledImage
            sx={{ width: 20, height: 20, position: 'relative' }}
            url={'/images/icon-checkbox-intermediate.svg'}
          />
        }
        onChange={onToggleAllRows}
        onClick={(e) => e.stopPropagation()}
        size="small"
        sx={{ p: 0 }}
      />
    ) : header ? (
      flexRender(header.column.columnDef.header, header.getContext())
    ) : (
      children
    );

  useEffect(() => {
    if (isEditing) {
      const initialValue = UTypeOf.isString(content) ? content : '';
      originalValueRef.current = initialValue;
      setLocalEditValue(initialValue);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(0, inputRef.current.value.length);
        }
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const saveEdit = useCallback(() => {
    const trimmedValue = localEditValue.trim();
    if (trimmedValue && trimmedValue !== originalValueRef.current) {
      onEditSave?.(trimmedValue);
    } else {
      tableMeta?.stopHeaderEdit?.();
    }
  }, [localEditValue, onEditSave, tableMeta]);

  const cancelEdit = useCallback(() => {
    tableMeta?.stopHeaderEdit?.();
  }, [tableMeta]);

  const onInputKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    },
    [saveEdit, cancelEdit],
  );

  const onAiIconClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      if (isAiColumn && header) {
        const columnId = header.column.id;
        tableMeta?.openAiRunMenu?.(e.currentTarget as HTMLElement, columnId);
      }
    },
    [isAiColumn, tableMeta, header],
  );

  // Visual rules:
  // - Background color: isActive && !isEditing
  // - Bottom line: isFocused && !isActive && !isEditing
  //   - Cell selected: isActive=false, isFocused=true → show bottom line
  //   - Header click away: activeColumnId cleared → isActive=false, isFocused=true → show bottom line
  //   - Header active (menu open or closed): isActive=true → no bottom line
  const shouldShowBackground = isActive && !isEditing;
  const shouldShowBottomLine = isFocused && !isActive && !isEditing;
  const headerBackgroundColor =
    shouldShowBackground || (isHovered && !isEditing) ? '#F4F5F9' : '#FFFFFF';

  return (
    <Stack
      data-index={dataIndex}
      data-table-header
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
      onMouseEnter={isSelectColumn ? undefined : () => setIsHovered(true)}
      onMouseLeave={isSelectColumn ? undefined : () => setIsHovered(false)}
      ref={measureRef}
      sx={{
        userSelect: 'none',
        width,
        minWidth: width < 60 ? 60 : width,
        maxWidth: width,
        boxSizing: 'border-box',
        overflow: 'visible',
        // Use pseudo-element for pinned border so it renders outside content box
        borderRight:
          isPinned && shouldShowPinnedRightShadow && !isSelectColumn
            ? '0.5px solid transparent'
            : '0.5px solid #DFDEE6',
        bgcolor: shouldShowBackground ? '#F4F5F9' : '#FFFFFF',
        cursor: 'pointer',
        // Pinned column 3px border (pseudo-element, outside content box)
        '&::before': {
          content:
            isPinned && shouldShowPinnedRightShadow && !isSelectColumn
              ? '""'
              : 'none',
          position: 'absolute',
          top: 0,
          right: -0.5,
          width: '3px',
          height: '100%',
          bgcolor: '#DFDEE6',
          zIndex: 30,
        },
        // Focus indicator line
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          // Extend left for non-pinned columns adjacent to pinned columns
          left: 0,
          // Extend right for pinned columns with border
          right: 0,
          height: '2px',
          bgcolor: '#6F6C7D',
          zIndex: 31,
          display: shouldShowBottomLine ? 'block' : 'none',
        },
        position: isPinned ? 'sticky' : 'relative',
        left: isPinned ? stickyLeft : 'auto',
        zIndex: isPinned ? 30 : 2,
        '&:hover': {
          bgcolor: isSelectColumn
            ? undefined
            : !isEditing
              ? '#F4F5F9'
              : '#F6F6F6',
        },
        height: '36px',
        justifyContent: 'center',
        fontSize: 14,
        lineHeight: '36px',
        color: '#363440',
        fontWeight: 500,
      }}
    >
      <Box
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
          width:
            isPinned && shouldShowPinnedRightShadow && isEditing
              ? 'calc(100% - 3px)'
              : '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          boxShadow: (theme) =>
            isEditing
              ? `inset 0 0 0 .5px ${theme.palette.primary.main}`
              : 'none',
          position: 'relative',
        }}
      >
        {isEditing ? (
          <InputBase
            inputProps={{
              ref: inputRef,
            }}
            onBlur={saveEdit}
            onChange={(e) => setLocalEditValue(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onKeyDown={onInputKeyDown}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: 'text.primary',
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              '& input': {
                padding: 0,
                textAlign: 'left',
                height: '100%',
              },
            }}
            value={localEditValue}
          />
        ) : (
          <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
            {header && !isSelectColumn && (
              <>
                {actionDefinition?.logoUrl ? (
                  <Box
                    alt={actionDefinition.integrationName || 'integration logo'}
                    component="img"
                    src={actionDefinition.logoUrl}
                    sx={{
                      width: 16,
                      height: 16,
                      flexShrink: 0,
                      borderRadius: '2px',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Icon
                    component={
                      COLUMN_TYPE_ICONS[
                        columnMeta?.fieldType as TableColumnTypeEnum
                      ] || COLUMN_TYPE_ICONS[TableColumnTypeEnum.text]
                    }
                    sx={{ width: 16, height: 16 }}
                  />
                )}
              </>
            )}
            {content}
          </Stack>
        )}
        {!isEditing && isAiColumn && (
          <StyledTableAiIcon
            backgroundColor={headerBackgroundColor}
            onClick={onAiIconClick}
          />
        )}
      </Box>

      {header &&
        canResize !== false &&
        header.column.getCanResize?.() !== false && (
          <Box
            onMouseEnter={() => setIsResizeHovered(true)}
            onMouseLeave={() => !isDragging && setIsResizeHovered(false)}
            onPointerDown={(e) => e.stopPropagation()}
            sx={{
              position: 'absolute',
              right: -6,
              top: 0,
              height: '100%',
              width: '15px',
              cursor: 'col-resize',
              zIndex: 999,
            }}
          >
            <Draggable
              axis="x"
              bounds={{ left: -width + 80 }}
              nodeRef={draggableRef}
              onDrag={(e: DraggableEvent, data: DraggableData) => {
                setDragPosition(data.x);
              }}
              onStart={() => {
                setIsDragging(true);
                setIsResizeHovered(true);
                onResizeStart?.();
              }}
              onStop={(e: DraggableEvent, data: DraggableData) => {
                setIsDragging(false);
                setIsResizeHovered(false);
                setDragPosition(0);
                // Update column size
                if (data.x !== 0) {
                  const newWidth = Math.max(80, width + data.x);
                  const table = header.getContext().table;
                  table.setColumnSizing((prev: Record<string, number>) => ({
                    ...prev,
                    [header.column.id]: newWidth,
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
                {(isResizeHovered || isDragging) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      marginLeft: '-1px',
                      width: '3px',
                      height: indicatorHeight,
                      bgcolor: '#363440',
                    }}
                  />
                )}
              </Box>
            </Draggable>
          </Box>
        )}
    </Stack>
  );
};
