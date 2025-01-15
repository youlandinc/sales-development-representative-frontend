import { createStore } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type UserStoreState = {
  isHydration: boolean;
  accessToken: string;
  accountId: string;
  userProfile: any;
};

export type UserStoreActions = {
  setIsHydration: (isHydration: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  setUserProfile: (userProfile: any) => void;
  resetUserStore: () => void;
};

export type UserStore = UserStoreState & UserStoreActions;

export const defaultInitState: UserStoreState = {
  isHydration: false,
  accessToken: '',
  accountId: '',
  userProfile: {},
};

export const createUserStore = (
  initState: UserStoreState = defaultInitState,
) => {
  return createStore<UserStore>()(
    devtools(
      persist(
        (set, get) => ({
          ...initState,
          setIsHydration: (isHydration: boolean) => set({ isHydration }),
          setAccessToken: (accessToken: string) => set({ accessToken }),
          setUserProfile: (userProfile: any) => {
            set({ userProfile });
            set({ accountId: userProfile.accountId });
          },
          resetUserStore: () =>
            set({
              isHydration: get().isHydration,
              accessToken: '',
              accountId: '',
              userProfile: {},
            }),
        }),
        {
          name: 'PERSIST_DATA',
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            accessToken: state.accessToken,
            accountId: state.accountId,
            userProfile: state.userProfile,
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
