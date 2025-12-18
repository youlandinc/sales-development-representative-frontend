import {
  Box,
  Icon,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DocumentType } from '@tiptap/core';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { SDRToast } from '@/components/atoms';
import {
  SculptingPrompt,
  WebResearchConfigure,
  WebResearchGenerate,
} from './index';

import {
  ActiveTypeEnum,
  useProspectTableStore,
  useWebResearchStore,
} from '@/stores/enrichment';

import { COINS_PER_ROW } from '@/constants';
import { useAsyncFn, useVariableFromStore } from '@/hooks';
import { _updateWebResearchConfig, columnRun } from '@/request';
import { HttpError } from '@/types';
import { extractPromptText } from '@/utils';

import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

import ICON_ARROW from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_arrow.svg';
import ICON_SPARK_BLACK from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle_fill.svg';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';
import CloseIcon from '@mui/icons-material/Close';
import { DialogFooter } from '../Common';

type DialogWebResearchProps = {
  cb?: () => Promise<void>;
  tableId: string;
};

export const DialogWebResearch: FC<DialogWebResearchProps> = ({
  tableId,
  cb,
}) => {
  const { rowIds, activeColumnId, openDialog, closeDialog } =
    useProspectTableStore(
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

  const { filedMapping } = useVariableFromStore();

  const onClickToClose = () => {
    setWebResearchTab('generate');
    allClear();
    closeDialog();
  };

  const onClickToBack = () => {
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
          fetchActionsMenus(tableId);
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
        <Icon
          component={ICON_ARROW}
          onClick={onClickToBack}
          sx={{ width: 20, height: 20, mr: 3, cursor: 'pointer' }}
        />
        <Icon
          component={ICON_SPARK_BLACK}
          sx={{ width: 20, height: 20, mr: 0.5 }}
        />
        <Typography fontWeight={600}>Atlas Intelligence Agent</Typography>
        <CloseIcon
          onClick={onClickToClose}
          sx={{ fontSize: 20, ml: 'auto', cursor: 'pointer' }}
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
          <Stack gap={4}>
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
      {/*    <Stack
        alignItems={'center'}
        borderTop={' 1px solid   #D0CEDA'}
        flexDirection={'row'}
        gap={1}
        justifyContent={'flex-end'}
        px={3}
        py={1.5}
      >
        <StyledCost
          border={'1px solid #F4F5F9'}
          borderRadius={2}
          count={`${COINS_PER_ROW}`}
          textColor={'text.secondary'}
        />
        <StyledButton
          endIcon={
            <Icon
              component={ICON_ARROW_DOWN}
              sx={{ width: 12, height: 12, '& path': { fill: '#fff' } }}
            />
          }
          loading={
            state.loading || saveAndRunState.loading || updateState.loading
          }
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
          size={'medium'}
          sx={{ height: '40px !important', width: 80 }}
          variant={'contained'}
        >
          Save
        </StyledButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          onClose={() => {
            setAnchorEl(null);
          }}
          open={Boolean(anchorEl)}
          slotProps={{
            list: {
              sx: {
                p: 0,
                width: 400,
                [`& .${menuItemClasses.root}`]: {
                  justifyContent: 'space-between',
                },
              },
            },
          }}
        >
          {rowIds.length > 10 && (
            <MenuItem
              onClick={() => {
                saveAndRun(tableId, 10);
              }}
            >
              <Typography color={'text.secondary'} variant={'body2'}>
                Save and run 10 rows
              </Typography>
              <StyledCost
                border={'1px solid #D0CEDA'}
                count={`~${COINS_PER_ROW * 10}`}
                textColor={'text.secondary'}
              />
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              saveAndRun(tableId, rowIds.length);
            }}
          >
            <Typography color={'text.secondary'} variant={'body2'}>
              Save and run {rowIds.length} rows in this view
            </Typography>
            <StyledCost
              border={'1px solid #D0CEDA'}
              count={'~20'}
              textColor={'text.secondary'}
            />
          </MenuItem>
          <MenuItem
            onClick={async () => {
              try {
                if (activeType === ActiveTypeEnum.add) {
                  await saveDoNotRun(tableId);
                }
                if (activeType === ActiveTypeEnum.edit) {
                  await updateAiConfig(tableId);
                }
                await cb?.();
                handleClose();
              } catch (err) {
                const { header, message, variant } = err as HttpError;
                SDRToast({ message, header, variant });
              }
            }}
          >
            <Typography color={'text.secondary'} variant={'body2'}>
              Save and don&#39;t run
            </Typography>
          </MenuItem>
        </Menu>
      </Stack> */}
    </Stack>
  );
};
