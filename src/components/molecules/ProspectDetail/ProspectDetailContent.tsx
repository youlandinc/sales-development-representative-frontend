import { FC, useCallback, useEffect, useRef, useState } from 'react';
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

  // Only fetch headers and rowIds once when tableId changes
  const { isLoading: isMetadataLoading } = useSWR(
    tableId ? `metadata-${tableId}` : null,
    async () => {
      await Promise.all([fetchHeaders(tableId), fetchRowIds(tableId)]);
    },
    {
      revalidateOnFocus: false,
    },
  );

  // Virtualization + incremental loading states
  const rowsMapRef = useRef<Record<string, any>>({});
  const [rowsMap, setRowsMap] = useState<Record<string, any>>({});
  const isFetchingRef = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const ROW_HEIGHT = 48; // Must match StyledTableBodyRow height exactly
  const INITIAL_BATCH_SIZE = 100; // Initial load
  const MIN_BATCH_SIZE = 20; // Minimum batch size for small scrolls
  const MAX_BATCH_SIZE = 300; // Maximum batch size for large scrolls

  // Track the maximum loaded index to avoid redundant loading
  const maxLoadedIndexRef = useRef(-1);

  const total = rowIds.length;
  const fullData = rowIds.map((id) => rowsMap[id] || { id, __loading: true });

  // Clear data when tableId changes
  useEffect(() => {
    setRowsMap({});
    rowsMapRef.current = {};
    isFetchingRef.current = false;
    maxLoadedIndexRef.current = -1;
  }, [tableId]);

  // Incremental loading based on visible rows - ONLY fetches row data
  const fetchBatchData = useCallback(
    async (startIndex: number, endIndex: number) => {
      if (!tableId || isFetchingRef.current) {
        return;
      }

      // Only load data beyond what we've already loaded
      const loadStartIndex = Math.max(
        startIndex,
        maxLoadedIndexRef.current + 1,
      );
      if (loadStartIndex > endIndex) {
        return;
      } // Nothing new to load

      const batchIds = rowIds.slice(loadStartIndex, endIndex + 1);
      if (batchIds.length === 0) {
        return;
      }

      isFetchingRef.current = true;
      try {
        // Only fetch row data, NOT headers or rowIds
        const res = await _fetchTableRowData({
          tableId,
          recordIds: batchIds,
        });
        const arr = (res?.data ?? []) as any[];
        const newRowsMap: Record<string, any> = {};
        arr.forEach((row) => {
          if (row && row.id) {
            newRowsMap[row.id] = row;
          }
        });
        setRowsMap((prev) => ({ ...prev, ...newRowsMap }));
        rowsMapRef.current = { ...rowsMapRef.current, ...newRowsMap };
        maxLoadedIndexRef.current = Math.max(
          maxLoadedIndexRef.current,
          endIndex,
        );
      } finally {
        isFetchingRef.current = false;
      }
    },
    [tableId, rowIds], // Removed rowsMap from dependencies to avoid recreating function
  );

  // Load initial batch only after metadata (headers/rowIds) is available
  useEffect(() => {
    if (!tableId || total === 0 || isMetadataLoading) {
      return;
    }
    // Don't preload too much - start with minimal load, let virtualizer handle the rest
    fetchBatchData(0, Math.min(MIN_BATCH_SIZE - 1, total - 1));
  }, [tableId, total, fetchBatchData, isMetadataLoading]);

  const handleVisibleRangeChange = useCallback(
    (startIndex: number, endIndex: number) => {
      // Only load if we need data beyond what's already loaded
      if (endIndex > maxLoadedIndexRef.current) {
        // Calculate how far user scrolled beyond loaded data
        const loadStartIndex = maxLoadedIndexRef.current + 1;
        const scrolledBeyondLoaded = endIndex - maxLoadedIndexRef.current;

        // Dynamic batch size based on scroll behavior:
        // - If user scrolled just 1 page beyond loaded data: load MIN_BATCH_SIZE (20)
        // - Scale up based on how far they scrolled, max MAX_BATCH_SIZE (300)
        let dynamicBatchSize;
        if (scrolledBeyondLoaded <= endIndex - startIndex + 1) {
          // Small scroll - just 1 page or less
          dynamicBatchSize = MIN_BATCH_SIZE;
        } else {
          // Larger scroll - scale proportionally but cap at MAX_BATCH_SIZE
          dynamicBatchSize = Math.min(
            MAX_BATCH_SIZE,
            Math.max(MIN_BATCH_SIZE, scrolledBeyondLoaded * 2),
          );
        }

        // Load up to the calculated batch size, but not beyond total
        const batchEndIndex = Math.min(
          loadStartIndex + dynamicBatchSize - 1,
          total - 1,
        );

        fetchBatchData(loadStartIndex, batchEndIndex);
      }
    },
    [fetchBatchData, total],
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setScrolled(scrollTop > 0);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', handleScroll);
      return () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.removeEventListener(
            'scroll',
            handleScroll,
          );
        }
      };
    }
  }, []);

  return (
    <Stack
      ref={scrollContainerRef}
      sx={{
        height: 'calc(100% - 126px)', // More precise: 24+32+24+32+12+2 = 126px
        minHeight: '400px', // Fallback minimum height for virtualization
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        flex: 1, // Take remaining space
      }}
    >
      {/* Always render table when we have headers and rowIds, even if data is loading */}
      {headers.length > 0 && rowIds.length > 0 && (
        <StyledTable
          columns={headers}
          columnWidthStorageKey={tableId}
          data={fullData}
          pinnedLeftCount={1}
          rowIds={rowIds}
          scrolled={scrolled}
          virtualization={{
            enabled: true,
            rowHeight: ROW_HEIGHT,
            scrollContainer: scrollContainerRef,
            onVisibleRangeChange: handleVisibleRangeChange,
          }}
        />
      )}
    </Stack>
  );
};
