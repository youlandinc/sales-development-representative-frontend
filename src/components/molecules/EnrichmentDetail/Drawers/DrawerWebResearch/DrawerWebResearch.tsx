import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DocumentType } from '@tiptap/core';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { SDRToast } from '@/components/atoms';
import { DialogFooter } from '../Common';
import {
  SculptingPrompt,
  WebResearchConfigure,
  WebResearchGenerate,
} from './index';

import { useFieldMapping } from '@/components/molecules/EnrichmentDetail/hooks';
import { useAsyncFn } from '@/hooks';
import {
  ActiveTypeEnum,
  useEnrichmentTableStore,
  useWebResearchStore,
} from '@/stores/enrichment';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';

import { columnRun } from '@/request';

import { COINS_PER_ROW } from '@/constants';
import { extractPromptText } from '@/utils';

import { HttpError, SourceOfOpenEnum } from '@/types';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

import { DrawersIconConfig } from '../DrawersIconConfig';

type DrawerWebResearchProps = {
  cb?: () => Promise<void>;
  tableId: string;
};

export const DrawerWebResearch: FC<DrawerWebResearchProps> = ({
  tableId,
  cb,
}) => {
  const { rowIds, activeColumnId, openDialog, closeDialog } =
    useEnrichmentTableStore(
      useShallow((state) => ({
        rowIds: state.rowIds,
        activeColumnId: state.activeColumnId,
        openDialog: state.openDialog,
        closeDialog: state.closeDialog,
      })),
    );

  const fetchActionsMenus = useActionsStore((state) => state.fetchActionsMenus);

  const {
    activeType,
    schemaJson,
    allClear,
    saveAiConfig,
    generateEditorInstance,
    tipTapEditorInstance,
    slateEditorInstance,
    // Generate prompt state from store
    webResearchTab,
    setWebResearchTab,
    generateText,
    generateSchemaStr,
    generateIsLoading,
    generateIsThinking,
    runGenerateAiModel,
    taskContent,
    suggestedModelContent,
    enableWebSearch,
    suggestedModelType,
    updateAiConfig,
  } = useWebResearchStore(
    useShallow((state) => ({
      activeType: state.activeType,
      schemaJson: state.schemaJson,
      enableWebSearch: state.enableWebSearch,
      allClear: state.allClear,
      saveAiConfig: state.saveAiConfig,
      updateAiConfig: state.updateAiConfig,
      setGenerateDescription: state.setGenerateDescription,
      generateEditorInstance: state.generateEditorInstance,
      tipTapEditorInstance: state.tipTapEditorInstance,
      slateEditorInstance: state.slateEditorInstance,
      // Generate prompt state from store
      webResearchTab: state.webResearchTab,
      setWebResearchTab: state.setWebResearchTab,
      generateText: state.generateText,
      taskContent: state.taskContent,
      suggestedModelContent: state.suggestedModelContent,
      generateSchemaStr: state.generateSchemaStr,
      generateIsLoading: state.generateIsLoading,
      generateIsThinking: state.generateIsThinking,
      runGeneratePrompt: state.runGeneratePrompt,
      runGenerateAiModel: state.runGenerateAiModel,
      setGenerateText: state.setGenerateText,
      setGenerateSchemaStr: state.setGenerateSchemaStr,
      suggestedModelType: state.suggestedModelType,
    })),
  );

  const { sourceOfOpen, setDialogAllEnrichmentsVisible } = useActionsStore(
    useShallow((state) => ({
      sourceOfOpen: state.sourceOfOpen,
      setDialogAllEnrichmentsVisible: state.setDialogAllEnrichmentsVisible,
    })),
  );

  const { filedMapping } = useFieldMapping();

  const onClickToClose = () => {
    setWebResearchTab('generate');
    allClear();
    closeDialog();
  };

  const onClickToBack = () => {
    if (sourceOfOpen === SourceOfOpenEnum.dialog) {
      closeDialog();
      setDialogAllEnrichmentsVisible(true);
      setWebResearchTab('generate');
      return;
    }
    setWebResearchTab('generate');
    openDialog(TableColumnMenuActionEnum.actions_overview);
  };

  const onClickToGenerate = async () => {
    await runGenerateAiModel('/aiResearch/generate/stream', {
      module: 'TASK_MODEL_CHOOSER',
      params: {
        userInput: extractPromptText(
          (generateEditorInstance?.getJSON() || []) as DocumentType,
          filedMapping,
        ),
      },
    });
  };

  const [, run] = useAsyncFn(
    async (param: {
      tableId: string;
      recordCount: number;
      fieldId?: string;
      fieldIds?: string[];
    }) => {
      try {
        await columnRun(param);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        return Promise.reject(err);
      }
    },
  );

  const [state, saveDoNotRun] = useAsyncFn(
    async (tableId: string) => {
      try {
        await saveAiConfig(
          tableId,
          extractPromptText(
            (tipTapEditorInstance?.getJSON() || []) as DocumentType,
            filedMapping,
          ) || '',
          schemaJson,
          extractPromptText(
            (generateEditorInstance?.getJSON() || []) as DocumentType,
            filedMapping,
          ) || '',
        );
        await cb?.();
        fetchActionsMenus(tableId);
        allClear();
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        return Promise.reject(err);
      }
    },
    [
      tipTapEditorInstance,
      slateEditorInstance,
      schemaJson,
      generateEditorInstance,
      tableId,
    ],
  );
  const [updateState, updateConfig] = useAsyncFn(
    async (tableId: string) => {
      try {
        await updateAiConfig({
          tableId,
          prompt:
            extractPromptText(
              (tipTapEditorInstance?.getJSON() || []) as DocumentType,
              filedMapping,
            ) || '',
          schema: schemaJson,
          generatePrompt:
            extractPromptText(
              (generateEditorInstance?.getJSON() || []) as DocumentType,
              filedMapping,
            ) || '',
        });

        fetchActionsMenus(tableId);
        await cb?.();
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        return Promise.reject(err);
      }
    },
    [
      tipTapEditorInstance,
      slateEditorInstance,
      schemaJson,
      generateEditorInstance,
      activeColumnId,
      enableWebSearch,
      suggestedModelType,
      tableId,
    ],
  );

  const [saveAndRunState, saveAndRun] = useAsyncFn(
    async (tableId: string, recordCount: number) => {
      try {
        if (activeType === ActiveTypeEnum.edit) {
          await updateConfig(tableId);
          await run({ tableId, recordCount, fieldId: activeColumnId });
        }
        if (activeType === ActiveTypeEnum.add) {
          const res = await saveAiConfig(
            tableId,
            extractPromptText(
              (tipTapEditorInstance?.getJSON() || []) as DocumentType,
              filedMapping,
            ) || '',
            schemaJson,
            extractPromptText(
              (generateEditorInstance?.getJSON() || []) as DocumentType,
              filedMapping,
            ) || '',
          );
          await run({ tableId, fieldId: res.data, recordCount });
        }
        onClickToClose();
        allClear();
        await cb?.();
        fetchActionsMenus(tableId);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        return Promise.reject(err);
      }
    },
    [
      tipTapEditorInstance,
      slateEditorInstance,
      cb,
      schemaJson,
      generateEditorInstance,
      activeType,
      activeColumnId,
      enableWebSearch,
      suggestedModelType,
      tableId,
    ],
  );

  return (
    <Stack gap={4} height={'100%'} justifyContent={'space-between'}>
      {/* header */}
      <Stack alignItems={'center'} flexDirection={'row'} pt={3} px={3}>
        <DrawersIconConfig.Arrow
          onClick={onClickToBack}
          size={20}
          sx={{ mr: 3, cursor: 'pointer' }}
        />
        <DrawersIconConfig.SparkleFill size={20} sx={{ mr: 0.5 }} />
        <Typography fontWeight={600}>Atlas Intelligence Agent</Typography>
        <DrawersIconConfig.Close
          onClick={onClickToClose}
          size={20}
          sx={{ ml: 'auto', cursor: 'pointer' }}
        />
      </Stack>
      {/* content */}
      <Stack
        flex={1}
        maxWidth={500}
        minHeight={0}
        overflow={'auto'}
        px={3}
        width={500}
      >
        <Box display={generateIsThinking ? 'block' : 'none'}>
          <SculptingPrompt
            isLoading={generateIsLoading}
            prompt={generateText}
            schemaJsonStr={generateSchemaStr}
            suggestedModelContent={suggestedModelContent}
            taskContent={taskContent}
          />
        </Box>

        <Stack display={generateIsThinking ? 'none' : 'flex'} gap={3}>
          <Stack gap={3}>
            <ToggleButtonGroup
              color={'primary'}
              exclusive
              onChange={(_, value) => {
                if (value) {
                  setWebResearchTab(value);
                }
              }}
              translate={'no'}
              value={webResearchTab}
            >
              <ToggleButton
                fullWidth
                sx={{
                  fontSize: 14,
                  textTransform: 'none',
                  lineHeight: 1.2,
                  py: 1,
                  fontWeight: 600,
                  borderRadius: '8px 0 0 8px',
                }}
                value={'generate'}
              >
                Overview
              </ToggleButton>
              <ToggleButton
                fullWidth
                sx={{
                  fontSize: 14,
                  textTransform: 'none',
                  lineHeight: 1.2,
                  py: 1,
                  fontWeight: 600,
                  borderRadius: '0 8px 8px 0',
                }}
                value={'configure'}
              >
                Configure
              </ToggleButton>
            </ToggleButtonGroup>

            <Box
              display={webResearchTab === 'generate' ? 'block' : 'none'}
              sx={{
                transition: 'all .3s',
              }}
            >
              <WebResearchGenerate
                isLoading={generateIsLoading}
                onClickToGeneratePrompt={onClickToGenerate}
              />
            </Box>
            <Box
              display={webResearchTab === 'configure' ? 'block' : 'none'}
              sx={{
                transition: 'all .3s',
              }}
            >
              <WebResearchConfigure />
            </Box>
          </Stack>
        </Stack>
      </Stack>
      {/* footer */}
      <DialogFooter
        coinsPerRow={COINS_PER_ROW}
        disabled={generateIsThinking}
        loading={
          state.loading || saveAndRunState.loading || updateState.loading
        }
        onClickToSaveAndRun10={() => {
          saveAndRun(tableId, 10);
        }}
        onClickToSaveAndRunAll={() => {
          saveAndRun(tableId, rowIds.length);
        }}
        onClickToSaveDoNotRun={async () => {
          try {
            if (activeType === ActiveTypeEnum.add) {
              await saveDoNotRun(tableId);
            }
            if (activeType === ActiveTypeEnum.edit) {
              await updateConfig(tableId);
            }
            await cb?.();
            onClickToClose();
          } catch (err) {
            const { header, message, variant } = err as HttpError;
            SDRToast({ message, header, variant });
          }
        }}
      />
    </Stack>
  );
};
