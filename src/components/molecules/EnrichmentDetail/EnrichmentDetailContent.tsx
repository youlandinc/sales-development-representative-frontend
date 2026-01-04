import { Icon, Stack } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { UTypeOf } from '@/utils';
import { useEnrichmentTable } from './hooks';

import {
  ActiveTypeEnum,
  useEnrichmentTableStore,
  useWebResearchStore,
  useWorkEmailStore,
} from '@/stores/enrichment';
import {
  TabTypeEnum,
  useActionsStore,
} from '@/stores/enrichment/useActionsStore';
import { useDialogStore } from '@/stores/useDialogStore';

import { ROW_HEIGHT } from './Table/config';

import { StyledButton, StyledLoading } from '@/components/atoms';
import { DrawerActionsContainer } from '@/components/molecules';
import {
  HeadColumnsPanel,
  HeadFilterPanel,
  //HeadRowsPanel,
  HeadViewPanel,
} from './Panel';
import { StyledTable } from './Table';

import { ActiveCellParams, SourceOfOpenEnum } from '@/types';
import {
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

import { _createTableRows } from '@/request';

import ICON_ARROW from './assets/head/icon-arrow-line-left.svg';

interface InputBindingItem {
  name: string;
  formulaText?: string;
}

const extractAiConfigFromInputBinding = (inputBinding?: InputBindingItem[]) => {
  const schema = inputBinding?.find(
    (item) => item.name === 'answerSchemaType',
  )?.formulaText;
  const prompt = inputBinding?.find(
    (item) => item.name === 'prompt',
  )?.formulaText;
  const metaprompt = inputBinding?.find(
    (item) => item.name === 'metaprompt',
  )?.formulaText;
  const enableWebSearch =
    inputBinding?.find((item) => item.name === 'enableWebSearch')
      ?.formulaText === 'true';
  const model =
    inputBinding?.find((item) => item.name === 'model')?.formulaText || '';
  const taskDescription =
    inputBinding?.find((item) => item.name === 'taskDescription')
      ?.formulaText || '';

  return {
    schema,
    prompt,
    metaprompt,
    enableWebSearch,
    model,
    taskDescription,
  };
};

interface EnrichmentDetailTableProps {
  tableId: string;
}

export const EnrichmentDetailContent: FC<EnrichmentDetailTableProps> = ({
  tableId,
}) => {
  const {
    drawersType,
    // ======
    activeColumnId,
    addColumn,
    closeDialog,
    columns,
    dialogType,
    dialogVisible,
    fieldGroupMap,
    openDialog,
    rowIds,
    setActiveColumnId,
    setRowIds,
    updateColumnName,
    updateColumnPin,
    updateColumnType,
    updateColumnVisible,
    updateColumnWidth,
    updateColumnOrder,
  } = useEnrichmentTableStore(
    useShallow((store) => ({
      drawersType: store.drawersType,

      activeColumnId: store.activeColumnId,
      addColumn: store.addColumn,
      closeDialog: store.closeDialog,
      columns: store.columns,
      dialogType: store.dialogType,
      dialogVisible: store.dialogVisible,
      fieldGroupMap: store.fieldGroupMap,
      openDialog: store.openDialog,
      rowIds: store.rowIds,
      setActiveColumnId: store.setActiveColumnId,
      setRowIds: store.setRowIds,
      updateColumnName: store.updateColumnName,
      updateColumnPin: store.updateColumnPin,
      updateColumnType: store.updateColumnType,
      updateColumnVisible: store.updateColumnVisible,
      updateColumnWidth: store.updateColumnWidth,
      updateColumnOrder: store.updateColumnOrder,
    })),
  );

  const { setEditParams, setWebResearchVisible, allClear, setWebResearchTab } =
    useWebResearchStore(
      useShallow((store) => ({
        setEditParams: store.setEditParams,
        setWebResearchVisible: store.setWebResearchVisible,
        allClear: store.allClear,
        setWebResearchTab: store.setWebResearchTab,
      })),
    );

  const setAiTableInfo = useDialogStore((state) => state.setAiTableInfo);

  const { fetchActionsMenus, setSourceOfOpen, setTabType } = useActionsStore(
    useShallow((state) => ({
      fetchActionsMenus: state.fetchActionsMenus,
      setSourceOfOpen: state.setSourceOfOpen,
      setTabType: state.setTabType,
    })),
  );

  const { onClickToEditWorkEmail, onClickToSingleIntegration } =
    useWorkEmailStore(
      useShallow((store) => ({
        onClickToEditWorkEmail: store.handleEditClick,
        onClickToSingleIntegration: store.onClickToSingleIntegration,
      })),
    );

  const onClickActions = () => {
    setAiTableInfo({ tableId, mappings: [] });
    setWebResearchVisible(true, ActiveTypeEnum.add);
    openDialog(TableColumnMenuActionEnum.actions_overview);
    setSourceOfOpen(SourceOfOpenEnum.drawer);
  };

  const [activeCell, setActiveCell] = useState<ActiveCellParams>({
    columnId: '',
    rowId: '',
  });
  const [isActionsButtonVisible, setIsActionsButtonVisible] = useState(false);

  // 300ms delay for showing the Actions button
  const shouldShowButton = !(
    dialogVisible && (drawersType as string[]).includes(dialogType || '')
  );

  useEffect(() => {
    if (shouldShowButton) {
      const timer = setTimeout(() => {
        setIsActionsButtonVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
    setIsActionsButtonVisible(false);
  }, [shouldShowButton]);

  // Use the new table hook
  const {
    fullData,
    aiLoadingState,
    scrollContainerRef,
    isScrolled,
    isTableLoading,
    isRowIdsLoading,
    onVisibleRangeChange,
    onAiProcess,
    onCellEdit,
    onInitializeAiColumns,
    onRunAi,
    refetchCachedRecords,
  } = useEnrichmentTable({ tableId });

  // Add rows callback
  const onClickToAddRows = async (count: number) => {
    try {
      const { data } = await _createTableRows({
        tableId,
        rowCounts: count,
      });

      if (data && data.length > 0) {
        // Add new record IDs to the end of the existing rowIds
        setRowIds([...rowIds, ...data]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create rows:', error);
    }
  };

  // Add column callback
  const onClickToAddColumn = async (params: {
    fieldType: TableColumnTypeEnum;
    beforeFieldId?: string; // Insert before this field
    afterFieldId?: string; // Insert after this field
    // If neither provided, insert at end
  }) => {
    try {
      const newColumn = await addColumn({
        tableId,
        ...params,
      });

      if (newColumn) {
        // If it's an AI column, initialize it
        if (newColumn.actionKey === 'use-ai') {
          await onInitializeAiColumns();
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add column:', error);
    }
  };

  // useEffect(() => {
  //   if (tableId) {
  //     fetchSuggestions(tableId);
  //   }
  //   fetchEnrichments();
  // }, [tableId, fetchSuggestions, fetchEnrichments]);
  return (
    <Stack
      sx={{
        borderTop: '1px solid #DFDEE6',
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
      }}
    >
      <Stack sx={{ flex: 1, width: 0 }}>
        {!isTableLoading && columns.length > 0 && (
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              p: '12px 24px 12px 16px',
            }}
          >
            <Stack
              sx={{
                alignItems: 'center',
                flexDirection: 'row',
                gap: 3,
                height: 32,
              }}
            >
              <HeadViewPanel tableId={tableId} />
              <HeadColumnsPanel tableId={tableId} />
              {/*<HeadRowsPanel />*/}
              <HeadFilterPanel />
            </Stack>
            {isActionsButtonVisible && (
              <Stack flexDirection={'row'}>
                <StyledButton
                  onClick={onClickActions}
                  size={'small'}
                  variant={'contained'}
                >
                  <Stack
                    sx={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: 0.5,
                    }}
                  >
                    Actions
                    <Icon
                      component={ICON_ARROW}
                      sx={{ width: 16, height: 16 }}
                    />
                  </Stack>
                </StyledButton>
              </Stack>
            )}
          </Stack>
        )}
        <Stack
          ref={scrollContainerRef}
          sx={{
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            flex: 1,
          }}
        >
          {isTableLoading || isRowIdsLoading ? (
            <Stack
              alignItems={'center'}
              flex={1}
              height={'100%'}
              justifyContent={'center'}
            >
              <StyledLoading size={24} sx={{ color: '#D0CEDA !important' }} />
            </Stack>
          ) : columns.length === 0 ? null : (
            <StyledTable
              aiLoading={aiLoadingState}
              columns={columns}
              data={fullData}
              externalActiveColumnId={activeColumnId}
              isScrolled={isScrolled}
              onAddMenuItemClick={(item) => {
                // AI Agent opens configuration dialog
                if (item.value === TableColumnMenuActionEnum.ai_agent) {
                  openDialog(TableColumnMenuActionEnum.actions_overview);
                  setTabType(TabTypeEnum.suggestions);
                  return;
                }

                // Other column types: add to end (no beforeFieldId or afterFieldId)
                const validTypes = Object.values(TableColumnTypeEnum);
                if (validTypes.includes(item.value as TableColumnTypeEnum)) {
                  onClickToAddColumn({
                    fieldType: item.value as TableColumnTypeEnum,
                    // No beforeFieldId or afterFieldId = insert at end
                  });
                }
                if (item.value === TableColumnMenuActionEnum.work_email) {
                  openDialog(TableColumnMenuActionEnum.actions_overview);
                  setTabType(TabTypeEnum.enrichments);
                  return;
                }
              }}
              onAddRows={onClickToAddRows}
              onAiProcess={onAiProcess}
              onCellClick={(columnId, _rowId, data) => {
                const cell = data.original?.[columnId];
                const actionKey = columns.find(
                  (col) => col.fieldId === columnId,
                )?.actionKey;
                const hasContent =
                  cell &&
                  cell?.isFinished !== null &&
                  UTypeOf.isString(actionKey);

                if (hasContent) {
                  setActiveColumnId(columnId);
                  setActiveCell({
                    columnId,
                    rowId: _rowId,
                  });
                  if (!dialogVisible) {
                    openDialog(TableColumnMenuActionEnum.cell_detail);
                  }
                  return;
                }

                if (
                  dialogVisible &&
                  dialogType === TableColumnMenuActionEnum.cell_detail
                ) {
                  closeDialog();
                }
              }}
              onCellEdit={onCellEdit}
              onColumnResize={(fieldId, width) =>
                updateColumnWidth(fieldId, width)
              }
              onColumnSort={updateColumnOrder}
              onHeaderMenuClick={async ({
                type,
                columnId,
                value,
                parentValue,
              }: any) => {
                if (
                  !columnId ||
                  !columns.find((col) => col.fieldId === columnId)
                ) {
                  return;
                }
                setActiveColumnId(columnId);

                switch (type) {
                  case TableColumnMenuActionEnum.edit_column: {
                    const column = columns.find(
                      (col) => col.fieldId === columnId,
                    );
                    // Work Email configuration
                    if (column?.groupId && fieldGroupMap) {
                      onClickToEditWorkEmail(columnId);
                      return;
                    }
                    //groupId === null && actionKey !== 'use-ai' ==> 单独integration，非group integration
                    if (
                      column?.groupId === null &&
                      column?.actionKey !== 'use-ai' &&
                      column?.actionKey
                    ) {
                      onClickToSingleIntegration(columnId);
                      return;
                    }
                    // AI column configuration
                    if (column && column.actionKey === 'use-ai') {
                      const {
                        schema,
                        prompt,
                        metaprompt,
                        enableWebSearch,
                        model,
                        taskDescription,
                      } = extractAiConfigFromInputBinding(
                        column.typeSettings?.inputBinding,
                      );
                      allClear();
                      setEditParams({
                        webResearchVisible: true,
                        schemaJson: schema || '',
                        prompt: prompt || '',
                        generateDescription: metaprompt || '',
                        enableWebSearch,
                        model,
                        taskDescription,
                      });
                      setWebResearchTab('configure');
                      openDialog(TableColumnMenuActionEnum.ai_agent);
                      return;
                    }
                    // common edit column
                    openDialog(TableColumnMenuActionEnum.edit_column);

                    break;
                  }
                  case TableColumnMenuActionEnum.edit_description: {
                    openDialog(TableColumnMenuActionEnum.edit_description);
                    break;
                  }
                  case TableColumnMenuActionEnum.rename_column: {
                    if (value) {
                      await updateColumnName(value);
                      fetchActionsMenus(tableId);
                    }
                    break;
                  }
                  case TableColumnMenuActionEnum.pin: {
                    await updateColumnPin(value);
                    break;
                  }
                  case TableColumnMenuActionEnum.visible: {
                    await updateColumnVisible(columnId, value);
                    break;
                  }
                  case TableColumnMenuActionEnum.delete: {
                    openDialog(TableColumnMenuActionEnum.delete);
                    break;
                  }
                  default: {
                    // Handle change column type (from submenu)
                    if (
                      parentValue ===
                      TableColumnMenuActionEnum.change_column_type
                    ) {
                      const validTypes = Object.values(TableColumnTypeEnum);
                      if (validTypes.includes(value as TableColumnTypeEnum)) {
                        await updateColumnType(value as TableColumnTypeEnum);
                        // Refetch cached records to get new type-converted values
                        await refetchCachedRecords();
                      }
                      return;
                    }
                    // Handle insert column (from submenu)
                    if (
                      parentValue ===
                        TableColumnMenuActionEnum.insert_column_left ||
                      parentValue ===
                        TableColumnMenuActionEnum.insert_column_right
                    ) {
                      const validTypes = Object.values(TableColumnTypeEnum);
                      if (validTypes.includes(value as TableColumnTypeEnum)) {
                        if (
                          parentValue ===
                          TableColumnMenuActionEnum.insert_column_left
                        ) {
                          // Insert left: use beforeFieldId with current column's ID
                          await onClickToAddColumn({
                            fieldType: value as TableColumnTypeEnum,
                            beforeFieldId: columnId,
                          });
                        } else {
                          // Insert right: use afterFieldId with current column's ID
                          await onClickToAddColumn({
                            fieldType: value as TableColumnTypeEnum,
                            afterFieldId: columnId,
                          });
                        }
                      }
                    }
                    return;
                  }
                }
              }}
              onRunAi={onRunAi}
              rowIds={rowIds}
              tableId={tableId}
              virtualization={{
                enabled: true,
                rowHeight: ROW_HEIGHT,
                scrollContainer: scrollContainerRef,
                onVisibleRangeChange: onVisibleRangeChange,
              }}
            />
          )}
        </Stack>
      </Stack>
      <DrawerActionsContainer
        cellDetails={activeCell}
        onInitializeAiColumns={onInitializeAiColumns}
        tableId={tableId}
      />
    </Stack>
  );
};
