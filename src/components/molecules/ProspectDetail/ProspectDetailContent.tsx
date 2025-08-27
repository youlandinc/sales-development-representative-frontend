import { Stack } from '@mui/material';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';

import { useProspectTableStore, useWebResearchStore } from '@/stores/Prospect';

import { useWebSocket } from '@/hooks';
import { useColumnActionCollections } from './hooks';

import { StyledTable } from '@/components/atoms';
import { WebResearch } from '@/components/molecules';

import {
  DialogDeleteColumn,
  FieldDescription,
  TableColumnMenuEnum,
} from './index';

import { _fetchTableRowData } from '@/request';
import { WebSocketTypeEnum } from '@/types';

interface ProspectDetailTableProps {
  tableId: string;
}

export const ProspectDetailContent: FC<ProspectDetailTableProps> = ({
  tableId,
}) => {
  const {
    fetchTable,
    fetchRowIds,
    columns,
    rowIds,
    runRecords,
    resetTable,
    updateCellValue,
    updateColumnWidth,
    updateColumnName,
    updateColumnPin,
    updateColumnVisible,
    openDialog,
    setActiveColumnId,
  } = useProspectTableStore((store) => store);
  const { setOpen, setSchemaJson, setPrompt, setGenerateDescription } =
    useWebResearchStore((store) => store);
  const { messages, connected } = useWebSocket();

  const { descriptionDialog } = useColumnActionCollections();

  const { isLoading: isMetadataLoading } = useSWR(
    tableId ? `metadata-${tableId}` : null,
    async () => {
      await Promise.all([fetchTable(tableId), fetchRowIds(tableId)]);
    },
    {
      revalidateOnFocus: false,
    },
  );

  const aiColumnIds = useMemo(() => {
    return new Set(
      columns
        .filter((col) => col.actionKey === 'use-ai')
        .map((col) => col.fieldId),
    );
  }, [columns]);

  const rowsMapRef = useRef<Record<string, any>>({});
  const [rowsMap, setRowsMap] = useState<Record<string, any>>({});
  const [aiLoadingState, setAiLoadingState] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const isFetchingRef = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const ROW_HEIGHT = 36;
  const MIN_BATCH_SIZE = 50;

  const maxLoadedIndexRef = useRef(-1);

  const total = rowIds.length;
  const fullData = useMemo(
    () =>
      rowIds.map((id) => {
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
            (processedRowData as any)[fieldId] = fieldValue;
          } else if (isAiField) {
            (processedRowData as any)[fieldId] = { value: fieldValue };
          } else {
            (processedRowData as any)[fieldId] = fieldValue;
          }
        });

        return processedRowData;
      }),
    [rowIds, rowsMap, aiColumnIds],
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
          aiMessage.type === WebSocketTypeEnum.message &&
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
      const unloadedIds = batchIds.filter((id, index) => {
        const actualIndex = loadStartIndex + index;
        return !rowsMapRef.current[id];
      });

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

  useEffect(() => {
    if (!tableId || total === 0 || isMetadataLoading) {
      return;
    }
    fetchBatchData(0, Math.min(MIN_BATCH_SIZE - 1, total - 1));
  }, [tableId, total, fetchBatchData, isMetadataLoading]);

  const handleVisibleRangeChange = useCallback(
    (startIndex: number, endIndex: number) => {
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

  const handleAiProcess = useCallback(
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
      {columns.length > 0 && rowIds.length > 0 && (
        <StyledTable
          aiLoading={aiLoadingState}
          columns={columns}
          data={fullData}
          onAddMenuItemClick={(item) => {
            setOpen(true);
          }}
          onAiProcess={handleAiProcess}
          onCellClick={(columnId, rowId, data) => {
            console.log(columnId, rowId, data);
          }}
          onCellEdit={async (recordId, fieldId, value) => {
            setRowsMap((prev) => {
              const currentRowData = prev[recordId] || {};
              return {
                ...prev,
                [recordId]: {
                  ...currentRowData,
                  [fieldId]: value,
                },
              };
            });

            if (rowsMapRef.current[recordId]) {
              rowsMapRef.current[recordId][fieldId] = value;
            }

            await updateCellValue({ tableId, recordId, fieldId, value });
          }}
          onColumnResize={(fieldId, width) => updateColumnWidth(fieldId, width)}
          onHeaderMenuClick={async ({ type, columnId, value }) => {
            if (!columnId || !columns.find((col) => col.fieldId === columnId)) {
              return;
            }
            setActiveColumnId(columnId);

            switch (type) {
              case TableColumnMenuEnum.edit_column: {
                const column = columns.find((col) => col.fieldId === columnId);
                if (!column || column.actionKey !== 'use-ai') {
                  return;
                }
                const schema = column.typeSettings.inputBinding.find(
                  (item) => item.name === 'answerSchemaType',
                )?.formulaText;
                const prompt = column.typeSettings.inputBinding.find(
                  (item) => item.name === 'prompt',
                )?.formulaText;
                const metaprompt = column.typeSettings.inputBinding.find(
                  (item) => item.name === 'metaprompt',
                )?.formulaText;
                prompt && setPrompt(prompt);
                schema && setSchemaJson(schema);
                metaprompt && setGenerateDescription(metaprompt);
                // todo : extra params
                //findParams(column,['answerSchemaType','prompt','metaprompt']
                setOpen(true);
                break;
              }
              case TableColumnMenuEnum.edit_description: {
                const column = columns.find((col) => col.fieldId === columnId);
                if (!column) {
                  return;
                }
                descriptionDialog.handleOpenDescriptionDialog(
                  columnId,
                  column.description || '',
                );
                break;
              }
              case TableColumnMenuEnum.rename_column: {
                if (value) {
                  await updateColumnName(value);
                }
                break;
              }
              case TableColumnMenuEnum.pin: {
                await updateColumnPin(value);
                break;
              }
              case TableColumnMenuEnum.visible: {
                await updateColumnVisible(columnId, value);
                break;
              }
              case TableColumnMenuEnum.delete: {
                openDialog(TableColumnMenuEnum.delete);
                break;
              }
              default: {
                return;
              }
            }
          }}
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

      <WebResearch
        cb={async () => {
          await fetchTable(tableId);
        }}
        tableId={tableId}
      />
      <FieldDescription
        cb={async () => {
          await fetchTable(tableId);
        }}
        defaultValue={descriptionDialog.defaultValue}
        fieldId={descriptionDialog.fieldId}
        onClose={descriptionDialog.closeDescriptionDialog}
        open={descriptionDialog.descriptionShow}
      />

      <DialogDeleteColumn />
    </Stack>
  );
};
