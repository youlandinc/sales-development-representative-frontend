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
import { Editor } from '@tiptap/core';
import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { createEditor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { v4 as uuidv4 } from 'uuid';

import { StyledButton, StyledTextField } from '@/components/atoms';
import {
  CollapseCard,
  OutputsFields,
  SlateEditor,
  TiptapEditor,
} from '@/components/molecules';
import { useVariableFromStore } from '@/hooks';
import { useGeneratePrompt } from '@/hooks/useGeneratePrompt';
import { useWebResearchStore } from '@/stores/Prospect';

import { extractPromptText, insertWithPlaceholders } from '@/utils';

import ICON_SPARKLE from './assets/icon_sparkle.svg';
import ICON_WARNING from './assets/icon_warning.svg';
// import { useCompletion } from '@ai-sdk/react';
import ICON_DELETE from './assets/icon_delete.svg';

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
  const {
    prompt,
    schemaJson,
    setSchemaJson,
    setTipTapEditorInstance,
    setSlateEditorInstance,
  } = useWebResearchStore((state) => state);
  const { filedMapping } = useVariableFromStore();

  const [outPuts, setOutPuts] = useState<'fields' | 'json'>('fields');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [schemaJsonStr, setSchemaJsonStr] = useState('');

  const promptEditorRef = useRef<null | Editor>(null);
  const schemaEditorRef = useRef(null);
  const editor = useMemo(() => withReact(createEditor()), []);

  const { generatePrompt: generateJson, isLoading } = useGeneratePrompt(
    undefined,
    (objStr) => {
      setSchemaJson(objStr);
      setOutPuts('fields');
    },
  );

  /*const DEFAULT_PROMOT =
    '#CONTEXT#\nYou are tasked with finding a Java engineer associated with a given company or website, and extracting their professional profile and email address.\n\n#OBJECTIVE#\nIdentify a Java engineer related to {{Enrich Company}}, {{Domain}}, or {{Url}}, and extract their professional profile link (such as LinkedIn) and email address.\n\n#INSTRUCTIONS#\n1. Use the provided {{Enrich Company}}, {{Domain}}, or {{Url}} to search for employees or team members who are Java engineers (titles may include "Java Engineer," "Java Developer," or similar).\n2. Search LinkedIn, company team pages, or other professional directories for profiles matching the criteria.\n3. Extract the profile URL (preferably LinkedIn) and the email address if publicly available.\n4. If multiple Java engineers are found, return the first relevant result.\n5. If no Java engineer or email is found, return "No Java engineer found" or "No email found" as appropriate.\n\n#EXAMPLES#\nInput:\n  Enrich Company: Acme Corp\n  Domain: acmecorp.com\n  Url: https://acmecorp.com\n\nExpected Output:\n  Java Engineer Name: John Doe\n';*/
  const defaultValue = prompt
    ? insertWithPlaceholders(prompt, filedMapping)
    : null;

  const handleEditorReady = useCallback((editor: Editor) => {
    if (editor) {
      setTipTapEditorInstance(editor);
      onPromptEditorReady?.(editor);
    }
  }, []);

  const handleSchemaEditorReady = useCallback((editor: ReactEditor) => {
    if (editor) {
      setSlateEditorInstance(editor);
      onSchemaEditorReady?.(editor);
    }
  }, []);

  const transformToObject = useCallback((str: string) => {
    try {
      if (typeof JSON.parse(str) === 'string') {
        return transformToObject(JSON.parse(str));
      }
      return JSON.parse(str);
    } catch {
      return;
    }
  }, []);

  const fieldsMapping: Record<string, any> = useMemo(() => {
    try {
      if (
        schemaJson?.trim() !== '' &&
        typeof transformToObject(schemaJson) === 'object'
      ) {
        return transformToObject(schemaJson).properties;
      }
      return transformToObject(schemaJson)?.properties || {};
    } catch {
      return {};
    }
  }, [schemaJson, transformToObject]);

  /*   const s = ['reasoning', 'evidence', 'confidence', 'didFindData'];

  const r = useMemo(
    () =>
      s && (s == null ? void 0 : s.length) > 0
        ? Object.fromEntries(
            Object.entries(fieldsMapping).filter(
              ([d, u]) => !(s != null && s.includes(d)),
            ),
          )
        : fieldsMapping,
    [fieldsMapping, s],
  );

  console.log(r); */

  //   const a = useMemo(
  //   () =>
  //     t.fields
  //       ? typeof t.fields == 'string'
  //         ? JSON.parse(t.fields)
  //         : t.fields
  //       : {},
  //   [t],
  // ); */

  /*{
    "type": "string",
    "description": "",
    "id": "f02d31d1-1f1f-48f5-8c08-abda862ce722",
    "options": ""
} */

  // const a = useMemo(() => {}, [schemaJson]);

  const i = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(fieldsMapping).map(
          ([d, { type, description, options, id }]) => [
            d,
            {
              type: type || '',
              description: description || '',
              id: id ?? uuidv4(),
              options: options || [],
            },
          ],
        ),
      ),
    [fieldsMapping],
  );

  const updateSchema = useCallback(
    (d: string, u: string, m: string, g: string, h: string) => {
      const f = Object.fromEntries(
        Object.entries(i).map(([x, y]) => {
          if (x === d) {
            let b = u;
            if (u !== d) {
              const A = Object.keys(i);
              let S = 1;
              for (; A.includes(b); ) {
                b = `${u}-${S}`;
                S++;
              }
            }
            const w = i[x];
            return [b, { ...w, description: m, options: h, type: g }];
          }
          return [x, y];
        }),
      );
      console.log(JSON.stringify(f));
      // n((x) => ({
      //   ...x,
      //   answerSchemaType: {
      //     ...x.answerSchemaType,
      //     fields: JSON.stringify(f),
      //   },
      // }));
    },
    [i],
  );

  return (
    <Stack gap={4}>
      <Stack gap={0.5}>
        <Typography fontWeight={700} variant={'subtitle1'}>
          Prompt
        </Typography>
        <TiptapEditor
          defaultValue={defaultValue}
          handleGenerate={handleGenerate}
          minHeight={200}
          onEditorReady={handleEditorReady}
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
              try {
                schemaJsonStr && JSON.parse(schemaJsonStr);
                setOutPuts((e.target as HTMLInputElement).value as any);
                if (schemaJsonStr.trim() !== '') {
                  setSchemaJson(schemaJsonStr);
                }
              } catch {
                return false;
              }
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
                      prompt: extractPromptText(
                        (promptEditorRef?.current?.getJSON() || []) as any,
                        filedMapping,
                      ),
                    },
                  })
                }
                size={'small'}
                sx={{
                  width: '177px !important',
                  borderColor: '#D0CEDA !important',
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
          {outPuts === 'fields' && (
            <Stack gap={1.5}>
              {Object.entries(fieldsMapping).map(([item, config]) => (
                <OutputsFields
                  fieldDescription={''}
                  fieldName={item}
                  fieldType={'text'}
                  key={item}
                  removeField={() => {}}
                  saveField={(
                    fieldName: string,
                    newName: string,
                    newDescription: string,
                    newType: string,
                    newSelectOptions: any,
                  ) => {
                    updateSchema(
                      fieldName,
                      newName,
                      newDescription,
                      newType,
                      newSelectOptions,
                    );
                  }}
                  selectOptions={[
                    {
                      label: 'Text',
                      value: 'text',
                      key: 'text',
                    },
                  ]}
                />
              ))}
              <StyledButton
                color={'info'}
                // onClick={() => {
                //   setIndex(index + 1);
                //   setSchemaJson({
                //     type: 'object',
                //     properties: {
                //       ...schemaJson.properties,
                //       [`field${index}`]: {
                //         type: 'string',
                //       },
                //     },
                //     required: [...schemaJson.required, `field${index}`],
                //   });
                // }}
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
          )}
          {/* <Box display={outPuts === 'json' ? 'block' : 'none'}> */}
          {!isLoading && outPuts === 'json' && (
            <SlateEditor
              editor={editor}
              initialValue={schemaJson}
              onEditorReady={handleSchemaEditorReady}
              onValueChange={setSchemaJsonStr}
              ref={schemaEditorRef}
            />
          )}
          {/* </Box> */}
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
