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
import { DocumentType, Editor } from '@tiptap/core';
import { FC, useState } from 'react';
import { ReactEditor } from 'slate-react/dist/plugin/react-editor';
import { Node } from 'slate';

import { SDRToast, StyledButton } from '@/components/atoms';
import {
  SculptingPrompt,
  WebResearchConfigure,
  WebResearchGenerate,
} from '@/components/molecules';

import { useGeneratePrompt } from '@/hooks/useGeneratePrompt';

import { useProspectTableStore, useWebResearchStore } from '@/stores/Prospect';

import ICON_SPARK from './assets/icon_sparkle.svg';
import ICON_ARROW from './assets/icon_arrow.svg';
import CloseIcon from '@mui/icons-material/Close';
import ICON_COINS from './assets/icon_coins.svg';
import ICON_ARROW_DOWN from './assets/icon_arrow_down.svg';
import { COINS_PER_ROW } from '@/constant';
import { useAsyncFn } from '@/hooks';
import { columnRun } from '@/request';
import { HttpError } from '@/types';
import { extractPromptText } from '@/utils';

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

type WebResearchProps = {
  cb?: () => Promise<void>;
  tableId: string;
};

export const WebResearch: FC<WebResearchProps> = ({ tableId, cb }) => {
  const { headers, rowIds } = useProspectTableStore((store) => store);
  const [tab, setTab] = useState<'generate' | 'configure'>('generate');
  const [text, setText] = useState('');
  const [schemaStr, setSchemaStr] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [promptEditor, setPromptEditor] = useState<null | Editor>(null);
  const [generateEditor, setGenerateEditor] = useState<null | Editor>(null);
  const [schemaEditor, setSchemaEditor] = useState<ReactEditor | null>(null);
  const {
    setPrompt,
    open,
    setOpen,
    setSchemaJson,
    allClear,
    prompt,
    saveAiConfig,
    setGenerateDescription,
  } = useWebResearchStore((state) => state);
  const { generatePrompt: generateJson } = useGeneratePrompt(
    setSchemaStr,
    (objStr) => {
      setIsLoading(false);
      setSchemaJson(JSON.parse(objStr));
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
    setOpen(false);
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
    if (generateEditor) {
      setGenerateDescription(generateEditor.getText());
    }
    await generatePrompt('/sdr/ai/generate', {
      module: 'COLUMN_ENRICHMENT_PROMPT',
      params: {
        userInput: extractPromptText(
          (generateEditor?.getJSON() || []) as DocumentType,
          headers.reduce(
            (pre, cur) => {
              pre[cur.fieldName] = cur.fieldId;
              return pre;
            },
            {} as Record<string, string>,
          ),
        ),
        columns: headers.map((item) => item.fieldName).join(','),
      },
    });
  };

  const [, run] = useAsyncFn(async (fieldId: string, recordCount: number) => {
    try {
      await columnRun(fieldId, recordCount);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
      return Promise.reject(err);
    }
  });

  const [state, saveDonotRun] = useAsyncFn(
    async (tableId: string) => {
      try {
        setAnchorEl(null);
        await saveAiConfig(
          tableId,
          promptEditor?.getText() || '',
          schemaEditor?.children?.map((n) => Node.string(n)).join('\n') || '',
        );
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        return Promise.reject(err);
      }
    },
    [promptEditor, schemaEditor],
  );

  const [saveAndRunState, saveAndRun] = useAsyncFn(
    async (tableId: string, recordCount: number) => {
      try {
        setAnchorEl(null);
        const res = await saveAiConfig(
          tableId,
          promptEditor?.getText() || '',
          schemaEditor?.children?.map((n) => Node.string(n)).join('\n') || '',
        );
        await cb?.();
        handleClose();
        run(res.data, recordCount);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        return Promise.reject(err);
      }
    },
    [promptEditor, schemaEditor, cb],
  );

  return (
    <Drawer anchor={'right'} open={open}>
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
                  onPromptEditorReady={setGenerateEditor}
                />
              </Box>
              <Box
                display={tab === 'configure' ? 'block' : 'none'}
                sx={{
                  transition: 'all .3s',
                }}
              >
                <WebResearchConfigure
                  handleGenerate={handleGenerate}
                  onPromptEditorReady={setPromptEditor}
                  onSchemaEditorReady={setSchemaEditor}
                />
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
            loading={state.loading || saveAndRunState.loading}
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
            <MenuItem onClick={() => saveAndRun(tableId, 10)}>
              <Typography color={'text.secondary'} variant={'body2'}>
                Save and run 10 rows
              </Typography>
              <CostCoins bgcolor={'#EFE9FB'} count={`~${COINS_PER_ROW * 10}`} />
            </MenuItem>
            <MenuItem onClick={() => saveAndRun(tableId, rowIds.length)}>
              <Typography color={'text.secondary'} variant={'body2'}>
                Save and run {rowIds.length} rows in this view
              </Typography>
              <CostCoins bgcolor={'#EFE9FB'} count={'~20'} />
            </MenuItem>
            <MenuItem
              onClick={async () => {
                try {
                  await saveDonotRun(tableId);
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
    </Drawer>
  );
};
