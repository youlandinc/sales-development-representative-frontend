import { FC, useState } from 'react';
import { Stack } from '@mui/material';

import {
  ActiveTypeEnum,
  useProspectTableStore,
  useWebResearchStore,
  useWorkEmailStore,
} from '@/stores/Prospect';

import { ROW_HEIGHT } from './data';
import { useProspectTable } from './hooks';

import { StyledTable } from '@/components/atoms';
import {
  CampaignProcess,
  DialogAllIntegrations,
  DialogCellDetails,
  DialogDeleteColumn,
  DialogEditDescription,
  DialogHeaderActions,
  DialogWebResearch,
  DialogWorkEmail,
  TableColumnMenuEnum,
} from '@/components/molecules';

import { useComputedInWorkEmailStore } from './Dialog/DialogWorkEmail/hooks';

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
    updateColumnWidth,
    updateColumnName,
    updateColumnPin,
    updateColumnVisible,
    openDialog,
    closeDialog,
    dialogVisible,
    dialogType,
    setActiveColumnId,
  } = useProspectTableStore((store) => store);

  const {
    setWebResearchVisible,
    setSchemaJson,
    setPrompt,
    setGenerateDescription,
  } = useWebResearchStore((store) => store);

  const {
    setWorkEmailVisible,
    fetchIntegrations,
    setActiveType,
    setEditConfigParams,
  } = useWorkEmailStore((store) => store);

  const { matchActionKeyToIntegration } = useComputedInWorkEmailStore();

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
  } = useProspectTable({ tableId });

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
            setWebResearchVisible(true, ActiveTypeEnum.add);
          }}
          onAiProcess={onAiProcess}
          onCellClick={(columnId, rowId, data) => {
            if (data.original?.[columnId]?.externalContent) {
              setActiveColumnId(columnId);
              setActiveCell(data.original?.[columnId]?.externalContent || {});
              !dialogVisible && openDialog(TableColumnMenuEnum.cell_detail);
              return;
            }
            dialogVisible &&
              dialogType === TableColumnMenuEnum.cell_detail &&
              closeDialog();
          }}
          onCellEdit={onCellEdit}
          onColumnResize={(fieldId, width) => updateColumnWidth(fieldId, width)}
          onHeaderMenuClick={async ({ type, columnId, value }) => {
            if (!columnId || !columns.find((col) => col.fieldId === columnId)) {
              return;
            }
            setActiveColumnId(columnId);

            switch (type) {
              case TableColumnMenuEnum.edit_column: {
                const column = columns.find((col) => col.fieldId === columnId);
                // Work Email configuration
                if (column?.groupId && fieldGroupMap) {
                  const waterfallConfig = fieldGroupMap?.[
                    column.groupId
                  ]?.waterfallConfigs?.map((i) => ({
                    actionKey: i.actionKey,
                    skipped: i.skipped,
                    inputParams: i.inputParameters.map((p) => {
                      const field = columns.find(
                        (col) => col.fieldId === p.formulaText,
                      );
                      return {
                        name: p.name,
                        selectedOption: {
                          label: field?.fieldName || '',
                          value: field?.fieldId || '',
                          key: field?.fieldId || '',
                        },
                      };
                    }),
                  }));
                  if (column.actionKey) {
                    matchActionKeyToIntegration(column.actionKey);
                    setActiveType(ActiveTypeEnum.edit);
                    setEditConfigParams({
                      groupId: column.groupId,
                      waterfallConfigs: waterfallConfig,
                    });
                    fetchIntegrations();
                    setWorkEmailVisible(true);
                  }
                }
                // AI column configuration
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
                setWebResearchVisible(true, ActiveTypeEnum.edit);

                break;
              }
              case TableColumnMenuEnum.edit_description: {
                openDialog(TableColumnMenuEnum.edit_description);
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
    </Stack>
  );
};
