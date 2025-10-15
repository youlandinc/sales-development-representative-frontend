import {
  Box,
  Drawer,
  Icon,
  Menu,
  MenuItem,
  menuItemClasses,
  Stack,
  StackProps,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DocumentType } from '@tiptap/core';
import { FC, useState } from 'react';

import { SDRToast, StyledButton } from '@/components/atoms';
import {
  SculptingPrompt,
  WebResearchConfigure,
  WebResearchGenerate,
} from '@/components/molecules';

import { useGeneratePrompt } from '@/hooks/useGeneratePrompt';

import {
  ActiveTypeEnum,
  useProspectTableStore,
  useWebResearchStore,
} from '@/stores/Prospect';

import { COINS_PER_ROW } from '@/constant';
import { useAsyncFn, useVariableFromStore } from '@/hooks';
import { columnRun, updateWebResearchConfig } from '@/request';
import { HttpError } from '@/types';
import { extractPromptText } from '@/utils';

import CloseIcon from '@mui/icons-material/Close';
import ICON_ARROW from '../assets/dialog/icon_arrow.svg';
import ICON_ARROW_DOWN from '../assets/dialog/icon_arrow_down.svg';
import ICON_COINS from '../assets/dialog/icon_coins.svg';
import ICON_SPARK from '../assets/dialog/icon_sparkle.svg';

type CostCoinsProps = StackProps & {
  count: string;
  textColor?: string;
};
export const CostCoins: FC<CostCoinsProps> = ({
  count,
  textColor,
  ...rest
}) => {
  return (
    <Stack
      alignItems={'center'}
      borderRadius={1}
      flexDirection={'row'}
      gap={0.5}
      px={1}
      py={0.5}
      {...rest}
    >
      <Icon component={ICON_COINS} sx={{ width: 16, height: 16 }} />
      <Typography color={textColor || '#866BFB'} variant={'body3'}>
        {count} / row
      </Typography>
    </Stack>
  );
};

type DialogWebResearchProps = {
  cb?: () => Promise<void>;
  tableId: string;
};

export const DialogWebResearch: FC<DialogWebResearchProps> = ({
  tableId,
  cb,
}) => {
  const { columns, rowIds, activeColumnId } = useProspectTableStore(
    (store) => store,
  );
  const [tab, setTab] = useState<'generate' | 'configure'>('generate');
  const [text, setText] = useState('');
  const [schemaStr, setSchemaStr] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    activeType,
    setPrompt,
    webResearchVisible,
    setWebResearchVisible,
    schemaJson,
    setSchemaJson,
    allClear,
    saveAiConfig,
    setGenerateDescription,
    generateEditorInstance,
    tipTapEditorInstance,
    slateEditorInstance,
  } = useWebResearchStore((state) => state);
  const { filedMapping } = useVariableFromStore();
  const { generatePrompt: generateJson } = useGeneratePrompt(
    setSchemaStr,
    (objStr) => {
      setIsLoading(false);
      setSchemaJson(objStr);
      setTimeout(() => {
        setTab('configure');
      }, 0);
    },
  );
  const { generatePrompt, isThinking } = useGeneratePrompt(
    setText,
    async (text) => {
      setPrompt(text);
      await generateJson('/sdr/ai/generate', {
        module: 'JSON_SCHEMA_WITH_PROMPT',
        params: {
          prompt: text,
        },
      });
    },
  );

  const handleClose = () => {
    setWebResearchVisible(false, activeType);
    setTab('generate');
    allClear();
    setAnchorEl(null);
  };

  const handleGenerate = async () => {
    setText('');
    setSchemaStr('');
    allClear();
    setIsLoading(true);
    // Add a small delay to ensure editor is ready
    // await new Promise((resolve) => setTimeout(resolve, 100));
    if (generateEditorInstance) {
      setGenerateDescription(generateEditorInstance.getText());
    }
    await generatePrompt('/sdr/ai/generate', {
      module: 'COLUMN_ENRICHMENT_PROMPT',
      params: {
        userInput: extractPromptText(
          (generateEditorInstance?.getJSON() || []) as DocumentType,
          filedMapping,
        ),
        columns: columns.map((item) => item.fieldName).join(','),
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
        setAnchorEl(null);
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
    ],
  );
  const [updateState, updateAiConfig] = useAsyncFn(
    async (tableId: string) => {
      try {
        setAnchorEl(null);
        await updateWebResearchConfig({
          tableId,
          fieldId: activeColumnId,
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
    ],
  );

  const [saveAndRunState, saveAndRun] = useAsyncFn(
    async (tableId: string, recordCount: number) => {
      try {
        setAnchorEl(null);
        if (activeType === ActiveTypeEnum.edit) {
          await updateWebResearchConfig({
            tableId,
            fieldId: activeColumnId,
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
        await cb?.();
        handleClose();
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
    ],
  );

  return (
    <Drawer
      anchor={'right'}
      hideBackdrop
      open={webResearchVisible}
      sx={{
        left: 'unset',
      }}
    >
      <Stack gap={4} height={'100%'} justifyContent={'space-between'}>
        {/* header */}
        <Stack alignItems={'center'} flexDirection={'row'} pt={3} px={3}>
          <Icon
            component={ICON_ARROW}
            onClick={handleClose}
            sx={{ width: 20, height: 20, mr: 3, cursor: 'pointer' }}
          />
          <Icon
            component={ICON_SPARK}
            sx={{ width: 20, height: 20, mr: 0.5 }}
          />
          <Typography>Al web researcher</Typography>
          <CloseIcon
            onClick={handleClose}
            sx={{ fontSize: 20, ml: 'auto', cursor: 'pointer' }}
          />
        </Stack>
        {/* content */}
        <Stack flex={1} maxWidth={500} px={3} width={500}>
          <Box display={isLoading ? 'block' : 'none'}>
            <SculptingPrompt
              isLoading={isThinking}
              prompt={text}
              schemaJsonStr={schemaStr}
            />
          </Box>

          <Stack display={isLoading ? 'none' : 'flex'} gap={3}>
            <Stack gap={4}>
              <ToggleButtonGroup
                color={'primary'}
                exclusive
                onChange={(e, value) => {
                  setTab(value);
                }}
                translate={'no'}
                value={tab}
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
                  Generate
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
                display={tab === 'generate' ? 'block' : 'none'}
                sx={{
                  transition: 'all .3s',
                }}
              >
                <WebResearchGenerate
                  handleGeneratePrompt={handleGenerate}
                  isLoading={isLoading}
                />
              </Box>
              <Box
                display={tab === 'configure' ? 'block' : 'none'}
                sx={{
                  transition: 'all .3s',
                }}
              >
                <WebResearchConfigure handleGenerate={handleGenerate} />
              </Box>
            </Stack>
          </Stack>
        </Stack>
        {/* footer */}
        <Stack
          alignItems={'center'}
          borderTop={' 1px solid   #D0CEDA'}
          flexDirection={'row'}
          gap={1}
          justifyContent={'flex-end'}
          px={3}
          py={1.5}
        >
          <CostCoins
            border={'1px solid #D0CEDA'}
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
                <CostCoins
                  bgcolor={'#EFE9FB'}
                  count={`~${COINS_PER_ROW * 10}`}
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
              <CostCoins bgcolor={'#EFE9FB'} count={'~20'} />
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
        </Stack>
      </Stack>
      {/* <FieldDescription /> */}
    </Drawer>
  );
};
