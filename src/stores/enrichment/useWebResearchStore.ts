import { create } from 'zustand';
import { Editor } from '@tiptap/core';
import { ReactEditor } from 'slate-react/dist/plugin/react-editor';

import { SDRToast } from '@/components/atoms';

import {
  _fetchWebResearchModelList,
  _saveWebResearchConfig,
  generatePrompt as generatePromptApi,
} from '@/request';

import { HttpError, ModelGroupItem } from '@/types';

import { TableColumnTypeEnum } from '@/types/enrichment/table';
import { useProspectTableStore } from './useProspectTableStore';

import { UTypeOf } from '@/utils/UTypeOf';

const parseTaskModelText = (fullText: string) => {
  const taskMatch = fullText.match(/^Task\s+([\s\S]*?)(?=Suggested model|$)/i);
  const suggestedModelMatch = fullText.match(/Suggested model\s+([\s\S]*?)$/i);
  const bracketMatch = fullText.match(/\[([^\]]+)\]/);
  const enableWebSearchMatch = fullText.match(
    /Enable web search\s*\[([^\]]+)\]/i,
  );
  const enableWebSearchValue = enableWebSearchMatch?.[1]?.trim().toLowerCase();
  return {
    taskContent: taskMatch?.[1]?.trim() ?? '',
    suggestedModelContent: suggestedModelMatch?.[1]?.trim() ?? '',
    suggestedModelType: bracketMatch?.[1]?.trim() ?? '',
    enableWebSearch: enableWebSearchValue === 'true',
  };
};

const extractJsonFromMarkdown = (fullText: string): string => {
  const jsonMatch = fullText.match(/```json\s*([\s\S]*?)(?:```|$)/i);
  return jsonMatch?.[1]?.trim() ?? '';
};

const extractTextBeforeJson = (fullText: string): string => {
  const jsonIndex = fullText.indexOf('```json');
  if (jsonIndex === -1) {
    return fullText;
  }
  return fullText.slice(0, jsonIndex).trim();
};

const readStreamToText = async (
  body: ReadableStream<Uint8Array>,
  onTextChange: (fullText: string) => void,
): Promise<string> => {
  const reader = body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let fullText = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      return fullText;
    }
    buffer += decoder.decode(value, { stream: true });
    const events = (buffer.split('\n\n') || ['']) as string[];
    buffer = events.pop() || '';
    for (const e of events) {
      const chunk = e.replace(/data:/g, '');
      fullText += chunk;
      onTextChange(fullText);
    }
  }
};

export type WebResearchTabType = 'generate' | 'configure';

const defaultSchemaJsonStr = `{
    "type": "object",
    "properties": {
      "response": {
        "type": "${TableColumnTypeEnum.text}"
      }
    },
    "required": [
      "response"
    ]
  }`;

export enum ActiveTypeEnum {
  add = 'add',
  edit = 'edit',
}

type WebResearchStoreProps = {
  activeType: ActiveTypeEnum;
  prompt: string;
  schemaJson: string;
  taskModelText: string;
  taskContent: string;
  suggestedModelContent: string;
  suggestedModelType: string;
  webResearchVisible: boolean;
  generateDescription: string;
  excludeFields: string[];
  promptIsEmpty: boolean;
  generateEditorInstance: Editor | null;
  tipTapEditorInstance: Editor | null;
  slateEditorInstance: ReactEditor | null;
  // Generate prompt state
  webResearchTab: WebResearchTabType;
  generateText: string;
  generateSchemaStr: string;
  generateIsLoading: boolean;
  generateIsThinking: boolean;
  enableWebSearch: boolean;
  aiModelList: ModelGroupItem[];
};

