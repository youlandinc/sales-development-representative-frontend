import {
  Box,
  FormControlLabel,
  Icon,
  Menu,
  MenuItem,
  menuItemClasses,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import {
  StyledButton,
  StyledSelect,
  StyledTextField,
} from '@/components/atoms';
import {
  CollapseCard,
  SlateEditor,
  TiptapEditor,
} from '@/components/molecules';
import { MoreHoriz } from '@mui/icons-material';
import ICON_SPARKLE from './assets/icon_sparkle.svg';
import ICON_TEXT from './assets/icon_text.svg';
import ICON_WARNING from './assets/icon_warning.svg';
import { useWebResearchStore } from '@/stores/Prospect';
import { useGeneratePrompt } from '@/hooks/useGeneratePrompt';
// import { useCompletion } from '@ai-sdk/react';
import ICON_DELETE from './assets/icon_delete.svg';
import { insertWithPlaceholders, schemaToSlate } from '@/utils';
import { Editor } from '@tiptap/core';

const initialValue = {
  type: 'object',
  properties: {
    CEO: {
      type: 'string',
      description: "Full name of the CEO or 'No CEO or LinkedIn profile found'",
    },
    LinkedIn_Profile: {
      type: 'string',
      description:
        "LinkedIn profile URL of the CEO or 'No CEO or LinkedIn profile found'",
    },
  },
  required: ['CEO', 'LinkedIn_Profile'],
};

type WebResearchConfigureProps = {
  handleGenerate?: () => void;
  onPromptEditorReady?: (editor: any) => void;
  onSchemaEditorReady?: (editor: any) => void;
};

export const WebResearchConfigure: FC<WebResearchConfigureProps> = ({
  handleGenerate,
  onPromptEditorReady,
  onSchemaEditorReady,
}) => {
  const { prompt, schemaJson, setSchemaJson } = useWebResearchStore(
    (state) => state,
  );
  const [outPuts, setOutPuts] = useState<'fields' | 'json'>('fields');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const promptEditorRef = useRef<null | Editor>(null);
  const schemaEditorRef = useRef(null);

  const { generatePrompt: generateJson, isLoading } = useGeneratePrompt(
    undefined,
    (objStr) => {
      setSchemaJson(JSON.parse(objStr));
    },
  );

  /*const DEFAULT_PROMOT =
    '#CONTEXT#\nYou are tasked with finding a Java engineer associated with a given company or website, and extracting their professional profile and email address.\n\n#OBJECTIVE#\nIdentify a Java engineer related to {{Enrich Company}}, {{Domain}}, or {{Url}}, and extract their professional profile link (such as LinkedIn) and email address.\n\n#INSTRUCTIONS#\n1. Use the provided {{Enrich Company}}, {{Domain}}, or {{Url}} to search for employees or team members who are Java engineers (titles may include "Java Engineer," "Java Developer," or similar).\n2. Search LinkedIn, company team pages, or other professional directories for profiles matching the criteria.\n3. Extract the profile URL (preferably LinkedIn) and the email address if publicly available.\n4. If multiple Java engineers are found, return the first relevant result.\n5. If no Java engineer or email is found, return "No Java engineer found" or "No email found" as appropriate.\n\n#EXAMPLES#\nInput:\n  Enrich Company: Acme Corp\n  Domain: acmecorp.com\n  Url: https://acmecorp.com\n\nExpected Output:\n  Java Engineer Name: John Doe\n';*/
  const defaultValue = prompt ? insertWithPlaceholders(prompt) : null;

  useEffect(() => {
    if (promptEditorRef.current) {
      onPromptEditorReady?.(promptEditorRef.current);
    }
    if (schemaEditorRef.current) {
      onSchemaEditorReady?.(schemaEditorRef.current);
    }
  }, [promptEditorRef.current, schemaEditorRef.current]);

  // const {
  //   data: s,
  //   completion: a,
  //   isLoading: i,
  //   complete: r,
  // } = useCompletion({
  //   api: '/sdr/ai/generate',
  //   credentials: 'include',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: {
  //     module: 'COLUMN_ENRICHMENT_PROMPT',
  //     params: {
  //       useInput: "help me to find user's email and phone number",
  //       columns:
  //         'First Name,Last Name,Full Name,Job Title, Location,Company Name,LinkedIn Profile,University',
  //     },
  //   },
  //   // onError: (l) => n(l),
  //   // onFinish: (l, c) => t(l, c),
  //   streamProtocol: 'data',
  // });

  return (
    <Stack gap={4}>
      {/*<Typography>{text}</Typography>*/}
      <Stack gap={0.5}>
        <Typography fontWeight={700} variant={'subtitle1'}>
          Prompt
        </Typography>
        <TiptapEditor
          defaultValue={defaultValue}
          handleGenerate={handleGenerate}
          minHeight={200}
          placeholder={
            'E.g., Find the CEO of the company and their Linkedin profile'
          }
          ref={promptEditorRef}
        />
      </Stack>
      {/*outputs*/}
      <CollapseCard title={'Define outputs'}>
        <Stack gap={1.5}>
          <RadioGroup
            onChange={(e) => {
              setOutPuts((e.target as HTMLInputElement).value as any);
            }}
            value={outPuts}
          >
            <FormControlLabel
              control={<Radio />}
              label={'Fields'}
              value={'fields'}
            />
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <FormControlLabel
                control={<Radio />}
                label={'JSON Schema'}
                value={'json'}
              />
              <StyledButton
                color={'info'}
                loading={isLoading}
                onClick={() =>
                  generateJson('/sdr/ai/generate', {
                    module: 'JSON_SCHEMA_WITH_PROMPT',
                    params: {
                      prompt: promptEditorRef.current?.getText() || '',
                    },
                  })
                }
                size={'small'}
                sx={{
                  width: '177px !important',
                }}
                variant={'outlined'}
              >
                <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
                  <Icon
                    component={ICON_SPARKLE}
                    sx={{ width: 18, height: 18 }}
                  />
                  <Typography fontWeight={600} variant={'body3'}>
                    Generate from prompt
                  </Typography>
                </Stack>
              </StyledButton>
            </Stack>
          </RadioGroup>
          <Stack display={outPuts === 'fields' ? 'flex' : 'none'} gap={1.5}>
            {Object.keys(schemaJson?.properties || {}).map((item, index) => (
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                gap={1.5}
                key={index}
              >
                <StyledTextField value={item as string} />
                <StyledSelect
                  options={[
                    {
                      label: 'Text',
                      value: 'text',
                      key: 'text',
                    },
                  ]}
                  placeholder={'Text'}
                  startAdornment={
                    <Icon
                      component={ICON_TEXT}
                      sx={{ width: 12, height: 12 }}
                    />
                  }
                  value={'text'}
                />
                <MoreHoriz
                  onClick={(e) => {
                    setAnchorEl((e as any).currentTarget);
                  }}
                  sx={{
                    fontSize: 20,
                    color: 'text.primary',
                    cursor: 'pointer',
                  }}
                />
              </Stack>
            ))}
            <StyledButton
              color={'info'}
              onClick={() => {
                const key = Math.random();
                setSchemaJson({
                  type: 'object',
                  properties: {
                    ...schemaJson.properties,
                    [`field${key}`]: {
                      type: 'string',
                    },
                  },
                  required: [...schemaJson.required, `field${key}`],
                });
              }}
              size={'medium'}
              sx={{
                color: '#6F6C7D !important',
                borderColor: '#E5E5E5 !important',
                fontWeight: 400,
              }}
              variant={'outlined'}
            >
              + Add output
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
                    p: 1.5,
                    width: 240,
                    [`& .${menuItemClasses.root}`]: {
                      gap: 1,
                      '&:hover': {
                        bgcolor: 'unset !important',
                        cursor: 'unset',
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem>
                <Stack gap={1.25} width={200}>
                  <Typography variant={'body3'}>
                    Output description (helps Al)
                  </Typography>
                  <StyledTextField
                    maxRows={3}
                    minRows={3}
                    multiline
                    sx={{
                      '& .MuiOutlinedInput-input': {
                        fontSize: 12,
                      },
                    }}
                  />

                  <Box bgcolor={'#D0CEDA'} height={'1px'}></Box>
                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    gap={1}
                    onClick={() => {}}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Icon
                      component={ICON_DELETE}
                      sx={{ width: 20, height: 20 }}
                    />
                    <Typography color={'#D75B5B'} variant={'body2'}>
                      Delete
                    </Typography>
                  </Stack>
                </Stack>
              </MenuItem>
            </Menu>
          </Stack>
          <Box display={outPuts === 'json' ? 'block' : 'none'}>
            <SlateEditor
              initialValue={schemaToSlate(
                schemaJson || {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'string',
                    },
                  },
                  required: ['response'],
                },
              )}
              ref={schemaEditorRef}
            />
          </Box>
        </Stack>
      </CollapseCard>
      {/*Run settings*/}
      <CollapseCard title={'Run settings'}>
        <Stack gap={1.5}>
          <Stack flexDirection={'row'} justifyContent={'space-between'}>
            <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
              <Typography variant={'subtitle1'}>Auto-update</Typography>
              <Tooltip
                title={
                  'Disable or enable automatic runs of this column on table updates.'
                }
              >
                <Icon component={ICON_WARNING} sx={{ width: 12, height: 12 }} />
              </Tooltip>
            </Stack>
            <Switch checked={true} />
          </Stack>
          {/*<Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>*/}
          {/*  <Typography variant={'subtitle1'}>Only run if</Typography>*/}
          {/*  <Tooltip title={'Only run if this formula resolves to true.'}>*/}
          {/*    <Icon component={ICON_WARNING} sx={{ width: 12, height: 12 }} />*/}
          {/*  </Tooltip>*/}
          {/*</Stack>*/}
          {/*<SlateEditor initialValue={{}} style={{ padding: '4px' }} />*/}
        </Stack>
      </CollapseCard>
    </Stack>
  );
};
