import {
  CSSProperties,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, Stack } from '@mui/material';
import { flexRender, HeaderContext } from '@tanstack/react-table';

import { HeadCellCheckbox } from './HeadCellCheckbox';
import { HeadCellContent } from './HeadCellContent';
import { HeadCellEditor } from './HeadCellEditor';
import { HeadCellResizeHandle } from './HeadCellResizeHandle';

import {
  buildPinnedBorderPseudoStyles,
  buildPinnedBorderRight,
  TABLE_BORDERS,
  TABLE_COLORS,
  TABLE_SIZES,
  TABLE_Z_INDEX,
} from '../styles';

import { SYSTEM_COLUMN_SELECT } from '../config';
import { UTypeOf } from '@/utils';
import { TableColumnMeta } from '@/types/enrichment/table';

// Re-export HeaderState for external use
export interface HeaderState {
  activeColumnId: string | null;
  focusedColumnId: string | null;
  isMenuOpen: boolean;
  isEditing: boolean;
  selectedColumnIds: string[];
}

interface TableHeadCellProps {
  // Primary data source - similar to BodyCell's cellContext pattern
  headerContext?: HeaderContext<any, unknown>;
  // Unified state object - similar to BodyCell's headerState pattern
  headerState?: HeaderState;
  // Children for add column button (when headerContext is not provided)
  children?: ReactNode;
  // Width override (for add column button)
  width?: number;
  // Pinned column layout
  stickyLeft?: number;
  shouldShowPinnedRightShadow?: boolean;
  // Virtualization
  measureRef?: (node: HTMLElement | null) => void;
  dataIndex?: number;
  // Callbacks
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onDoubleClick?: (e: MouseEvent<HTMLElement>) => void;
  onContextMenu?: (e: MouseEvent<HTMLElement>) => void;
  onResizeStart?: () => void;
  // Resize indicator height (table body height)
  indicatorHeight?: number;
  // Drag sorting props (from dnd-kit)
  dragStyle?: CSSProperties;
  dragListeners?: Record<string, any>;
  dragAttributes?: Record<string, any>;
  isDragging?: boolean;
}

