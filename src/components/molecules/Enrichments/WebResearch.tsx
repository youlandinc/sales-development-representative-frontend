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
import { Editor } from '@tiptap/core';
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
  const { headers } = useProspectTableStore((store) => store);
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
      setSchemaJson(JSON.parse(objStr));
      setIsLoading(false);
      setTimeout(() => {
        setTab('configure');
      }, 1000);
    },
  );
  const { generatePrompt, isThinking } = useGeneratePrompt(
    setText,
    async (text) => {
      setPrompt(text);
      await generateJson('/sdr/ai/generate', {
        module: 'JSON_SCHEMA_WITH_PROMPT',
        params: {
          prompt,
        },
      });
    },
  );

  const handleClose = () => {
    setOpen(false);
    setTab('generate');
    allClear();
  };

  const handleGenerate = async () => {
    setText('');
    setSchemaStr('');
    allClear();
    setIsLoading(true);
    if (generateEditor) {
      setGenerateDescription(generateEditor.getText());
    }
    await generatePrompt('/sdr/ai/generate', {
      module: 'COLUMN_ENRICHMENT_PROMPT',
      params: {
        useInput: generateEditor?.getText() || '',
        columns: headers.map((item) => item.fieldName).join(','),
      },
    });
  };

  const [state, run] = useAsyncFn(
    async (fieldId: string, recordCount: number) => {
      try {
        await columnRun(fieldId, 0);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
  );

  return (
    <Drawer anchor={'right'} open={open}>
      <Stack gap={3} height={'100%'} justifyContent={'space-between'}>
        <Stack maxWidth={500} p={'24px 24px 0px 24px'} width={500}>
          {isLoading ? (
            <SculptingPrompt
              isLoading={isThinking}
              prompt={text}
              schemaJsonStr={schemaStr}
            />
          ) : (
            <Stack gap={3}>
              <Stack alignItems={'center'} flexDirection={'row'}>
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
                  />
                </Box>
              </Stack>
            </Stack>
          )}
        </Stack>
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
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
            }}
            size={'medium'}
            sx={{ height: '40px !important' }}
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
            <MenuItem>
              <Typography color={'text.secondary'} variant={'body2'}>
                Save and run 10 rows
              </Typography>
              <CostCoins bgcolor={'#EFE9FB'} count={`~${COINS_PER_ROW * 10}`} />
            </MenuItem>
            <MenuItem>
              <Typography color={'text.secondary'} variant={'body2'}>
                Save and run total rows in this view
              </Typography>
              <CostCoins bgcolor={'#EFE9FB'} count={'~20'} />
            </MenuItem>
            <MenuItem
              onClick={async () => {
                await saveAiConfig(
                  tableId,
                  promptEditor?.getText() || '',
                  schemaEditor?.children
                    ?.map((n) => Node.string(n))
                    .join('\n') || '',
                );
                await cb?.();
                setOpen(false);
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
