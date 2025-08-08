import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import useSWR from 'swr';

import { useProspectTableStore } from '@/stores/Prospect';
import { StyledTable } from '@/components/atoms/StyledTable';
import { _fetchTableRowData } from '@/request';

interface ProspectDetailTableProps {
  tableId: string;
}

export const ProspectDetailContent: FC<ProspectDetailTableProps> = ({
  tableId,
}) => {
  const { fetchHeaders, fetchRowIds, headers, rowIds } = useProspectTableStore(
    (store) => store,
  );

  const { isLoading, mutate } = useSWR(
    tableId,
    async () => {
      await Promise.all([fetchHeaders(tableId), fetchRowIds(tableId)]);
    },
    {
      revalidateOnFocus: false,
    },
  );

  // Virtualization + lazy loading states
  const ROW_HEIGHT = 48; // px, keep consistent with StyledTableRow
  const PAGE_SIZE = 50;
  const OVERSCAN = 10;
  const [viewportHeight, setViewportHeight] = useState<number>(520);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [scrollTop, setScrollTop] = useState(0);
  const [loadedUntil, setLoadedUntil] = useState(0); // exclusive end index of loaded ids
  const [rowsMap, setRowsMap] = useState<Record<string, any>>({});
  const isFetchingRef = useRef(false);

  // Compute visible window
  const total = rowIds.length;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(
    total,
    Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + OVERSCAN,
  );
  const paddingTop = startIndex * ROW_HEIGHT;
  const paddingBottom = (total - endIndex) * ROW_HEIGHT;

  const visibleIds = rowIds.slice(startIndex, endIndex);

  const createLoadingRow = () => {
    const obj: any = { __loading: true };
    headers.forEach((h) => {
      obj[h.fieldId] = undefined;
    });
    return obj;
  };

  const visibleData = visibleIds.map((id) => rowsMap[id] ?? createLoadingRow());

  // Reset states when table changes
  useEffect(() => {
    setScrollTop(0);
    setLoadedUntil(0);
    setRowsMap({});
    isFetchingRef.current = false;
  }, [tableId]);

  // Measure viewport height
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver(() => {
      setViewportHeight(el.clientHeight);
    });
    setViewportHeight(el.clientHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Initial load when rowIds ready
  useEffect(() => {
    if (!tableId || total === 0) {
      return;
    }
    if (loadedUntil > 0) {
      return;
    }
    const nextEnd = Math.min(PAGE_SIZE, total);
    const idsBatch = rowIds.slice(0, nextEnd);
    isFetchingRef.current = true;
    _fetchTableRowData({ tableId, recordIds: idsBatch })
      .then((res: any) => {
        const arr = (res?.data ?? []) as any[];
        setRowsMap((prev) => {
          const m = { ...prev } as Record<string, any>;
          arr.forEach((row) => {
            if (row && row.id) {
              m[row.id] = row;
            }
          });
          return m;
        });
        setLoadedUntil(nextEnd);
      })
      .finally(() => {
        isFetchingRef.current = false;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId, total]);

  // Load more when approaching the loaded boundary
  useEffect(() => {
    if (!tableId || total === 0) {
      return;
    }
    if (isFetchingRef.current) {
      return;
    }
    const buffer = 10;
    if (endIndex > Math.max(0, loadedUntil - buffer) && loadedUntil < total) {
      const nextEnd = Math.min(loadedUntil + PAGE_SIZE, total);
      const idsBatch = rowIds.slice(loadedUntil, nextEnd);
      isFetchingRef.current = true;
      _fetchTableRowData({ tableId, recordIds: idsBatch })
        .then((res: any) => {
          const arr = (res?.data ?? []) as any[];
          setRowsMap((prev) => {
            const m = { ...prev } as Record<string, any>;
            arr.forEach((row) => {
              if (row && row.id) {
                m[row.id] = row;
              }
            });
            return m;
          });
          setLoadedUntil(nextEnd);
        })
        .finally(() => {
          isFetchingRef.current = false;
        });
    }
  }, [endIndex, loadedUntil, total, rowIds, tableId]);

  return (
    <Stack sx={{ height: '100%', display: 'flex', minHeight: 0 }}>
      {tableId}

      <StyledTable
        columns={headers}
        columnWidthStorageKey={tableId}
        data={visibleData}
        pinnedLeftCount={1}
        rowIds={rowIds}
        virtualization={{
          enabled: true,
          // containerHeight omitted -> takes remaining space
          rowHeight: ROW_HEIGHT,
          paddingTop,
          paddingBottom,
          onScroll: (e) => setScrollTop((e.target as HTMLDivElement).scrollTop),
          onContainerRef: (el) => (containerRef.current = el),
        }}
      />
    </Stack>
  );
};
