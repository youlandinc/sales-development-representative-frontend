import { FC, useMemo, useState } from 'react';
import { Menu, MenuItem, Stack } from '@mui/material';
import { flexRender } from '@tanstack/react-table';

interface StyledTableHeaderProps {
  columnsData: any[];
  addMenuItems?: { label: string; value: string }[];
  onAddMenuItemClick?: (item: { label: string; value: string }) => void;
  stickyLeftMap?: Record<string, number>;
  pinnedLeftCount?: number;
  visibleIndexSet?: Set<number>;
}

export const StyledTableHeader: FC<StyledTableHeaderProps> = ({
  columnsData,
  addMenuItems,
  onAddMenuItemClick,
  stickyLeftMap,
  pinnedLeftCount = 0,
  visibleIndexSet,
}) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const items = useMemo(
    () => addMenuItems ?? [{ label: '+ Add new column', value: 'add_column' }],
    [addMenuItems],
  );

  return (
    <Stack
      flexDirection={'row'}
      sx={{ bgcolor: '#fafafa', borderTop: '1px solid #DFDEE6' }}
    >
      {/* Pinned left columns */}
      {columnsData.slice(0, pinnedLeftCount).map((column, index) => {
        const w =
          (column.getSize?.() as number) ?? column.column.getSize?.() ?? 160;
        return (
          <Stack
            key={`${column.id}-${index}`}
            onClick={() => {
              setSelectedId(selectedId === column.id ? '' : column.id);
            }}
            p={1.5}
            sx={{
              borderLeft: '1px solid #DFDEE6',
              borderBottom: '1px solid #DFDEE6',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#F6F6F6',
              },
              bgcolor: selectedId === column.id ? '#F6F6F6' : '#FFFFFF',
              position: 'sticky',
              left: stickyLeftMap?.[column.id] ?? 0,
              zIndex: 2,
              boxShadow:
                index === pinnedLeftCount - 1
                  ? 'inset -6px 0 6px -6px rgba(0,0,0,0.08)'
                  : 'none',
              flex: '0 0 auto',
              minWidth: `${w}px`,
              width: `${w}px`,
              maxWidth: `${w}px`,
            }}
          >
            {flexRender(column.column.columnDef.header, column.getContext())}
            {column.column.getCanResize?.() !== false && (
              <Stack
                onMouseDown={column.getResizeHandler?.()}
                onTouchStart={column.getResizeHandler?.()}
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  height: '100%',
                  width: '8px',
                  cursor: 'col-resize',
                  zIndex: 3,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
                }}
              />
            )}
          </Stack>
        );
      })}

      {/* Unpinned region with left/right spacers for virtualization */}
      {(() => {
        const unpinned = columnsData.slice(pinnedLeftCount);
        const getW = (c: any) =>
          (c.getSize?.() as number) ?? c.column.getSize?.() ?? 160;
        const unpinnedWidths = unpinned.map(getW);
        const unpinnedTotal = unpinnedWidths.reduce((a, b) => a + b, 0);
        const isVisible = (i: number) =>
          visibleIndexSet ? visibleIndexSet.has(pinnedLeftCount + i) : true;
        let firstVisible = -1;
        for (let i = 0; i < unpinned.length; i++) {
          if (isVisible(i)) {
            firstVisible = i;
            break;
          }
        }
        const leftPad =
          firstVisible <= 0
            ? 0
            : unpinnedWidths.slice(0, firstVisible).reduce((a, b) => a + b, 0);
        const visibleItems = unpinned.filter((_, i) => isVisible(i));
        const visibleWidth = visibleItems.reduce((sum, c) => sum + getW(c), 0);
        const rightPad = Math.max(0, unpinnedTotal - leftPad - visibleWidth);

        return (
          <>
            {leftPad > 0 && (
              <Stack sx={{ width: `${leftPad}px`, flex: '0 0 auto' }} />
            )}
            {visibleItems.map((column, i) => {
              const w = getW(column);
              return (
                <Stack
                  key={`${column.id}-${pinnedLeftCount + i}`}
                  onClick={() => {
                    setSelectedId(selectedId === column.id ? '' : column.id);
                  }}
                  p={1.5}
                  sx={{
                    position: 'relative',
                    borderLeft: '1px solid #DFDEE6',
                    borderBottom: '1px solid #DFDEE6',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#F6F6F6' },
                    bgcolor: selectedId === column.id ? '#F6F6F6' : '#FFFFFF',
                    flex: '0 0 auto',
                    minWidth: `${w}px`,
                    width: `${w}px`,
                    maxWidth: `${w}px`,
                  }}
                >
                  {flexRender(
                    column.column.columnDef.header,
                    column.getContext(),
                  )}
                  {column.column.getCanResize?.() !== false && (
                    <Stack
                      onMouseDown={column.getResizeHandler?.()}
                      onTouchStart={column.getResizeHandler?.()}
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        height: '100%',
                        width: '8px',
                        cursor: 'col-resize',
                        zIndex: 3,
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
                      }}
                    />
                  )}
                </Stack>
              );
            })}
            {rightPad > 0 && (
              <Stack sx={{ width: `${rightPad}px`, flex: '0 0 auto' }} />
            )}
          </>
        );
      })()}
      {/* Add new column action cell */}
      <Stack
        onClick={(e) => setAnchorEl(e.currentTarget as HTMLElement)}
        p={1.5}
        sx={{
          borderLeft: '1px solid #DFDEE6',
          borderBottom: '1px solid #DFDEE6',
          borderRight: '1px solid #DFDEE6',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#F6F6F6',
          },
          bgcolor: '#FFFFFF',
          flexShrink: 0,
        }}
      >
        Add column
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onClose={() => setAnchorEl(null)}
          open={open}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {items.map((item) => (
            <MenuItem
              key={item.value}
              onClick={(e) => {
                e.stopPropagation();
                onAddMenuItemClick?.(item);
                setAnchorEl(null);
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Stack>
  );
};
