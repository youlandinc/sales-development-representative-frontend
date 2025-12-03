import { create } from 'zustand';
import { _saveWebResearchConfig } from '@/request';
import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import { Editor } from '@tiptap/core';
import { ReactEditor } from 'slate-react/dist/plugin/react-editor';
import { TableColumnTypeEnum } from '@/types/enrichment/table';

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
}));