export const HeadCell = forwardRef<HTMLDivElement, TableHeadCellProps>(
  (
    {
      headerContext,
      headerState,
      children,
      width: widthOverride,
      stickyLeft = 0,
      measureRef,
      dataIndex,
      onClick,
      onDoubleClick,
      onContextMenu,
      shouldShowPinnedRightShadow,
      indicatorHeight = 500,
      onResizeStart,
      dragStyle,
      dragListeners,
      dragAttributes,
      // isDragging - reserved for future drag overlay styling
    },
    ref,
  ) => {
    // ========== 1. Context Data Extraction ==========
    const column = headerContext?.column;
    const table = headerContext?.table;
    const tableMeta = table?.options?.meta as any;

    const columnId = column?.id ?? '';
    const isSelectColumn = columnId === SYSTEM_COLUMN_SELECT;

    // Get column meta from columnDef (contains all column configuration)
    const columnMeta = column?.columnDef?.meta as TableColumnMeta | undefined;
    const isAiColumn = columnMeta?.isAiColumn ?? false;

    // Width from header or override (for add column button)
    const width = widthOverride ?? headerContext?.header?.getSize() ?? 140;

    // Get from table/column directly instead of props
    const isPinned = column?.getIsPinned() === 'left';
    const canResize = column?.getCanResize?.() !== false;
    const isAllRowsSelected = table?.getIsAllPageRowsSelected?.();
    const isSomeRowsSelected = table?.getIsSomePageRowsSelected?.();
    const onToggleAllRows = table?.getToggleAllPageRowsSelectedHandler?.();

    // ========== 2. Derived State from headerState ==========
    const isActive = headerState?.activeColumnId === columnId;
    const isFocused = headerState?.focusedColumnId === columnId;
    const isEditing = isFocused && (headerState?.isEditing ?? false);

    // ========== 3. Local State ==========
    const [localEditValue, setLocalEditValue] = useState<string>('');
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const originalValueRef = useRef<string>('');

    // For select column, render Checkbox directly (bypass TanStack column caching)
    const content =
      isSelectColumn && onToggleAllRows ? (
        <HeadCellCheckbox
          isAllRowsSelected={isAllRowsSelected}
          isSomeRowsSelected={isSomeRowsSelected}
          onToggleAllRows={onToggleAllRows}
        />
      ) : headerContext ? (
        flexRender(column?.columnDef?.header, headerContext)
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
            inputRef.current.setSelectionRange(
              0,
              inputRef.current.value.length,
            );
          }
        }, 0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing]);

    const saveEdit = useCallback(() => {
      const trimmedValue = localEditValue.trim();
      if (trimmedValue && trimmedValue !== originalValueRef.current) {
        tableMeta?.updateHeaderName?.(columnId, trimmedValue);
      } else {
        tableMeta?.stopHeaderEdit?.();
      }
    }, [localEditValue, tableMeta, columnId]);

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

        if (isAiColumn && columnId) {
          tableMeta?.openAiRunMenu?.(e.currentTarget as HTMLElement, columnId);
        }
      },
      [isAiColumn, tableMeta, columnId],
    );

    // Visual rules:
    // - Background color: isActive && !isEditing
    // - Bottom line: isFocused && !isActive && !isEditing
    //   - Cell selected: isActive=false, isFocused=true → show bottom line
    //   - Header click away: activeColumnId cleared → isActive=false, isFocused=true → show bottom line
    //   - Header active (menu open or closed): isActive=true → no bottom line
    const shouldShowBackground = isActive || isEditing || isFocused;
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
        ref={(node) => {
          // Combine measureRef and forwardRef
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          measureRef?.(node);
        }}
        style={dragStyle}
        {...dragAttributes}
        {...dragListeners}
        sx={{
          userSelect: 'none',
          width,
          touchAction: 'none',
          minWidth:
            width < TABLE_SIZES.CELL_MIN_WIDTH
              ? TABLE_SIZES.CELL_MIN_WIDTH
              : width,
          maxWidth: width,
          boxSizing: 'border-box',
          overflow: 'visible',
          // Each cell has borderBottom and borderRight (like body cells)
          borderBottom: TABLE_BORDERS.HEADER,
          borderRight: isPinned
            ? buildPinnedBorderRight(
                isPinned,
                !!shouldShowPinnedRightShadow,
                isSelectColumn,
              )
            : TABLE_BORDERS.HEADER,
          bgcolor: shouldShowBackground
            ? TABLE_COLORS.HOVER_BG
            : TABLE_COLORS.DEFAULT_BG,
          cursor: 'pointer',
          // Pinned column 3px border (pseudo-element, outside content box)
          '&::before': buildPinnedBorderPseudoStyles(
            isPinned,
            !!shouldShowPinnedRightShadow,
            isSelectColumn,
            TABLE_Z_INDEX.HEADER_PINNED,
          ),
          position: isPinned ? 'sticky' : 'relative',
          left: isPinned ? stickyLeft : 'auto',
          zIndex: isPinned ? TABLE_Z_INDEX.HEADER_PINNED : TABLE_Z_INDEX.HEADER,
          '&:hover': {
            bgcolor: isSelectColumn
              ? undefined
              : !isEditing
                ? TABLE_COLORS.HOVER_BG
                : TABLE_COLORS.EDITING_HOVER_BG,
          },
          height: TABLE_SIZES.HEADER_HEIGHT,
          justifyContent: 'center',
          fontSize: TABLE_SIZES.FONT_SIZE,
          lineHeight: `${TABLE_SIZES.HEADER_HEIGHT}px`,
          color: 'text.primary',
          fontWeight: TABLE_SIZES.FONT_WEIGHT_MEDIUM,
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
            <HeadCellEditor
              inputRef={inputRef}
              onKeyDown={onInputKeyDown}
              onSave={saveEdit}
              onValueChange={setLocalEditValue}
              value={localEditValue}
            />
          ) : headerContext && !isSelectColumn ? (
            <HeadCellContent
              backgroundColor={headerBackgroundColor}
              columnMeta={columnMeta}
              content={content}
              isAiColumn={isAiColumn}
              onAiIconClick={onAiIconClick}
            />
          ) : (
            content
          )}
        </Box>

        {headerContext &&
          canResize !== false &&
          column?.getCanResize?.() !== false &&
          table && (
            <HeadCellResizeHandle
              columnId={columnId}
              indicatorHeight={indicatorHeight}
              onResizeStart={onResizeStart}
              table={table}
              width={width}
            />
          )}
      </Stack>
    );
  },
);

HeadCell.displayName = 'HeadCell';
