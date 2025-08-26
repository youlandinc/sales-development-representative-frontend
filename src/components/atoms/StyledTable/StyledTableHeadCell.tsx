import {
  FC,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, InputBase, Stack } from '@mui/material';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const tableMeta = header?.getContext?.()?.table?.options?.meta as any;

  const isSelectColumn = header?.column?.id === '__select';

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
    (e: React.KeyboardEvent) => {
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

  return (
    <Stack
      data-index={dataIndex}
      data-table-header
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
      ref={measureRef}
      sx={{
        userSelect: 'none',
        width,
        minWidth: width < 100 ? 100 : width,
        maxWidth: width,
        boxSizing: 'border-box',
        borderRight:
          isPinned && showPinnedRightShadow && !isSelectColumn
            ? '0 solid transparent'
            : '0.5px solid #DFDEE6',
        boxShadow: (theme) =>
          isActive && !isSelectColumn
            ? `inset 0 0 0 .5px ${theme.palette.primary.main}`
            : 'none',
        bgcolor: isActive ? '#F7F4FD' : '#FFFFFF',
        cursor: 'pointer',
        position: isPinned ? 'sticky' : 'relative',
        left: isPinned ? stickyLeft : 'auto',
        zIndex: isPinned ? 30 : 2,
        '&:hover': {
          bgcolor: isActive ? '#BBDEFB' : '#F6F6F6',
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
          width: '100%',
          px: 1.5,
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
          content
        )}
      </Box>

      {header &&
        enableResizing !== false &&
        header.column.getCanResize?.() !== false &&
        !isEditing && (
          <Stack
            onMouseDown={(e) => {
              e.stopPropagation();
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
              borderRight:
                isPinned && showPinnedRightShadow
                  ? '3px solid #DFDEE6'
                  : '2px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor:
                  isPinned && showPinnedRightShadow
                    ? 'transparent'
                    : 'rgba(25, 118, 210, 0.08)',
              },
              '&:active': {
                backgroundColor:
                  isPinned && showPinnedRightShadow
                    ? 'transparent'
                    : 'rgba(25, 118, 210, 0.12)',
                borderRight:
                  isPinned && showPinnedRightShadow
                    ? '3px solid #1565c0'
                    : '2px solid #1565c0',
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
};