type WebResearchActions = {
  setPrompt: (prompt: string) => void;
  setSchemaJson: (schemaJson: string) => void;
  setWebResearchVisible: (open: boolean, activeType: ActiveTypeEnum) => void;
  setGenerateDescription: (description: string) => void;
  allClear: () => void;
  saveAiConfig: (
    tableId: string,
    prompt: string,
    schema: string,
    generatePrompt: string,
  ) => Promise<any>;
  setExcludeFields: (fields: string) => void;
  removeExcludeFields: (fields: string) => void;
  setPromptIsEmpty: (bool: boolean) => void;
  setGenerateEditorInstance: (instance: Editor) => void;
  setTipTapEditorInstance: (instance: Editor) => void;
  setSlateEditorInstance: (instance: ReactEditor) => void;
  // Generate prompt actions
  setWebResearchTab: (tab: WebResearchTabType) => void;
  setGenerateText: (text: string) => void;
  setGenerateSchemaStr: (str: string) => void;
  setTaskModelText: (text: string) => void;
  setSuggestedModelType: (model: string) => void;
  setEnableWebSearch: (enabled: boolean) => void;
  setEditParams: (param: {
    webResearchVisible: boolean;
    schemaJson: string;
    prompt: string;
    generateDescription: string;
    enableWebSearch: boolean;
    model: string;
  }) => void;
  runGeneratePrompt: (
    api: string,
    params: Record<string, any>,
  ) => Promise<void>;
  // runGenerateJson: (api: string, params: Record<string, any>) => Promise<void>;
  runGenerateAiModel: (
    api: string,
    params: Record<string, any>,
  ) => Promise<void>;
  fetchWebResearchModelList: () => Promise<void>;
};

export const useWebResearchStore = create<
  WebResearchStoreProps & WebResearchActions
