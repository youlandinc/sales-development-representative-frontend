import { FC, useState } from 'react';
import { Stack } from '@mui/material';

import {
  ActiveTypeEnum,
  useProspectTableStore,
  useWebResearchStore,
  useWorkEmailStore,
} from '@/stores/Prospect';

import { ROW_HEIGHT } from '@/constant/table';
import { useProspectTable } from './hooks';

import { StyledTable } from '@/components/atoms';
import {
  CampaignProcess,
  DialogAllIntegrations,
  DialogCellDetails,
  DialogDeleteColumn,
  DialogEditColumn,
  DialogEditDescription,
  DialogHeaderActions,
  DialogWebResearch,
  DialogWorkEmail,
} from '@/components/molecules';

import { _createTableRows } from '@/request';
import {
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/Prospect/table';

interface ProspectDetailTableProps {
  tableId: string;
}

export const ProspectDetailContent: FC<ProspectDetailTableProps> = ({
  tableId,
}) => {
  const {
    columns,
    fieldGroupMap,
    rowIds,
    setRowIds,
    updateColumnWidth,
    updateColumnName,
    updateColumnPin,
    updateColumnVisible,
    updateColumnType,
    openDialog,
    closeDialog,
    dialogVisible,
    dialogType,
    setActiveColumnId,
    addColumn,
  } = useProspectTableStore((store) => store);

  const {
    setWebResearchVisible,
    setSchemaJson,
    setPrompt,
    setGenerateDescription,
  } = useWebResearchStore((store) => store);

  const { handleEditClick } = useWorkEmailStore((store) => store);

  const [activeCell, setActiveCell] = useState<Record<string, any>>({});

  // Use the new table hook
  const {
    fullData,
    aiLoadingState,
    scrollContainerRef,
    scrolled,
    onVisibleRangeChange,
    onAiProcess,
    onCellEdit,
    onInitializeAiColumns,
    onRunAi,
    refetchCachedRecords,
  } = useProspectTable({ tableId });

  // Add rows callback
  const onClickToAddRows = async (count: number) => {
    try {
      const { data } = await _createTableRows({
        tableId,
        rowCounts: count,
      });

      console.log('Created rows:', data);

      if (data && data.length > 0) {
        // Add new record IDs to the end of the existing rowIds
        setRowIds([...rowIds, ...data]);
      }
    } catch (error) {
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
        console.log('Column added:', newColumn);

        // If it's an AI column, initialize it
        if (newColumn.actionKey === 'use-ai') {
          await onInitializeAiColumns();
        }
      }
    } catch (error) {
      console.error('Failed to add column:', error);
    }
  };

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
            // AI Agent opens configuration dialog
            if (item.value === TableColumnMenuActionEnum.ai_agent) {
              setWebResearchVisible(true, ActiveTypeEnum.add);
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
          }}
          onAddRows={onClickToAddRows}
          onAiProcess={onAiProcess}
          onCellClick={(columnId, rowId, data) => {
            if (data.original?.[columnId]?.externalContent) {
              setActiveColumnId(columnId);
              setActiveCell(data.original?.[columnId]?.externalContent || {});
              !dialogVisible &&
                openDialog(TableColumnMenuActionEnum.cell_detail);
              return;
            }
            dialogVisible &&
              dialogType === TableColumnMenuActionEnum.cell_detail &&
              closeDialog();
          }}
          onCellEdit={onCellEdit}
          onColumnResize={(fieldId, width) => updateColumnWidth(fieldId, width)}
          onHeaderMenuClick={async ({
            type,
            columnId,
            value,
            parentValue,
          }: any) => {
            if (!columnId || !columns.find((col) => col.fieldId === columnId)) {
              return;
            }
            setActiveColumnId(columnId);

            switch (type) {
              case TableColumnMenuActionEnum.edit_column: {
                const column = columns.find((col) => col.fieldId === columnId);
                // Work Email configuration
                if (column?.groupId && fieldGroupMap) {
                  handleEditClick(columnId);
                  return;
                }
                // AI column configuration
                if (column && column.actionKey === 'use-ai') {
                  const schema = column.typeSettings?.inputBinding.find(
                    (item) => item.name === 'answerSchemaType',
                  )?.formulaText;
                  const prompt = column.typeSettings?.inputBinding.find(
                    (item) => item.name === 'prompt',
                  )?.formulaText;
                  const metaprompt = column.typeSettings?.inputBinding.find(
                    (item) => item.name === 'metaprompt',
                  )?.formulaText;
                  prompt && setPrompt(prompt);
                  schema && setSchemaJson(schema);
                  metaprompt && setGenerateDescription(metaprompt);
                  setWebResearchVisible(true, ActiveTypeEnum.edit);
                  return;
                }
                //common edit column
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
                  parentValue === TableColumnMenuActionEnum.change_column_type
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
                  parentValue === TableColumnMenuActionEnum.insert_column_right
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
          scrolled={scrolled}
          virtualization={{
            enabled: true,
            rowHeight: ROW_HEIGHT,
            scrollContainer: scrollContainerRef,
            onVisibleRangeChange: onVisibleRangeChange,
          }}
        />
      )}

      <DialogWebResearch cb={onInitializeAiColumns} tableId={tableId} />
      <DialogEditDescription />
      <DialogDeleteColumn />
      <DialogCellDetails data={activeCell} />
      <CampaignProcess />
      <DialogHeaderActions />
      <DialogWorkEmail cb={onInitializeAiColumns} />
      <DialogAllIntegrations />
      <DialogEditColumn />
    </Stack>
  );
};
