import { create } from 'zustand';

type WorkEmailStoreProps = {
  workEmailVisible: boolean;
};

type WorkEmailStoreActions = {
  setWorkEmailVisible: (open: boolean) => void;
};

export const useWorkEmailStore = create<
  WorkEmailStoreProps & WorkEmailStoreActions
>((set) => ({
  workEmailVisible: false,
  setWorkEmailVisible: (open: boolean) => {
    set({
      workEmailVisible: open,
    });
  },
}));
