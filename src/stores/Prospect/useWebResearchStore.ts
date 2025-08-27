import { create } from 'zustand';
import { _saveWebResearchConfig } from '@/request';
import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import { Editor } from '@tiptap/core';
import { ReactEditor } from 'slate-react/dist/plugin/react-editor';

const defaultSchemaJsonStr = `{
    "type": "object",
    "properties": {
      "response": {
        "type": "string"
      }
    },
    "required": [
      "response"
    ]
  }`;

type WebResearchStoreProps = {
  prompt: string;
  schemaJson: string;
  open: boolean;
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
  setOpen: (b: boolean) => void;
  setGenerateDescription: (description: string) => void;
  allClear: () => void;
  saveAiConfig: (
    tableId: string,
    prompt: string,
    schema: string,
    geneatePrompt: string,
  ) => Promise<any>;
  setExcludeFields: (fields: string) => void;
  removeExcludeFields: (fields: string) => void;
  setPromptIsEmpty: (b: boolean) => void;
  setGenerateEditorInstance: (instance: Editor) => void;
  setTipTapEditorInstance: (instance: Editor) => void;
  setSlateEditorInstance: (instance: ReactEditor) => void;
};

export const useWebResearchStore = create<
  WebResearchStoreProps & WebResearchActions
>()((set, get) => ({
  prompt: '',
  promptIsEmpty: true,
  generateDescription: '',
  schemaJson: defaultSchemaJsonStr,
  excludeFields: [],
  open: false,
  generateEditorInstance: null,
  tipTapEditorInstance: null,
  slateEditorInstance: null,
  setPrompt: (prompt: string) => {
    set({ prompt });
  },
  setSchemaJson: (schemaJson: string) => {
    set({ schemaJson });
  },
  setOpen: (open: boolean) => {
    set({
      open,
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
    geneatePrompt: string,
  ) => {
    try {
      return await _saveWebResearchConfig(
        tableId,
        prompt,
        schema,
        get().excludeFields.map((item) => [item]),
        geneatePrompt,
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
  // removedField: (key: string) => {
  //   const { properties, ...rest } = get().schemaJson;
  //   const { key, ...others } = properties;
  // },
}));
