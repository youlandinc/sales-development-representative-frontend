import { create } from 'zustand';

export enum InboxContentTypeEnum {
  receipt = 'receipt',
  forward = 'forward',
}

export enum ReceiptTypeEnum {
  engaged = 'engaged',
  sent = 'sent',
}

export type InboxStoreState = {
  receiptType: ReceiptTypeEnum;
  inboxContentType: InboxContentTypeEnum;
  forwardContent: string;
};

export type InboxStoreStateActions = {
  setInboxContentType: (inboxContentType: InboxContentTypeEnum) => void;
  setForwardContent: (forwardContent: string) => void;
  setReceiptType: (receiptType: ReceiptTypeEnum) => void;
};

export type InboxStoreProps = InboxStoreState & InboxStoreStateActions;

export const useInboxStore = create<InboxStoreProps>()((set) => ({
  receiptType: ReceiptTypeEnum.engaged,
  inboxContentType: InboxContentTypeEnum.receipt,
  forwardContent: '',
  setInboxContentType: (inboxContentType) => set({ inboxContentType }),
  setForwardContent: (forwardContent) => set({ forwardContent }),
  setReceiptType: (receiptType) => set({ receiptType }),
}));