>()((set, get) => ({
  activeType: ActiveTypeEnum.add,
  prompt: '',
  taskModelText: '',
  taskContent: '',
  suggestedModelContent: '',
  suggestedModelType: '',
  promptIsEmpty: true,
  generateDescription: '',
  schemaJson: defaultSchemaJsonStr,
  excludeFields: [],
  webResearchVisible: false,
  generateEditorInstance: null,
  tipTapEditorInstance: null,
  slateEditorInstance: null,
  // Generate prompt initial state
  webResearchTab: 'generate',
  generateText: '',
  generateSchemaStr: '',
  generateIsLoading: false,
  generateIsThinking: false,
  enableWebSearch: false,
  aiModelList: [],
  setPrompt: (prompt: string) => {
    set({ prompt });
  },
  setSchemaJson: (schemaJson: string) => {
    set({ schemaJson });
  },
  setWebResearchVisible: (open: boolean, activeType: ActiveTypeEnum) => {
    set({
      webResearchVisible: open,
      activeType,
    });
  },
  setTaskModelText: (text: string) => {
    set({ taskModelText: text });
  },
  setGenerateDescription: (description: string) => {
    set({
      generateDescription: description,
    });
  },
  allClear: () => {
    set({
      prompt: '',
      schemaJson: defaultSchemaJsonStr,
      generateDescription: '',
      taskModelText: '',
      taskContent: '',
      suggestedModelContent: '',
      generateText: '',
      generateSchemaStr: '',
      enableWebSearch: false,
      suggestedModelType: '',
      activeType: ActiveTypeEnum.add,
    });
  },
  saveAiConfig: async (
    tableId: string,
    prompt: string,
    schema: string,
    generatePrompt: string,
  ) => {
    try {
      return await _saveWebResearchConfig({
        tableId,
        prompt,
        schema,
        excludeFields: get().excludeFields.map((item) => [item]),
        generatePrompt,
        enableWebSearch: get().enableWebSearch,
        model: get().suggestedModelType,
      });
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
      return Promise.reject(err);
    }
  },
  setExcludeFields: (field: string) => {
    const ids = get().excludeFields.concat(field);
    const result = [...(new Set(ids) as any)] as string[];
    set({ excludeFields: result });
  },
  removeExcludeFields: (field: string) => {
    const ids = get().excludeFields.filter((item) => item !== field);
    const result = [...(new Set(ids) as any)] as string[];
    set({ excludeFields: result });
  },
  setPromptIsEmpty: (b: boolean) => {
    set({ promptIsEmpty: b });
  },
  setGenerateEditorInstance: (instance: Editor) => {
    set({ generateEditorInstance: instance });
  },
  setTipTapEditorInstance: (instance: Editor) => {
    set({ tipTapEditorInstance: instance });
  },
  setSlateEditorInstance: (instance: ReactEditor) => {
    set({ slateEditorInstance: instance });
  },
  // Generate prompt actions
  setWebResearchTab: (tab: WebResearchTabType) => {
    set({ webResearchTab: tab });
  },
  setGenerateText: (text: string) => {
    set({ generateText: text });
  },
  setGenerateSchemaStr: (str: string) => {
    set({ generateSchemaStr: str });
  },
  setSuggestedModelType: (model: string) => {
    set({ suggestedModelType: model });
  },
  setEnableWebSearch: (enabled: boolean) => {
    set({ enableWebSearch: enabled });
  },
  setEditParams: (param: {
    webResearchVisible: boolean;
    schemaJson: string;
    prompt: string;
    generateDescription: string;
    enableWebSearch: boolean;
    model: string;
  }) => {
    set({
      webResearchVisible: param.webResearchVisible,
      schemaJson: param.schemaJson,
      prompt: param.prompt,
      generateDescription: param.generateDescription,
      enableWebSearch: param.enableWebSearch,
      suggestedModelType: param.model,
      activeType: ActiveTypeEnum.edit,
    });
  },
  runGenerateAiModel: async (api: string, params: Record<string, any>) => {
    get().allClear();
    set({ generateIsLoading: true, generateIsThinking: true });
    try {
      const columnsNames = useProspectTableStore
        .getState()
        .columns.map((item) => item.fieldName)
        .join(',');
      const response = await generatePromptApi(api, {
        module: 'TASK_MODEL_CHOOSER',
        params: {
          ...(params?.params || {}),
          columns: columnsNames,
        },
      });
      if (response.body) {
        set({ generateIsLoading: false });
        const fullText = await readStreamToText(
          response.body,
          (nextFullText) => {
            const { taskContent, suggestedModelContent } =
              parseTaskModelText(nextFullText);
            set({
              taskModelText: nextFullText,
              taskContent,
              suggestedModelContent,
            });
          },
        );

        const { suggestedModelType, enableWebSearch } =
          parseTaskModelText(fullText);
        set({
          suggestedModelType,
          enableWebSearch,
        });

        get().runGeneratePrompt('/aiResearch/generate/stream', {
          module: 'COLUMN_ENRICHMENT_PROMPT',
          params: {
            userInput: params?.params?.userInput || '',
            columns: columnsNames,
            model: suggestedModelType,
          },
        });
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
      set({ generateIsLoading: false, generateIsThinking: false });
    }
  },
  runGeneratePrompt: async (api: string, params: Record<string, any>) => {
    try {
      const response = await generatePromptApi(api, params);
      if (response.body) {
        const fullText = await readStreamToText(
          response.body,
          (nextFullText) => {
            const textBeforeJson = extractTextBeforeJson(nextFullText);
            const jsonContent = extractJsonFromMarkdown(nextFullText);
            set({
              generateText: textBeforeJson,
              generateSchemaStr: jsonContent,
            });
          },
        );
        const textBeforeJson = extractTextBeforeJson(fullText);
        const jsonContent = extractJsonFromMarkdown(fullText);

        set({
          generateText: textBeforeJson,
          generateSchemaStr: jsonContent,
          prompt: textBeforeJson,
          schemaJson: jsonContent,
        });
        setTimeout(() => {
          set({ webResearchTab: 'configure', generateIsThinking: false });
        }, 1000);
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
  // runGenerateJson: async (api: string, params: Record<string, any>) => {
  //   try {
  //     const response = await generatePromptApi(api, params);
  //     if (response.body) {
  //       const fullText = await readStreamToText(
  //         response.body,
  //         (nextFullText) => {
  //           const jsonContent = extractJsonFromMarkdown(nextFullText);
  //           set({ generateSchemaStr: jsonContent || nextFullText });
  //         },
  //       );
  //       const jsonContent = extractJsonFromMarkdown(fullText);
  //       get().setSchemaJson(jsonContent || fullText);
  //     }
  //   } catch (err) {
  //     const { header, message, variant } = err as HttpError;
  //     SDRToast({ message, header, variant });
  //   }
  // },
  fetchWebResearchModelList: async () => {
    try {
      const response = await _fetchWebResearchModelList();
      if (UTypeOf.isArray(response?.data)) {
        set({ aiModelList: response.data });
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
}));
