import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useSWR from 'swr';

import { useProspectTableStore } from '@/stores/Prospect';
import { useTableWebSocket } from './useTableWebSocket';
import { useRunAi } from '@/hooks';

import { _fetchTableRowData } from '@/request';
import { MIN_BATCH_SIZE } from '../data';

interface UseProspectTableParams {
  tableId: string;
}

interface UseProspectTableReturn {
  fullData: any[];
  aiLoadingState: Record<string, Record<string, boolean>>;
  aiColumnIds: Set<string>;
  isMetadataLoading: boolean;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  rowsMapRef: RefObject<Record<string, any>>;
  scrolled: boolean;
  setAiLoadingState: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, boolean>>>
  >;
  onVisibleRangeChange: (startIndex: number, endIndex: number) => void;
  onAiProcess: (recordId: string, columnId: string) => void;
  onCellEdit: (recordId: string, fieldId: string, value: any) => Promise<void>;
  onUpdateRowData: (recordId: string, updates: Record<string, any>) => void;
  onInitializeAiColumns: () => Promise<void>;
  onRunAi: (params: {
    fieldId: string;
    recordId?: string;
    isHeader?: boolean;
  }) => Promise<void>;
}

export const useProspectTable = ({
  tableId,
}: UseProspectTableParams): UseProspectTableReturn => {
  const {
    fetchTable,
    fetchRowIds,
    columns,
    rowIds,
    runRecords,
    resetTable,
    updateCellValue,
  } = useProspectTableStore((store) => store);
  const { runAi } = useRunAi();

  // State management
  const rowsMapRef = useRef<Record<string, any>>({});
  const [rowsMap, setRowsMap] = useState<Record<string, any>>({});
  const [aiLoadingState, setAiLoadingState] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const isFetchingRef = useRef(false);
  const maxLoadedIndexRef = useRef(-1);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const lastVisibleRangeRef = useRef<{ start: number; end: number } | null>(
    null,
  );

  // Fetch metadata (headers and rowIds)
  const { isLoading: isMetadataLoading } = useSWR(
    tableId ? `metadata-${tableId}` : null,
    async () => {
      await Promise.all([fetchTable(tableId), fetchRowIds(tableId)]);
    },
    {
      revalidateOnFocus: false,
    },
  );

  // Compute AI column IDs
  const aiColumnIds = useMemo(() => {
    return new Set(
      columns
        .filter(
          (col) =>
            col.actionKey === 'use-ai' || col.actionKey?.includes('find'),
        )
        .map((col) => col.fieldId),
    );
  }, [columns]);

  // Total rows
  const total = rowIds.length;

  // Process fullData with AI field handling
  // Optimize: Only recompute when rowsMap changes, not on every rowIds change
  const fullData = useMemo(() => {
    return rowIds.map((id) => {
      const rowData = rowsMap[id];
      if (!rowData) {
        return { id, __loading: true };
      }

      const processedRowData: any = { id };
      Object.entries(rowData).forEach(([fieldId, fieldValue]) => {
        if (fieldId === 'id') {
          return;
        }

        const isAiField = aiColumnIds.has(fieldId);

        if (
          typeof fieldValue === 'object' &&
          fieldValue !== null &&
          'value' in fieldValue
        ) {
          processedRowData[fieldId] = fieldValue;
        } else if (isAiField) {
          processedRowData[fieldId] = { value: fieldValue };
        } else {
          processedRowData[fieldId] = fieldValue;
        }
      });

      return processedRowData;
    });
  }, [rowIds, rowsMap, aiColumnIds]);

  // Reset on tableId change
  useEffect(() => {
    resetTable();
    setRowsMap({});
    rowsMapRef.current = {};
    isFetchingRef.current = false;
    maxLoadedIndexRef.current = -1;
    lastVisibleRangeRef.current = null;
  }, [resetTable, tableId]);

  // WebSocket integration for real-time updates
  useTableWebSocket({
    tableId,
    rowsMapRef,
    setRowsMap,
    setAiLoadingState,
    maxLoadedIndexRef,
  });

  // Fetch batch data
  const fetchBatchData = useCallback(
    async (startIndex: number, endIndex: number) => {
      if (!tableId || isFetchingRef.current) {
        return;
      }

      const loadStartIndex = startIndex;
      const loadEndIndex = endIndex;

      if (
        loadStartIndex > loadEndIndex ||
        loadStartIndex < 0 ||
        loadEndIndex >= rowIds.length
      ) {
        return;
      }

      const batchIds = rowIds.slice(loadStartIndex, loadEndIndex + 1);
      const unloadedIds = batchIds.filter((id) => !rowsMapRef.current[id]);

      if (unloadedIds.length === 0) {
        return;
      }

      isFetchingRef.current = true;
      try {
        const res = await _fetchTableRowData({
          tableId,
          recordIds: unloadedIds,
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

        let newMaxLoaded = -1;
        for (let i = 0; i < rowIds.length; i++) {
          if (rowsMapRef.current[rowIds[i]]) {
            newMaxLoaded = i;
          }
        }
        maxLoadedIndexRef.current = newMaxLoaded;
      } finally {
        isFetchingRef.current = false;
      }
    },
    [tableId, rowIds],
  );

  // Initial data load
  useEffect(() => {
    if (!tableId || total === 0 || isMetadataLoading) {
      return;
    }
    fetchBatchData(0, Math.min(MIN_BATCH_SIZE - 1, total - 1));
  }, [tableId, total, fetchBatchData, isMetadataLoading]);

  // Re-check visible range when rowIds update (for dynamic rowIds from WebSocket)
  useEffect(() => {
    if (!lastVisibleRangeRef.current || rowIds.length === 0) {
      return;
    }

    // Delay to let virtual table update
    const timer = setTimeout(() => {
      const { start, end } = lastVisibleRangeRef.current!;

      // Re-check if current visible range needs loading
      const loadStartIndex = Math.max(0, start);
      const loadEndIndex = Math.min(rowIds.length - 1, end);

      const needsLoading = [];
      for (let i = loadStartIndex; i <= loadEndIndex; i++) {
        const rowId = rowIds[i];
        if (rowId && !rowsMapRef.current[rowId]) {
          needsLoading.push(i);
        }
      }

      if (needsLoading.length > 0) {
        const ranges = [];
        let rangeStart = needsLoading[0];
        let rangeEnd = needsLoading[0];

        for (let i = 1; i < needsLoading.length; i++) {
          if (needsLoading[i] === rangeEnd + 1) {
            rangeEnd = needsLoading[i];
          } else {
            ranges.push([rangeStart, rangeEnd]);
            rangeStart = needsLoading[i];
            rangeEnd = needsLoading[i];
          }
        }
        ranges.push([rangeStart, rangeEnd]);

        ranges.forEach(([rangeS, rangeE]) => {
          fetchBatchData(rangeS, rangeE);
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [rowIds.length, fetchBatchData]);

  // Handle visible range change (for virtualization)
  const onVisibleRangeChange = useCallback(
    (startIndex: number, endIndex: number) => {
      // Save last visible range for re-check when rowIds update
      lastVisibleRangeRef.current = { start: startIndex, end: endIndex };

      const visibleRange = endIndex - startIndex + 1;
      const overscan = Math.max(50, visibleRange * 2);

      const loadStartIndex = Math.max(0, startIndex - overscan);
      const loadEndIndex = Math.min(total - 1, endIndex + overscan);

      const needsLoading = [];
      for (let i = loadStartIndex; i <= loadEndIndex; i++) {
        const rowId = rowIds[i];
        if (rowId && !rowsMapRef.current[rowId]) {
          needsLoading.push(i);
        }
      }

      if (needsLoading.length === 0) {
        return;
      }

      const ranges = [];
      let rangeStart = needsLoading[0];
      let rangeEnd = needsLoading[0];

      for (let i = 1; i < needsLoading.length; i++) {
        if (needsLoading[i] === rangeEnd + 1) {
          rangeEnd = needsLoading[i];
        } else {
          ranges.push([rangeStart, rangeEnd]);
          rangeStart = needsLoading[i];
          rangeEnd = needsLoading[i];
        }
      }
      ranges.push([rangeStart, rangeEnd]);

      ranges.forEach(([start, end]) => {
        fetchBatchData(start, end);
      });
    },
    [fetchBatchData, total, rowIds],
  );

  // Handle AI process
  const onAiProcess = useCallback(
    (recordId: string, columnId: string) => {
      if (!aiColumnIds.has(columnId)) {
        return;
      }

      if (!runRecords) {
        return;
      }

      const fieldConfig = runRecords[columnId];
      if (!fieldConfig) {
        return;
      }

      const shouldProcess = fieldConfig.isAll
        ? rowIds.includes(recordId)
        : fieldConfig.recordIds?.includes(recordId);

      if (!shouldProcess) {
        return;
      }

      const currentValue = rowsMap[recordId]?.[columnId];

      let hasValue = false;
      let isFinished = false;

      if (
        typeof currentValue === 'object' &&
        currentValue !== null &&
        'value' in currentValue
      ) {
        isFinished = currentValue.isFinished === true;
        hasValue =
          currentValue.value !== undefined &&
          currentValue.value !== null &&
          currentValue.value !== '';

        if (isFinished) {
          return;
        }
      } else {
        hasValue =
          currentValue !== undefined &&
          currentValue !== null &&
          currentValue !== '';
      }

      if (hasValue) {
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
    [aiColumnIds, runRecords, rowIds, rowsMap],
  );

  // Clean up AI loading state based on runRecords
  useEffect(() => {
    if (!runRecords) {
      setAiLoadingState({});
      return;
    }

    if (Object.keys(runRecords).length === 0) {
      setAiLoadingState({});
      return;
    }

    const validRecordIds = new Set<string>();

    Object.entries(runRecords)
      .filter(([columnId]) => aiColumnIds.has(columnId))
      .forEach(([columnId, config]) => {
        if (config.isAll) {
          rowIds.forEach((id) => validRecordIds.add(id));
        } else {
          config.recordIds?.forEach((id) => validRecordIds.add(id));
        }
      });

    setAiLoadingState((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((recordId) => {
        if (!validRecordIds.has(recordId)) {
          delete updated[recordId];
        }
      });
      return updated;
    });
  }, [aiColumnIds, rowIds, runRecords]);

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setScrolled(scrollTop > 0);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  // Handle cell edit
  const onCellEdit = useCallback(
    async (recordId: string, fieldId: string, value: any) => {
      const currentRowData = rowsMapRef.current[recordId] || { id: recordId };
      const updatedRowData = { ...currentRowData, [fieldId]: value };

      rowsMapRef.current[recordId] = updatedRowData;
      setRowsMap((prev) => ({
        ...prev,
        [recordId]: updatedRowData,
      }));

      await updateCellValue({ tableId, recordId, fieldId, value });
    },
    [tableId, updateCellValue],
  );

  // Update row data helper (for dialogs)
  const onUpdateRowData = useCallback(
    (recordId: string, updates: Record<string, any>) => {
      const currentRowData = rowsMapRef.current[recordId] || { id: recordId };
      const updatedRowData = { ...currentRowData, ...updates };

      rowsMapRef.current[recordId] = updatedRowData;
      setRowsMap((prev) => ({
        ...prev,
        [recordId]: updatedRowData,
      }));
    },
    [],
  );

  // Initialize AI columns (called after AI column creation)
  const onInitializeAiColumns = useCallback(async () => {
    const { runRecords: updatedRunRecords } = await fetchTable(tableId);

    if (!updatedRunRecords) {
      return;
    }

    const validRecordIds = new Set<string>();

    Object.entries(updatedRunRecords)
      .filter(([columnId]) => aiColumnIds.has(columnId))
      .forEach(([columnId, config]) => {
        if (config.isAll) {
          rowIds.forEach((id) => validRecordIds.add(id));
        } else {
          config.recordIds?.forEach((id) => validRecordIds.add(id));
        }
      });

    const newLoadingState: Record<string, Record<string, boolean>> = {};
    validRecordIds.forEach((recordId) => {
      Object.entries(updatedRunRecords)
        .filter(([columnId]) => aiColumnIds.has(columnId))
        .forEach(([columnId, config]) => {
          const shouldProcess = config.isAll
            ? rowIds.includes(recordId)
            : config.recordIds?.includes(recordId);

          if (shouldProcess) {
            onUpdateRowData(recordId, {
              [columnId]: { value: '', isFinished: false },
            });

            if (!newLoadingState[recordId]) {
              newLoadingState[recordId] = {};
            }
            newLoadingState[recordId][columnId] = true;
          }
        });
    });

    setAiLoadingState(newLoadingState);
  }, [tableId, fetchTable, aiColumnIds, rowIds, onUpdateRowData]);

  const onRunAi = useCallback(
    async (params: {
      fieldId: string;
      recordId?: string;
      isHeader?: boolean;
    }) => {
      const { fieldId, recordId, isHeader } = params;

      try {
        if (isHeader) {
          const recordCount = Math.min(10, rowIds.length);
          const targetRecordIds = rowIds.slice(0, recordCount);

          await runAi({
            tableId,
            recordCount,
            fieldId,
          });

          targetRecordIds.forEach((rid) => {
            onUpdateRowData(rid, {
              [fieldId]: { value: '', isFinished: false },
            });
          });
        } else if (recordId) {
          await runAi({
            tableId,
            recordIds: [recordId],
            fieldId,
          });

          onUpdateRowData(recordId, {
            [fieldId]: { value: '', isFinished: false },
          });
        }

        await onInitializeAiColumns();
      } catch (error) {
        console.error('Failed to run AI:', error);
      }
    },
    [tableId, rowIds, runAi, onUpdateRowData, onInitializeAiColumns],
  );

  return {
    fullData,
    aiLoadingState,
    aiColumnIds,
    isMetadataLoading,
    scrollContainerRef,
    rowsMapRef,
    scrolled,
    setAiLoadingState,
    onVisibleRangeChange,
    onAiProcess,
    onCellEdit,
    onUpdateRowData,
    onInitializeAiColumns,
    onRunAi,
  };
};
