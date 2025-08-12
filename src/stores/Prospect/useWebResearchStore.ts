import { create } from 'zustand/index';

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
  // removedField: (key: string) => {
  //   const { properties, ...rest } = get().schemaJson;
  //   const { key, ...others } = properties;
  // },
}));
