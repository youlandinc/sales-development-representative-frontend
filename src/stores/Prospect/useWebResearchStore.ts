import { create } from 'zustand/index';

type WebResearchStoreProps = {
  prompt: string;
  schemaJson: Record<string, any>;
  open:boolean;
};

type WebResearchActions = {
  setPrompt: (prompt: string) => void;
  setSchemaJson: (schemaJson: Record<string, any>) => void;
  setOpen:(b:boolean) => void;
};

export const useWebResearchStore = create<
  WebResearchStoreProps & WebResearchActions
>()((set) => ({
  prompt: '',
  schemaJson: {},
  open:false,
  setPrompt: (prompt: string) => {
    set({ prompt });
  },
  setSchemaJson: (schemaJson: Record<string, any>) => {
    set({ schemaJson });
  },
  setOpen: (open: boolean) => {set({
    open
  })}
}));
