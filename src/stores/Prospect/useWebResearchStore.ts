import { create } from 'zustand';
import { _saveWebResearchConfig } from '@/request';
import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';

type WebResearchStoreProps = {
  prompt: string;
  schemaJson: Record<string, any>;
  open: boolean;
};

type WebResearchActions = {
  setPrompt: (prompt: string) => void;
  setSchemaJson: (schemaJson: Record<string, any>) => void;
  setOpen: (b: boolean) => void;
  allClear: () => void;
  saveAiConfig: (
    tableId: string,
    prompt: string,
    schema: string,
  ) => Promise<any>;
  // removedField: (key: string) => void;
};

export const useWebResearchStore = create<
  WebResearchStoreProps & WebResearchActions
>()((set, get) => ({
  prompt: '',
  schemaJson: {
    type: 'object',
    properties: {
      response: {
        type: 'string',
      },
    },
    required: ['response'],
  },
  open: false,
  setPrompt: (prompt: string) => {
    set({ prompt });
  },
  setSchemaJson: (schemaJson: Record<string, any>) => {
    set({ schemaJson });
  },
  setOpen: (open: boolean) => {
    set({
      open,
    });
  },
  allClear: () => {
    set({
      prompt: '',
      schemaJson: {},
    });
  },
  saveAiConfig: async (tableId: string, prompt: string, schema: string) => {
    try {
      await _saveWebResearchConfig(tableId, prompt, schema);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
  // removedField: (key: string) => {
  //   const { properties, ...rest } = get().schemaJson;
  //   const { key, ...others } = properties;
  // },
}));
