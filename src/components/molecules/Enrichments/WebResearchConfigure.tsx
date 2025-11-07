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

import {
  StyledButton,
  StyledSwitch,
  StyledTextField,
} from '@/components/atoms';
import {
  CollapseCard,
  FormulaEditor,
  OutputsFields,
  PromptEditor,
} from '@/components/molecules';
import { useSwitch, useVariableFromStore } from '@/hooks';
import { useGeneratePrompt } from '@/hooks/useGeneratePrompt';
import { useWebResearchStore } from '@/stores/Prospect';

import { extractPromptText, insertWithPlaceholders } from '@/utils';

import ICON_SPARKLE from './assets/icon_sparkle.svg';
import ICON_WARNING from './assets/icon_warning.svg';
// import { useCompletion } from '@ai-sdk/react';
import ICON_DELETE from './assets/icon_delete.svg';
import { TableColumnTypeEnum } from '@/types/Prospect/table';

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
  const { visible, toggle } = useSwitch(true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSchemaEditorReady = useCallback((editor: ReactEditor) => {
    if (editor) {
      setSlateEditorInstance(editor);
      onSchemaEditorReady?.(editor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const schemaFields: Record<string, any> = useMemo(() => {
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

  const fieldsMapping = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(schemaFields).map(
          ([d, { type, description, options, id, ...rest }]) => [
            d,
            {
              type: type || '',
              description: description || '',
              id: id ?? uuidv4(),
              options: options || [],
              ...rest,
            },
          ],
        ),
      ),
    [schemaFields],
  );

  const updateSchema = useCallback((result: Record<string, any>) => {
    //todo update fields
    const schemaObj = {
      type: 'object',
      properties: Object.fromEntries(
        Object.entries(result).map(([key, value]) => [
          key,
          { type: value.type, description: value.description },
        ]),
      ),
      required: Object.keys(result),
    };
    setSchemaJson(JSON.stringify(schemaObj, null, 2));
  }, []);

  const handleFieldChange = useCallback(
    (
      fieldName: string,
      newName: string,
      newDescription: string,
      newType: string,
      newSelectOptions: string,
    ) => {
      const fieldsObj = Object.fromEntries(
        Object.entries(fieldsMapping).map(([key, config]) => {
          if (key === fieldName) {
            let newKey = newName;
            if (newName !== fieldName) {
              const allKeys = Object.keys(fieldsMapping);
              let S = 1;
              for (; allKeys.includes(newKey); ) {
                newKey = `${newName}-${S}`;
                S++;
              }
            }
            const otherProps = fieldsMapping[key];
            return [
              newKey,
              {
                ...otherProps,
                description: newDescription,
                options: newSelectOptions,
                type: newType,
              },
            ];
          }
          return [key, config];
        }),
      );
      //todo update fields
      updateSchema(fieldsObj);
    },
    [fieldsMapping],
  );

  const handleAddField = useCallback(() => {
    // 获取已有字段数量
    let fieldIndex = Object.keys(fieldsMapping).length;
    let newFieldName;

    // 找到一个未被占用的 field 名称（field0, field1, ...）
    do {
      newFieldName = `field${fieldIndex}`;
      fieldIndex++;
    } while (fieldsMapping[newFieldName]);

    const newProperties = {
      ...fieldsMapping,
      [newFieldName]: { type: 'string', id: uuidv4(), description: '' },
    };
    updateSchema(newProperties);
  }, [fieldsMapping]);

  const handleDeleteField = useCallback(
    (fieldName: string) => {
      const result = { ...fieldsMapping };
      delete result[fieldName];
      updateSchema(result);
    },
    [fieldsMapping],
  );

  return (
    <Stack gap={4}>
      <Stack gap={0.5}>
        <Typography fontWeight={700} variant={'subtitle1'}>
          Prompt
        </Typography>
        <PromptEditor
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
      <CollapseCard defaultOpen title={'Define outputs'}>
        <Stack gap={1.5}>
          <RadioGroup
            onChange={(e) => {
              try {
                schemaJson && JSON.parse(schemaJson);
                setOutPuts((e.target as HTMLInputElement).value as any);
                if (schemaJson.trim() !== '') {
                  setSchemaJson(schemaJson);
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
              sx={{
                '& .MuiTypography-root': {
                  fontSize: 14,
                },
              }}
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
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: 14,
                  },
                }}
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
              {Object.entries(schemaFields).map(([item, config]) => (
                <OutputsFields
                  fieldDescription={config?.description || ''}
                  fieldName={item}
                  fieldType={config?.type || TableColumnTypeEnum.text}
                  key={config.id || item}
                  removeField={handleDeleteField}
                  saveField={(
                    fieldName: string,
                    newName: string,
                    newDescription: string,
                    newType: string,
                    newSelectOptions: any,
                  ) => {
                    handleFieldChange(
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
                      value: 'string',
                      key: 'string',
                    },
                  ]}
                />
              ))}
              <StyledButton
                color={'info'}
                onClick={handleAddField}
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
            <FormulaEditor
              editor={editor}
              initialValue={schemaJson}
              onEditorReady={handleSchemaEditorReady}
              onValueChange={setSchemaJson}
              ref={schemaEditorRef}
            />
          )}
          {/* </Box> */}
        </Stack>
      </CollapseCard>
      {/*Run settings*/}
      <CollapseCard defaultOpen title={'Run settings'}>
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
            <StyledSwitch checked={visible} onChange={toggle} />
          </Stack>
          {/*<Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>*/}
          {/*  <Typography variant={'subtitle1'}>Only run if</Typography>*/}
          {/*  <Tooltip title={'Only run if this formula resolves to true.'}>*/}
          {/*    <Icon component={ICON_WARNING} sx={{ width: 12, height: 12 }} />*/}
          {/*  </Tooltip>*/}
          {/*</Stack>*/}
          {/*<FormulaEditor initialValue={{}} style={{ padding: '4px' }} />*/}
        </Stack>
      </CollapseCard>
    </Stack>
  );
};
