// store.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { combine } from 'zustand/middleware';

type WSMessage = {
  type: string;
  data: any;
  timestamp: number;
};

type WSStoreState = {
  connected: boolean;
  messages: WSMessage[];
};

type WSStoreActions = {
  setConnected: (connected: boolean) => void;
  pushMessage: (message: WSMessage) => void;
  clearMessages: () => void;
};

type UseWSStoreState = WSStoreState & WSStoreActions;

const initialState: WSStoreState = {
  connected: false,
  messages: [],
};

export const useWSStore = create<UseWSStoreState>()(
  immer(
    combine(initialState, (set) => ({
      setConnected: (connected) =>
        set((state) => {
          state.connected = connected;
        }),
      pushMessage: (message) =>
        set((state) => {
          state.messages.push(message);
        }),
      clearMessages: () =>
        set((state) => {
          state.messages = [];
        }),
    })),
  ),
);
