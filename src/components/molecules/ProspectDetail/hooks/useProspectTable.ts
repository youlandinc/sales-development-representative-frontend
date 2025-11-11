import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useSWR from 'swr';

import { useProspectTableStore, useWorkEmailStore } from '@/stores/Prospect';
import { useTableWebSocket } from './useTableWebSocket';
import { useRunAi } from '@/hooks';

import { _fetchTableRowData } from '@/request';
import { checkIsAiColumn, MIN_BATCH_SIZE } from '@/constant/table';

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
  setAiLoadingState: Dispatch<
    SetStateAction<Record<string, Record<string, boolean>>>
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
  refetchCachedRecords: () => Promise<void>;
}

// TODO: Hook优化
// 1. Hook职责过重，承担了太多功能
// 2. 考虑拆分为多个更小的hooks: useTableData, useAiProcessing, useVirtualization
// 3. 状态管理可以优化为更清晰的结构
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
  const { fetchIntegrationMenus } = useWorkEmailStore((store) => store);

  // TODO: 状态管理优化
  // 1. 同时使用ref和state维护rowsMap，容易造成不一致
  // 2. 过多的useRef可能表明状态设计有问题
  // 3. 考虑使用zustand或其他状态管理方案
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

  // Compute AI column IDs (包括 dependentFieldId)
  const aiColumnIds = useMemo(() => {
    return new Set(columns.filter(checkIsAiColumn).map((col) => col.fieldId));
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

  // Add new columns to existing rows with default empty values
  const addColumnsToRows = useCallback(() => {
    if (columns.length === 0) {
      return;
    }

    const columnIds = new Set(columns.map((col) => col.fieldId));

    setRowsMap((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((rowId) => {
        const row = updated[rowId];
        columnIds.forEach((fieldId) => {
          if (!(fieldId in row)) {
            // Add new column with empty default value
            row[fieldId] = '';
          }
        });
      });
      return updated;
    });

    // Update ref as well
    Object.keys(rowsMapRef.current).forEach((rowId) => {
      const row = rowsMapRef.current[rowId];
      columnIds.forEach((fieldId) => {
        if (!(fieldId in row)) {
          row[fieldId] = '';
        }
      });
    });
  }, [columns]);

  // Reset on tableId change
  useEffect(() => {
    resetTable();
    setRowsMap({});
    rowsMapRef.current = {};
    isFetchingRef.current = false;
    maxLoadedIndexRef.current = -1;
    lastVisibleRangeRef.current = null;
  }, [resetTable, tableId]);

  // Add new columns when columns count changes
  useEffect(() => {
    if (columns.length > 0) {
      addColumnsToRows();
    }
  }, [columns.length, addColumnsToRows]);

  // WebSocket integration for real-time updates
  useTableWebSocket({
    tableId,
    rowsMapRef,
    setRowsMap,
    setAiLoadingState,
    maxLoadedIndexRef,
  });

  // TODO: 数据加载优化
  // 1. 批量加载逻辑可以提取为独立的hook
  // 2. 考虑添加错误处理和重试机制
  // 3. 加载状态管理可以更细粒度
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

  // Refetch all cached records (e.g., after column type change)
  const refetchCachedRecords = useCallback(async () => {
    if (!tableId || isFetchingRef.current) {
      return;
    }

    // Get all cached record IDs
    const cachedRecordIds = Object.keys(rowsMapRef.current);

    if (cachedRecordIds.length === 0) {
      return;
    }

    isFetchingRef.current = true;
    try {
      const res = await _fetchTableRowData({
        tableId,
        recordIds: cachedRecordIds,
      });
      const arr = (res?.data ?? []) as any[];
      const newRowsMap: Record<string, any> = {};
      arr.forEach((row) => {
        if (row && row.id) {
          newRowsMap[row.id] = row;
        }
      });

      // Update both state and ref
      setRowsMap((prev) => ({ ...prev, ...newRowsMap }));
      rowsMapRef.current = { ...rowsMapRef.current, ...newRowsMap };
    } finally {
      isFetchingRef.current = false;
    }
  }, [tableId]);

  // Initial data load
  useEffect(() => {
    if (!tableId || total === 0 || isMetadataLoading) {
      return;
    }
    fetchBatchData(0, Math.min(MIN_BATCH_SIZE - 1, total - 1));
    fetchIntegrationMenus();
  }, [
    tableId,
    total,
    fetchBatchData,
    isMetadataLoading,
    fetchIntegrationMenus,
  ]);

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

  // TODO: AI处理逻辑优化
  // 1. onAiProcess逻辑复杂，包含多个条件判断
  // 2. 可以拆分为更小的辅助函数
  // 3. AI loading状态管理可以更清晰
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

      // 设置当前列的 loading 状态
      const loadingUpdates: Record<string, boolean> = {
        [columnId]: true,
      };

      // 如果该列有 dependentFieldId，也设置其 loading 状态
      const column = columns.find((col) => col.fieldId === columnId);
      if (column?.dependentFieldId) {
        loadingUpdates[column.dependentFieldId] = true;
      }

      setAiLoadingState((prev) => ({
        ...prev,
        [recordId]: {
          ...prev[recordId],
          ...loadingUpdates,
        },
      }));
    },
    [aiColumnIds, runRecords, rowIds, rowsMap, columns],
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
      const currentFieldValue = currentRowData[fieldId];

      // Optimistic update
      let optimisticFieldValue;
      if (
        typeof currentFieldValue === 'object' &&
        currentFieldValue !== null &&
        'value' in currentFieldValue
      ) {
        optimisticFieldValue = { ...currentFieldValue, value };
      } else {
        optimisticFieldValue = value;
      }

      const optimisticRowData = {
        ...currentRowData,
        [fieldId]: optimisticFieldValue,
      };

      rowsMapRef.current[recordId] = optimisticRowData;
      setRowsMap((prev) => ({
        ...prev,
        [recordId]: optimisticRowData,
      }));

      try {
        // Call API and get server response
        const response = await updateCellValue({
          tableId,
          recordId,
          fieldId,
          value,
        });

        // Update with server response (includes metaData.isValidate, etc.)
        if (response?.data) {
          const serverFieldValue = response.data;
          const finalRowData = {
            ...rowsMapRef.current[recordId],
            [fieldId]: serverFieldValue,
          };

          rowsMapRef.current[recordId] = finalRowData;
          setRowsMap((prev) => ({
            ...prev,
            [recordId]: finalRowData,
          }));
        }
      } catch (error) {
        // Rollback on error
        rowsMapRef.current[recordId] = currentRowData;
        setRowsMap((prev) => ({
          ...prev,
          [recordId]: currentRowData,
        }));
        throw error;
      }
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
            const column = columns.find((col) => col.fieldId === columnId);
            const updates: Record<string, any> = {
              [columnId]: { value: '', isFinished: false },
            };

            if (column?.dependentFieldId) {
              updates[column.dependentFieldId] = {
                value: '',
                isFinished: false,
              };
            }

            onUpdateRowData(recordId, updates);

            if (!newLoadingState[recordId]) {
              newLoadingState[recordId] = {};
            }
            newLoadingState[recordId][columnId] = true;

            if (column?.dependentFieldId) {
              newLoadingState[recordId][column.dependentFieldId] = true;
            }
          }
        });
    });

    setAiLoadingState(newLoadingState);
  }, [tableId, fetchTable, aiColumnIds, rowIds, columns, onUpdateRowData]);

  // TODO: AI运行优化
  // 1. onRunAi函数包含太多if-else分支
  // 2. 参数类型可以更明确（使用discriminated union）
  // 3. 错误处理需要增强
  const onRunAi = useCallback(
    async (params: {
      fieldId: string; // '__select' or actual fieldId
      recordId?: string;
      isHeader?: boolean;
      recordCount?: number;
    }) => {
      const { fieldId, recordId, isHeader, recordCount } = params;

      try {
        if (isHeader) {
          const apiParams: any = {
            tableId,
            fieldId,
          };

          if (recordCount !== undefined) {
            apiParams.recordCount = recordCount;
            const targetRecordIds = rowIds.slice(0, recordCount);

            await runAi(apiParams);

            targetRecordIds.forEach((rid) => {
              onUpdateRowData(rid, {
                [fieldId]: { value: '', isFinished: false },
              });
            });
          } else {
            // Run all rows
            await runAi(apiParams);

            rowIds.forEach((rid) => {
              onUpdateRowData(rid, {
                [fieldId]: { value: '', isFinished: false },
              });
            });
          }
        } else if (recordId) {
          // 如果 fieldId 是 '__select'，说明点击的是选择列的 AI 图标
          // 需要获取所有符合 AI 条件的列
          const aiFieldsWithDependents = columns.filter(checkIsAiColumn);

          // 收集所有 fieldIds，包括 dependentFieldId
          const fieldIds: string[] = [];
          const loadingUpdates: Record<string, boolean> = {};
          aiFieldsWithDependents.forEach((col) => {
            fieldIds.push(col.fieldId);
            loadingUpdates[col.fieldId] = true;
            if (col.dependentFieldId) {
              fieldIds.push(col.dependentFieldId);
              loadingUpdates[col.dependentFieldId] = true;
            }
          });

          // 立即设置 loading 状态
          setAiLoadingState((prev) => ({
            ...prev,
            [recordId]: {
              ...prev[recordId],
              ...loadingUpdates,
            },
          }));

          // 设置数据状态
          const updates: Record<string, any> = {};
          aiFieldsWithDependents.forEach((col) => {
            updates[col.fieldId] = { value: '', isFinished: false };
            if (col.dependentFieldId) {
              updates[col.dependentFieldId] = { value: '', isFinished: false };
            }
          });
          onUpdateRowData(recordId, updates);

          await runAi({
            tableId,
            recordIds: [recordId],
            fieldIds,
          });
        }

        await onInitializeAiColumns();
      } catch (error) {
        console.error('Failed to run AI:', error);
      }
    },
    [tableId, rowIds, columns, runAi, onUpdateRowData, onInitializeAiColumns],
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
    refetchCachedRecords,
  };
};
