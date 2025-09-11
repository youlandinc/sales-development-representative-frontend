// store.ts
import { create } from 'zustand';

type WSMessage = {
  type: string;
  data: any;
  timestamp: number;
};

type UseWSStoreState = {
  connected: boolean;
  messages: WSMessage[];
  setConnected: (connected: boolean) => void;
  pushMessage: (message: WSMessage) => void;
  clearMessages: () => void;
};

export const useWSStore = create<UseWSStoreState>((set) => ({
  connected: false,
  messages: [],
  setConnected: (connected) => set({ connected }),
  pushMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () => set({ messages: [] }),
}));
