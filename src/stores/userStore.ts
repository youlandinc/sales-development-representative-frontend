import { createStore } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type UserStoreState = {
  isHydration: boolean;
  accessToken: string;
  accountId: string;
};

export type UserStoreActions = {
  setIsHydration: (isHydration: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  setAccountId: (accountId: string) => void;
};

export type UserStore = UserStoreState & UserStoreActions;

export const defaultInitState: UserStoreState = {
  isHydration: false,
  accessToken: '',
  accountId: '',
};

export const createUserStore = (
  initState: UserStoreState = defaultInitState,
) => {
  return createStore<UserStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setIsHydration: (isHydration: boolean) => set({ isHydration }),
          setAccessToken: (accessToken: string) => set({ accessToken }),
          setAccountId: (accountId: string) => set({ accountId }),
        }),
        {
          name: 'PERSIST_DATA',
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            accessToken: state.accessToken,
            accountId: state.accountId,
          }),
          onRehydrateStorage: () => {
            return (state) => {
              if (state) {
                state.setIsHydration(true);
              }
            };
          },
        },
      ),
    ),
  );
};
