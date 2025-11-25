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
import { Box, Icon, InputBase, Stack } from '@mui/material';
import { flexRender, Header } from '@tanstack/react-table';

import { StyledTableAiIcon } from './index';

import { COLUMN_TYPE_ICONS, SYSTEM_COLUMN_SELECT } from '@/constants/table';
import { TableColumnMeta, TableColumnTypeEnum } from '@/types/Prospect/table';

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
  enableResizing?: boolean;
  isActive?: boolean;
  isEditing?: boolean;
  onEditSave?: (newName: string) => void;
  showPinnedRightShadow?: boolean;
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
  enableResizing,
  isActive = false,
  isEditing = false,
  onEditSave,
  showPinnedRightShadow,
}) => {
  const [localEditValue, setLocalEditValue] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tableMeta = header?.getContext?.()?.table?.options?.meta as any;
  const isSelectColumn = header?.column?.id === SYSTEM_COLUMN_SELECT;

  // Get column meta from columnDef (contains all column configuration)
  const columnMeta = header?.column?.columnDef?.meta as
    | TableColumnMeta
    | undefined;
  const { actionKey, isAiColumn = false, actionDefinition } = columnMeta || {};

  const content = header
    ? flexRender(header.column.columnDef.header, header.getContext())
    : children;

  useEffect(() => {
    if (isEditing) {
      const initialValue = typeof content === 'string' ? content : '';
      setLocalEditValue(initialValue);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(0, inputRef.current.value.length);
        }
      }, 0);
    }
  }, [isEditing, content]);

  const handleEditSave = useCallback(() => {
    if (localEditValue.trim() && localEditValue !== content) {
      onEditSave?.(localEditValue.trim());
    } else {
      tableMeta?.stopHeaderEdit?.();
    }
  }, [localEditValue, content, onEditSave, tableMeta]);

  const handleEditCancel = useCallback(() => {
    tableMeta?.stopHeaderEdit?.();
  }, [tableMeta]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEditSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleEditCancel();
      }
    },
    [handleEditSave, handleEditCancel],
  );

  const handleAiIconClick = useCallback(
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

  // 计算背景色：选中 > hover > 默认
  const headerBackgroundColor =
    isActive || (isHovered && !isEditing) ? '#F8F8FA' : '#FFFFFF';

  return (
    <Stack
      data-index={dataIndex}
      data-table-header
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={measureRef}
      sx={{
        userSelect: 'none',
        width,
        minWidth: width < 60 ? 60 : width,
        maxWidth: width,
        boxSizing: 'border-box',
        borderRight:
          isPinned && showPinnedRightShadow && !isSelectColumn
            ? 'none'
            : '0.5px solid #DFDEE6',
        bgcolor: isActive ? '#F8F8FA' : '#FFFFFF',
        cursor: 'pointer',
        position: isPinned ? 'sticky' : 'relative',
        left: isPinned ? stickyLeft : 'auto',
        zIndex: isPinned ? 30 : 2,
        '&:hover': {
          bgcolor: !isEditing ? '#F8F8FA' : '#F6F6F6',
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
            isPinned && showPinnedRightShadow && isEditing
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
            onBlur={handleEditSave}
            onChange={(e) => setLocalEditValue(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onKeyDown={handleKeyDown}
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
            onClick={handleAiIconClick}
          />
        )}
      </Box>

      {header &&
        enableResizing !== false &&
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
                isPinned && showPinnedRightShadow
                  ? '3px solid #DFDEE6'
                  : '2px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '&:active': {
                backgroundColor: 'transparent',
                borderRight:
                  isPinned && showPinnedRightShadow
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
