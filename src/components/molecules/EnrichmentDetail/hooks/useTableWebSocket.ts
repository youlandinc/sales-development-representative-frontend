import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

import { useWebSocket } from '@/hooks';

import { useEnrichmentTableStore } from '@/stores/enrichment';

import { WebSocketTypeEnum } from '@/types';
import { TableRowItemData } from '@/types/enrichment/table';

interface UseTableWebSocketParams {
  tableId: string;
  rowsMapRef: RefObject<Record<string, TableRowItemData>>;
  setRowsMap: Dispatch<SetStateAction<Record<string, TableRowItemData>>>;
  setAiLoadingState: Dispatch<
    SetStateAction<Record<string, Record<string, boolean>>>
  >;
  maxLoadedIndexRef: RefObject<number>;
}

export const useTableWebSocket = ({
  tableId,
  rowsMapRef,
  setRowsMap,
  setAiLoadingState,
  maxLoadedIndexRef,
}: UseTableWebSocketParams) => {
  const { setRowIds } = useEnrichmentTableStore((store) => store);
  const { messages, connected } = useWebSocket();
  const rowIdsRef = useRef<string[]>([]);
  const pendingRowIdsRef = useRef<string[]>([]);
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!connected || messages.length === 0 || !tableId) {
      return;
    }

    messages.forEach((message) => {
      try {
        let parsedMessage;
        if (typeof message === 'string') {
          parsedMessage = JSON.parse(message);
        } else {
          parsedMessage = message;
        }

        // Handle progress messages (new rowIds)
        if (
          parsedMessage.type === WebSocketTypeEnum.progress &&
          parsedMessage.data?.id === tableId &&
          Array.isArray(parsedMessage.data?.data)
        ) {
          const newRowIds = parsedMessage.data.data;

          // Batch accumulate new rowIds
          pendingRowIdsRef.current = Array.from(
            new Set([...pendingRowIdsRef.current, ...newRowIds]),
          );

          // Clear existing batch timer
          if (batchTimerRef.current) {
            clearTimeout(batchTimerRef.current);
          }

          // Smart debounce: large batch -> immediate, small batch -> 16ms (1 frame)
          const batchSize = newRowIds.length;
          const debounceTime = batchSize >= 100 ? 0 : 16;

          batchTimerRef.current = setTimeout(() => {
            const currentRowIds = rowIdsRef.current;
            const updatedRowIds = Array.from(
              new Set([...currentRowIds, ...pendingRowIdsRef.current]),
            );

            // Only update if there are actually new rowIds
            if (updatedRowIds.length > currentRowIds.length) {
              rowIdsRef.current = updatedRowIds;

              // Use flushSync to ensure immediate state update
              flushSync(() => {
                setRowIds(updatedRowIds);
              });

              let newMaxLoaded = -1;
              for (let i = 0; i < updatedRowIds.length; i++) {
                if (rowsMapRef.current[updatedRowIds[i]]) {
                  newMaxLoaded = i;
                }
              }
              maxLoadedIndexRef.current = newMaxLoaded;
            }

            // Clear pending rowIds
            pendingRowIdsRef.current = [];
            batchTimerRef.current = null;
          }, debounceTime);

          return;
        }

        // Handle AI result messages
        if (
          parsedMessage.type === WebSocketTypeEnum.message &&
          parsedMessage.data?.data?.tableId === tableId &&
          parsedMessage.data?.data?.recordId &&
          parsedMessage.data?.data?.metadata
        ) {
          const { recordId, metadata } = parsedMessage.data.data;

          if (!metadata || Object.keys(metadata).length === 0) {
            return;
          }

          const currentRowData = rowsMapRef.current[recordId] || {
            id: recordId,
          };
          const updatedRowData = { ...currentRowData };

          Object.entries(metadata).forEach(([fieldId, result]) => {
            (updatedRowData as any)[fieldId] = result;
          });

          rowsMapRef.current[recordId] = updatedRowData as TableRowItemData;
          setRowsMap((prev) => ({
            ...prev,
            [recordId]: updatedRowData,
          }));

          // Clear AI loading state
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
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, 'error');
      }
    });
  }, [
    connected,
    messages,
    tableId,
    setRowIds,
    rowsMapRef,
    setRowsMap,
    setAiLoadingState,
    maxLoadedIndexRef,
  ]);

  // Cleanup batch timer on unmount
  useEffect(() => {
    return () => {
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }
    };
  }, []);
};
