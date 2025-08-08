import { Skeleton, Stack } from '@mui/material';
import { FC } from 'react';
import { flexRender, Row } from '@tanstack/react-table';

interface StyledTableRowProps {
  rows: Row<any>[];
  rowHeight?: number;
  stickyLeftMap?: Record<string, number>;
  pinnedLeftCount?: number;
  visibleIndexSet?: Set<number>;
}

export const StyledTableRow: FC<StyledTableRowProps> = ({
  rows,
  rowHeight,
  stickyLeftMap,
  pinnedLeftCount = 0,
  visibleIndexSet,
}) => {
  return (
    <Stack>
      {rows.map((row) => (
        <Stack
          flexDirection="row"
          key={row.id}
          sx={{
            height: rowHeight ? `${rowHeight}px` : 'auto',
            alignItems: 'center',
            borderBottom: '1px solid #F0EFF5',
            '&:hover': { bgcolor: '#FAFAFA' },
          }}
        >
          {/* Pinned left cells */}
          {row
            .getVisibleCells()
            .slice(0, pinnedLeftCount)
            .map((cell, idx) => {
              const isLoading = Boolean((cell.row.original as any)?.__loading);
              const w = (cell.column.getSize?.() as number) ?? 160;
              return (
                <Stack
                  key={cell.id}
                  sx={{
                    px: 2,
                    py: 1,
                    flex: '0 0 auto',
                    minWidth: w,
                    width: w,
                    maxWidth: w,
                    ...(idx < pinnedLeftCount
                      ? {
                          position: 'sticky',
                          left: stickyLeftMap?.[cell.column.id] ?? 0,
                          zIndex: 1,
                          bgcolor: '#FFFFFF',
                          boxShadow:
                            idx === pinnedLeftCount - 1
                              ? 'inset -6px 0 6px -6px rgba(0,0,0,0.08)'
                              : 'none',
                        }
                      : {}),
                  }}
                >
                  {isLoading ? (
                    <Skeleton height={16} variant="text" width={80} />
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </Stack>
              );
            })}

          {/* Unpinned region with left/right spacers */}
          {(() => {
            const cells = row.getVisibleCells();
            const unpinned = cells.slice(pinnedLeftCount);
            const getW = (c: (typeof cells)[number]) =>
              (c.column.getSize?.() as number) ?? 160;
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
                : unpinnedWidths
                    .slice(0, firstVisible)
                    .reduce((a, b) => a + b, 0);
            const visibleItems = unpinned.filter((_, i) => isVisible(i));
            const visibleWidth = visibleItems.reduce(
              (sum, c) => sum + getW(c),
              0,
            );
            const rightPad = Math.max(
              0,
              unpinnedTotal - leftPad - visibleWidth,
            );

            return (
              <>
                {leftPad > 0 && (
                  <Stack sx={{ width: `${leftPad}px`, flex: '0 0 auto' }} />
                )}
                {visibleItems.map((cell) => {
                  const isLoading = Boolean(
                    (cell.row.original as any)?.__loading,
                  );
                  const w = (cell.column.getSize?.() as number) ?? 160;
                  return (
                    <Stack
                      key={cell.id}
                      sx={{
                        px: 2,
                        py: 1,
                        flex: '0 0 auto',
                        minWidth: w,
                        width: w,
                        maxWidth: w,
                      }}
                    >
                      {isLoading ? (
                        <Skeleton height={16} variant="text" width={80} />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
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
        </Stack>
      ))}
    </Stack>
  );
};
