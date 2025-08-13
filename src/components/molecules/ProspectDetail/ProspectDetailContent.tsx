import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import useSWR from 'swr';

import { useProspectTableStore, useWebResearchStore } from '@/stores/Prospect';
import { StyledTable } from '@/components/atoms';
import { WebResearch } from '@/components/molecules';
import { useWebSocket } from '@/hooks/useWebSocket';

import { _fetchTableRowData } from '@/request';

interface ProspectDetailTableProps {
  tableId: string;
}

export const ProspectDetailContent: FC<ProspectDetailTableProps> = ({
  tableId,
}) => {
  const {
    fetchTable,
    fetchRowIds,
    headers,
    rowIds,
    runRecords,
    resetTable,
    updateColumnWidth,
    updateCellValue,
  } = useProspectTableStore((store) => store);
  const { setOpen } = useWebResearchStore((store) => store);
  const { messages, connected } = useWebSocket();

  const { isLoading: isMetadataLoading } = useSWR(
    tableId ? `metadata-${tableId}` : null,
    async () => {
      await Promise.all([fetchTable(tableId), fetchRowIds(tableId)]);
    },
    {
      revalidateOnFocus: false,
    },
  );

  const rowsMapRef = useRef<Record<string, any>>({});
  const [rowsMap, setRowsMap] = useState<Record<string, any>>({});
  const [aiLoadingState, setAiLoadingState] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const isFetchingRef = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const ROW_HEIGHT = 36;
  const MIN_BATCH_SIZE = 50;
  const MAX_BATCH_SIZE = 300;

  const maxLoadedIndexRef = useRef(-1);

  const total = rowIds.length;
  const fullData = useMemo(
    () => rowIds.map((id) => rowsMap[id] || { id, __loading: true }),
    [rowIds, rowsMap],
  );

  useEffect(() => {
    resetTable();
    setRowsMap({});
    rowsMapRef.current = {};
    isFetchingRef.current = false;
    maxLoadedIndexRef.current = -1;
  }, [resetTable, tableId]);

  useEffect(() => {
    if (!connected || messages.length === 0 || !tableId) {
      return;
    }

    messages.forEach((message, index) => {
      try {
        let aiMessage;
        if (typeof message === 'string') {
          aiMessage = JSON.parse(message);
        } else {
          aiMessage = message;
        }

        if (
          aiMessage.messageType === 'message' &&
          aiMessage.data?.data?.tableId === tableId &&
          aiMessage.data?.data?.recordId &&
          aiMessage.data?.data?.metadata
        ) {
          const { recordId, metadata } = aiMessage.data.data;

          if (!metadata || Object.keys(metadata).length === 0) {
            return;
          }

          const currentRowData = rowsMapRef.current[recordId] || {
            id: recordId,
          };
          const updatedRowData = { ...currentRowData };

          Object.entries(metadata).forEach(([fieldId, result]) => {
            updatedRowData[fieldId] = result;
          });

          rowsMapRef.current[recordId] = updatedRowData;
          setRowsMap((prev) => ({
            ...prev,
            [recordId]: updatedRowData,
          }));

          Object.keys(metadata).forEach((columnId) => {
            setAiLoadingState((prev) => {
              const updated = { ...prev };
              if (updated[recordId]?.[columnId]) {
                delete updated[recordId][columnId];
                if (Object.keys(updated[recordId]).length === 0) {
                  delete updated[recordId];
                }
              }
              return updated;
            });
          });
        } else {
          //console.log(`Message ${index} doesn't match:`, {
          //  messageType: aiMessage.type,
          //  messageTableId: aiMessage.data?.data?.tableId,
          //  currentTableId: tableId,
          //  hasRecordId: !!aiMessage.data?.data?.recordId,
          //  hasMetadata: !!aiMessage.data?.data?.metadata,
          //});
        }
      } catch (error) {
        //console.error(`Error processing WebSocket message ${index}:`, error);
      }
    });
  }, [connected, messages, tableId]);

  const fetchBatchData = useCallback(
    async (startIndex: number, endIndex: number) => {
      if (!tableId || isFetchingRef.current) {
        return;
      }

      const loadStartIndex = Math.max(
        startIndex,
        maxLoadedIndexRef.current + 1,
      );
      if (loadStartIndex > endIndex) {
        return;
      }

      const batchIds = rowIds.slice(loadStartIndex, endIndex + 1);
      if (batchIds.length === 0) {
        return;
      }

      isFetchingRef.current = true;
      try {
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
    [tableId, rowIds],
  );

  useEffect(() => {
    if (!tableId || total === 0 || isMetadataLoading) {
      return;
    }
    fetchBatchData(0, Math.min(MIN_BATCH_SIZE - 1, total - 1));
  }, [tableId, total, fetchBatchData, isMetadataLoading]);

  const handleVisibleRangeChange = useCallback(
    (startIndex: number, endIndex: number) => {
      if (endIndex > maxLoadedIndexRef.current) {
        const loadStartIndex = maxLoadedIndexRef.current + 1;
        const scrolledBeyondLoaded = endIndex - maxLoadedIndexRef.current;

        let dynamicBatchSize;
        if (scrolledBeyondLoaded <= endIndex - startIndex + 1) {
          dynamicBatchSize = MIN_BATCH_SIZE;
        } else {
          dynamicBatchSize = Math.min(
            MAX_BATCH_SIZE,
            Math.max(MIN_BATCH_SIZE, scrolledBeyondLoaded * 2),
          );
        }

        const batchEndIndex = Math.min(
          loadStartIndex + dynamicBatchSize - 1,
          total - 1,
        );

        fetchBatchData(loadStartIndex, batchEndIndex);
      }
    },
    [fetchBatchData, total],
  );

  const handleAiProcess = useCallback(
    (recordId: string, columnId: string) => {
      if (!runRecords.includes(recordId)) {
        return;
      }

      const currentValue = rowsMap[recordId]?.[columnId];
      if (
        currentValue !== undefined &&
        currentValue !== null &&
        currentValue !== ''
      ) {
        return;
      }

      setAiLoadingState((prev) => ({
        ...prev,
        [recordId]: {
          ...prev[recordId],
          [columnId]: true,
        },
      }));
    },
    [runRecords, rowsMap],
  );

  useEffect(() => {
    if (runRecords.length === 0) {
      setAiLoadingState({});
    } else {
      setAiLoadingState((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((recordId) => {
          if (!runRecords.includes(recordId)) {
            delete updated[recordId];
          }
        });
        return updated;
      });
    }
  }, [runRecords]);

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
        height: 'calc(100% - 126px)',
        minHeight: '400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        flex: 1,
      }}
    >
      {headers.length > 0 && rowIds.length > 0 && (
        <StyledTable
          aiLoading={aiLoadingState}
          columns={headers}
          data={fullData}
          onAddMenuItemClick={(item) => {
            setOpen(true);
          }}
          onAiProcess={handleAiProcess}
          onCellEdit={(recordId, fieldId, value) =>
            updateCellValue({ tableId, recordId, fieldId, value })
          }
          onColumnResize={(fieldId, width) =>
            updateColumnWidth({ fieldId, width })
          }
          rowIds={rowIds}
          scrolled={scrolled}
          virtualization={{
            enabled: true,
            rowHeight: ROW_HEIGHT,
            scrollContainer: scrollContainerRef,
            onVisibleRangeChange: handleVisibleRangeChange,
          }}
          //addMenuItems={}
        />
      )}

      <WebResearch
        cb={async () => {
          await fetchTable(tableId);
        }}
        tableId={tableId}
      />
    </Stack>
  );
};
