import { create } from 'zustand';

export enum InboxContentTypeEnum {
  receipt = 'receipt',
  forward = 'forward',
}

export type InboxStoreState = {
  inboxContentType: InboxContentTypeEnum;
};

export type TableImportStoreActions = {
  setInboxContentType: (inboxContentType: InboxContentTypeEnum) => void;
};

export type InboxStoreProps = InboxStoreState & TableImportStoreActions;

export const useInboxStore = create<InboxStoreProps>()((set) => ({
  inboxContentType: InboxContentTypeEnum.receipt,
  setInboxContentType: (inboxContentType) => set({ inboxContentType }),
}));
