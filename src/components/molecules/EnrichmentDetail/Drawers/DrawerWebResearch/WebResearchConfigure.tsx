import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { Editor } from '@tiptap/core';
import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { createEditor } from 'slate';
import { ReactEditor, withReact } from 'slate-react';
import { v4 as uuidv4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';

import {
  StyledSlateEditor,
  StyledSwitch,
  StyledTiptapEditor,
} from '@/components/atoms';
import { CollapseCard, ModelSelect, OutputsFields } from './base';

import { useFieldMapping } from '@/components/molecules/EnrichmentDetail/hooks';

import { useWebResearchStore } from '@/stores/enrichment';

import { insertWithPlaceholders } from '@/utils';

import { TableColumnTypeEnum } from '@/types/enrichment/table';

import {
  ExtensionMention,
  ExtensionNode,
  ExtensionStorage,
} from './extensions';

import { DrawersIconConfig } from '../DrawersIconConfig';

interface WebResearchConfigureProps {
  onClickToGenerate?: () => void;
  onPromptEditorReady?: (editor: Editor) => void;
  onSchemaEditorReady?: (editor: ReactEditor) => void;
}

export const WebResearchConfigure: FC<WebResearchConfigureProps> = ({
  onClickToGenerate,
  onPromptEditorReady,
  onSchemaEditorReady: onSchemaEditorReadyProp,
}) => {
  const {
    prompt,
    schemaJson,
    setSchemaJson,
    setTipTapEditorInstance,
    setSlateEditorInstance,
    taskContent,
    enableWebSearch,
    setEnableWebSearch,
    setWebResearchTab,
  } = useWebResearchStore(
    useShallow((state) => ({
      prompt: state.prompt,
      schemaJson: state.schemaJson,
      setSchemaJson: state.setSchemaJson,
      setTipTapEditorInstance: state.setTipTapEditorInstance,
      setSlateEditorInstance: state.setSlateEditorInstance,
      taskContent: state.taskContent,
      enableWebSearch: state.enableWebSearch,
      setEnableWebSearch: state.setEnableWebSearch,
      setWebResearchTab: state.setWebResearchTab,
    })),
  );
  const { filedMapping } = useFieldMapping();

  const [outPuts] = useState<'fields' | 'json'>('fields');

  const promptEditorRef = useRef<null | Editor>(null);
  const schemaEditorRef = useRef(null);
  const editor = useMemo(() => withReact(createEditor()), []);

  /*   const { generatePrompt: generateJson, isLoading } = useGeneratePrompt(
    undefined,
    (objStr) => {
      setSchemaJson(objStr);
      setOutPuts('fields');
    },
  ); */

  /*const DEFAULT_PROMOT =
    '#CONTEXT#\nYou are tasked with finding a Java engineer associated with a given company or website, and extracting their professional profile and email address.\n\n#OBJECTIVE#\nIdentify a Java engineer related to {{Enrich Company}}, {{Domain}}, or {{Url}}, and extract their professional profile link (such as LinkedIn) and email address.\n\n#INSTRUCTIONS#\n1. Use the provided {{Enrich Company}}, {{Domain}}, or {{Url}} to search for employees or team members who are Java engineers (titles may include "Java Engineer," "Java Developer," or similar).\n2. Search LinkedIn, company team pages, or other professional directories for profiles matching the criteria.\n3. Extract the profile URL (preferably LinkedIn) and the email address if publicly available.\n4. If multiple Java engineers are found, return the first relevant result.\n5. If no Java engineer or email is found, return "No Java engineer found" or "No email found" as appropriate.\n\n#EXAMPLES#\nInput:\n  Enrich Company: Acme Corp\n  Domain: acmecorp.com\n  Url: https://acmecorp.com\n\nExpected Output:\n  Java Engineer Name: John Doe\n';*/
  const defaultValue = prompt
    ? insertWithPlaceholders(prompt, filedMapping)
    : null;

  const onEditorReady = useCallback((editor: Editor) => {
    if (editor) {
      setTipTapEditorInstance(editor);
      onPromptEditorReady?.(editor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSlateEditorReady = useCallback((editor: ReactEditor) => {
    if (editor) {
      setSlateEditorInstance(editor);
      onSchemaEditorReadyProp?.(editor);
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
        return transformToObject(schemaJson)?.properties || {};
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

  const updateSchema = useCallback(
    (result: Record<string, { type: string; description: string }>) => {
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
    },
    [setSchemaJson],
  );

  const onFieldChange = useCallback(
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
    [fieldsMapping, updateSchema],
  );

  const onClickToAddField = useCallback(() => {
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
  }, [fieldsMapping, updateSchema]);

  const onClickToDeleteField = useCallback(
    (fieldName: string) => {
      const result = { ...fieldsMapping };
      delete result[fieldName];
      updateSchema(result);
    },
    [fieldsMapping, updateSchema],
  );

  return (
    <Stack gap={3}>
      {taskContent && (
        <Typography
          color={'text.secondary'}
          onClick={() => {
            setWebResearchTab('generate');
          }}
          sx={{
            cursor: 'pointer',
          }}
          variant={'body3'}
        >
          <DrawersIconConfig.Arrow
            size={12}
            sx={{ mr: '2px', verticalAlign: 'middle' }}
          />
          <strong>Task: </strong> {taskContent}
        </Typography>
      )}
      <CollapseCard hasCollapse={false} title={'Model'}>
        <Stack gap={1.5}>
          <ModelSelect />
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
              <Typography variant={'body2'}>Enable web access</Typography>
              <Tooltip
                title={
                  'Enables Atlas to research information online in real time. This may increase usage costs.'
                }
              >
                <DrawersIconConfig.Warning size={12} />
              </Tooltip>
            </Stack>
            <StyledSwitch
              checked={enableWebSearch}
              onChange={(e) => setEnableWebSearch(e.target.checked)}
            />
          </Stack>
        </Stack>
      </CollapseCard>
      <CollapseCard title={'Agent instructions'}>
        <StyledTiptapEditor
          defaultValue={defaultValue}
          editorSx={{
            border: '1px solid #ccc',
            borderRadius: 2,
            p: 2,
          }}
          extensions={[ExtensionMention, ExtensionNode, ExtensionStorage]}
          minHeight={200}
          onClickToGenerate={onClickToGenerate}
          onEditorReady={onEditorReady}
          placeholder={
            'E.g., Find the CEO of the company and their Linkedin profile'
          }
          ref={promptEditorRef}
          showBtn={false}
        />
      </CollapseCard>

      {/*outputs*/}
      <CollapseCard defaultOpen title={'Output fields'}>
        <Stack gap={1.5}>
          {/* <RadioGroup
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
          </RadioGroup> */}
          {/* {outPuts === 'fields' && ( */}
          <Stack gap={1.5}>
            {Object.entries(schemaFields).map(([item, config]) => (
              <OutputsFields
                fieldDescription={config?.description || ''}
                fieldName={item}
                fieldType={config?.type || TableColumnTypeEnum.text}
                key={config.id || item}
                removeField={onClickToDeleteField}
                saveField={(
                  fieldName: string,
                  newName: string,
                  newDescription: string,
                  newType: string,
                  newSelectOptions: any,
                ) => {
                  onFieldChange(
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
            <Box
              color={'text.secondary'}
              fontSize={12}
              ml={'auto'}
              onClick={onClickToAddField}
              sx={{ cursor: 'pointer' }}
            >
              + Add field
            </Box>
          </Stack>
          {/* )} */}
          {/* <Box display={outPuts === 'json' ? 'block' : 'none'}> */}
          {outPuts === 'json' && (
            <StyledSlateEditor
              editor={editor}
              initialValue={schemaJson}
              onEditorReady={onSlateEditorReady}
              onValueChange={setSchemaJson}
              ref={schemaEditorRef}
            />
          )}
          {/* </Box> */}
        </Stack>
      </CollapseCard>
      {/*Run settings*/}
      {/* <CollapseCard title={'Run settings'}>
        <Stack gap={1.5}>
          <Stack flexDirection={'row'} justifyContent={'space-between'}>
            <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
              <Typography variant={'body2'}>Auto-update</Typography>
              <Tooltip
                arrow
                title={
                  'Disable or enable automatic runs of this column on table updates.'
                }
              >
                <Icon
                  component={ICON_WARNING}
                  sx={{ width: 12, height: 12, cursor: 'help' }}
                />
              </Tooltip>
            </Stack>
            <StyledSwitch checked={visible} onChange={toggle} />
          </Stack> */}
      {/*<Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>*/}
      {/*  <Typography variant={'subtitle1'}>Only run if</Typography>*/}
      {/*  <Tooltip title={'Only run if this formula resolves to true.'}>*/}
      {/*    <Icon component={ICON_WARNING} sx={{ width: 12, height: 12 }} />*/}
      {/*  </Tooltip>*/}
      {/*</Stack>*/}
      {/*<FormulaEditor initialValue={{}} style={{ padding: '4px' }} />*/}
      {/* </Stack>
      </CollapseCard> */}
    </Stack>
  );
};
