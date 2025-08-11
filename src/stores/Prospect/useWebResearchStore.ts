import { create } from 'zustand/index';

type WebResearchStoreProps = {
  prompt: string;
  schemaJson: Record<string, any>;
};

type WebResearchActions = {
  setPrompt: (prompt: string) => void;
  setSchemaJson: (schemaJson: Record<string, any>) => void;
};

export const useWebResearchStore = create<
  WebResearchStoreProps & WebResearchActions
>()((set) => ({
  prompt: '',
  schemaJson: {},
  setPrompt: (prompt: string) => {
    set({ prompt });
  },
  setSchemaJson: (schemaJson: Record<string, any>) => {
    set({ schemaJson });
  },
}));
