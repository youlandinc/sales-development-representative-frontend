import { create } from 'zustand';

export enum InboxContentTypeEnum {
  receipt = 'receipt',
  forward = 'forward',
}

export type InboxStoreState = {
  inboxContentType: InboxContentTypeEnum;
  forwardContent: string;
};

export type TableImportStoreActions = {
  setInboxContentType: (inboxContentType: InboxContentTypeEnum) => void;
  setForwardContent: (forwardContent: string) => void;
};

export type InboxStoreProps = InboxStoreState & TableImportStoreActions;

export const useInboxStore = create<InboxStoreProps>()((set) => ({
  inboxContentType: InboxContentTypeEnum.receipt,
  forwardContent: '',
  setInboxContentType: (inboxContentType) => set({ inboxContentType }),
  setForwardContent: (forwardContent) => set({ forwardContent }),
}));
