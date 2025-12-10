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
import Image from 'next/image';
import { Box, Checkbox, Icon, InputBase, Stack } from '@mui/material';
import { flexRender, Header } from '@tanstack/react-table';

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
  isActive?: boolean;
  isEditing?: boolean;
  onEditSave?: (newName: string) => void;
  shouldShowPinnedRightShadow?: boolean;
  // Select column checkbox props (passed directly to bypass TanStack column caching)
  isAllRowsSelected?: boolean;
  isSomeRowsSelected?: boolean;
  onToggleAllRows?: (event: unknown) => void;
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
  isEditing = false,
  onEditSave,
  shouldShowPinnedRightShadow,
  isAllRowsSelected,
  isSomeRowsSelected,
  onToggleAllRows,
}) => {
  const [localEditValue, setLocalEditValue] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
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

  // Calculate background color: active > hover > default
  const headerBackgroundColor =
    isActive || (isHovered && !isEditing) ? '#F4F5F9' : '#FFFFFF';

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
        borderRight:
          isPinned && shouldShowPinnedRightShadow && !isSelectColumn
            ? 'none'
            : '0.5px solid #DFDEE6',
        bgcolor: isActive ? '#F4F5F9' : '#FFFFFF',
        cursor: 'pointer',
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
        color: 'text.secondary',
        fontWeight: 600,
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
              fontWeight: 600,
              color: 'text.primary',
              width: '100%',
              backgroundColor: 'transparent',
              '& input': {
                padding: 0,
                textAlign: 'left',
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
          <Stack
            onMouseDown={(e) => {
              if (e.button !== 0) {
                return;
              }
              e.stopPropagation();
              e.preventDefault();
              const handler = header.getResizeHandler?.();
              handler?.(e);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              const handler = header.getResizeHandler?.();
              handler?.(e);
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
              pointerEvents: 'auto',
              borderRight:
                isPinned && shouldShowPinnedRightShadow
                  ? '3px solid #DFDEE6'
                  : '2px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '&:active': {
                backgroundColor: 'transparent',
                borderRight:
                  isPinned && shouldShowPinnedRightShadow
                    ? '3px solid #DFDEE6'
                    : 'transparent',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                right: '0px',
                top: '50%',
                transform: 'translateY(-50%)',
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
};
