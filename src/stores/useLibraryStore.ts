import { create } from 'zustand';

export enum LibraryContainerTypeEnum {
  // overview = 'overview',
  // edit = 'edit',
  company = 'company',
  offers = 'offers',
}

export type LibraryState = {
  libraryContainerType: LibraryContainerTypeEnum;
};

export type LibraryStateStoreActions = {
  setLibraryContainerType: (type: LibraryContainerTypeEnum) => void;
};

export type InboxStoreProps = LibraryState & LibraryStateStoreActions;

export const useLibraryStore = create<InboxStoreProps>()((set) => ({
  libraryContainerType: LibraryContainerTypeEnum.company,

  setLibraryContainerType: (libraryContainerType) =>
    set({ libraryContainerType }),
}));
