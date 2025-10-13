import { create } from 'zustand';

type WorkEmailStoreProps = {
  workEmailVisible: boolean;
  dialogIntegrationsVisible: boolean;
  displayType: 'main' | 'integration';
};

type WorkEmailStoreActions = {
  setWorkEmailVisible: (open: boolean) => void;
  setDialogIntegrationsVisible: (open: boolean) => void;
  setDisplayType: (type: 'main' | 'integration') => void;
};

export const useWorkEmailStore = create<
  WorkEmailStoreProps & WorkEmailStoreActions
>((set) => ({
  displayType: 'main',
  workEmailVisible: false,
  dialogIntegrationsVisible: false,
  setWorkEmailVisible: (open: boolean) => {
    set({
      workEmailVisible: open,
    });
  },
  setDialogIntegrationsVisible: (open: boolean) => {
    set({
      dialogIntegrationsVisible: open,
    });
  },
  setDisplayType: (type: 'main' | 'integration') => {
    set({
      displayType: type,
    });
  },
}));
