import { create } from 'zustand';
import {
  _saveWebResearchConfig,
  generatePrompt as generatePromptApi,
} from '@/request';
import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import { Editor } from '@tiptap/core';
import { ReactEditor } from 'slate-react/dist/plugin/react-editor';
import { TableColumnTypeEnum } from '@/types/enrichment/table';

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
  runGeneratePrompt: (
    api: string,
    params: Record<string, any>,
  ) => Promise<void>;
  runGenerateJson: (api: string, params: Record<string, any>) => Promise<void>;
};

export const useWebResearchStore = create<
  WebResearchStoreProps & WebResearchActions
>()((set, get) => ({
  activeType: ActiveTypeEnum.add,
  prompt: '',
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
    });
  },
  saveAiConfig: async (
    tableId: string,
    prompt: string,
    schema: string,
    generatePrompt: string,
  ) => {
    try {
      return await _saveWebResearchConfig(
        tableId,
        prompt,
        schema,
        get().excludeFields.map((item) => [item]),
        generatePrompt,
      );
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
  runGeneratePrompt: async (api: string, params: Record<string, any>) => {
    set({ generateIsLoading: true, generateIsThinking: true });
    try {
      const response = await generatePromptApi(api, params);
      if (response.body) {
        set({ generateIsThinking: false });
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let fullText = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            set({ generateIsLoading: false });
            // After prompt generation, trigger JSON schema generation
            get().setPrompt(fullText);
            get().runGenerateJson('/sdr/ai/generate', {
              module: 'JSON_SCHEMA_WITH_PROMPT',
              params: { prompt: fullText },
            });
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          const events = (buffer.split('\n\n') || ['']) as string[];
          buffer = events.pop() || '';
          for (const e of events) {
            const chunk = e.replace(/data:/g, '');
            fullText += chunk;
            set({ generateText: fullText });
          }
        }
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
      set({ generateIsLoading: false, generateIsThinking: false });
    }
  },
  runGenerateJson: async (api: string, params: Record<string, any>) => {
    set({ generateIsLoading: true /*  generateIsThinking: true  */ });
    try {
      const response = await generatePromptApi(api, params);
      if (response.body) {
        set({ generateIsThinking: false });
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let fullText = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            set({ generateIsLoading: false });
            get().setSchemaJson(fullText);
            setTimeout(() => {
              set({ webResearchTab: 'configure' });
            }, 0);
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          const events = (buffer.split('\n\n') || ['']) as string[];
          buffer = events.pop() || '';
          for (const e of events) {
            const chunk = e.replace(/data:/g, '');
            fullText += chunk;
            set({ generateSchemaStr: fullText });
          }
        }
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
      set({ generateIsLoading: false, generateIsThinking: false });
    }
  },
}));
