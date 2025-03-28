import { create } from 'zustand';

export enum InboxContentTypeEnum {
  receipt = 'receipt',
  forward = 'forward',
}

export enum ReceiptTypeEnum {
  engaged = 'ENGAGED',
  sent = 'SENT',
}

export type InboxSideItem = {
  emailId: number;
  email: string | null;
  name: string | null;
  avatar: string | null;
  subject: string | null;
  read: boolean | null;
  sentOn: string;
};

export type InboxContentItem = {
  email: string | null;
  name: string | null;
  avatar: string;
  subject: string | null;
  content: string | null;
  sentOn: string;
  emailType: ReceiptTypeEnum;
  emailId: number;
};

export type InboxStoreState = {
  fetchEngageLoading: boolean;
  fetchSentLoading: boolean;
  fetchEmailLoading: boolean;
  fetchEmailDetailsLoading: boolean;
  receiptType: ReceiptTypeEnum;
  inboxContentType: InboxContentTypeEnum;
  forwardContent: string;
  forwardReceipt: string;
  inboxSideList: InboxSideItem[];
  inboxSideSentList: InboxSideItem[];
  inboxContentList: InboxContentItem[];
  selectedEmail?: InboxSideItem;
  totalEmails: number;
  forwardEmailId?: number;
};

export type InboxStoreStateActions = {
  setInboxContentType: (inboxContentType: InboxContentTypeEnum) => void;
  setForwardContent: (forwardContent: string) => void;
  setReceiptType: (receiptType: ReceiptTypeEnum) => void;
  setSelectedEmail: (item: InboxSideItem) => void;
  setInboxSideList: (inboxSideList: InboxSideItem[]) => void;
  setInboxSideSentList: (inboxSideSentList: InboxSideItem[]) => void;
  setInboxContentList: (inboxContentList: InboxContentItem[]) => void;
  setForwardReceipt: (forwardReceipt: string) => void;
  setForwardEmailId: (forwardEmailId: number) => void;
  setFetchEngageLoading: (fetchEngageLoading: boolean) => void;
  setFetchSentLoading: (fetchSentLoading: boolean) => void;
  setFetchEmailLoading: (fetchEmailLoading: boolean) => void;
  setTotalEmails: (totalEmails: number) => void;
  unshiftInboxSideList: (newData: InboxSideItem) => void;
  updateEmailIsRead: (emailId: number) => void;
  setFetchEmailDetailsLoading: (fetchEmailDetailsLoading: boolean) => void;
  // fetchEmailsData: (
  //   params: PaginationParam & {
  //     searchContact?: string;
  //     emailType: ReceiptTypeEnum;
  //   },
  // ) => Promise<void>;
  // fetchEmailDetails: (emailId: number) => Promise<void>;
};

export type InboxStoreProps = InboxStoreState & InboxStoreStateActions;

export const useInboxStore = create<InboxStoreProps>()((set) => ({
  selectedId: undefined,
  fetchEngageLoading: false,
  fetchSentLoading: false,
  fetchEmailLoading: false,
  fetchEmailDetailsLoading: false,
  forwardReceipt: '',
  inboxSideList: [],
  totalEmails: 0,
  inboxSideSentList: [],
  inboxContentList: [],
  receiptType: ReceiptTypeEnum.engaged,
  inboxContentType: InboxContentTypeEnum.receipt,
  forwardContent: '',
  setInboxContentType: (inboxContentType) => set({ inboxContentType }),
  setForwardContent: (forwardContent) => set({ forwardContent }),
  setReceiptType: (receiptType) => set({ receiptType }),
  setSelectedEmail: (item: InboxSideItem) => set({ selectedEmail: item }),
  setInboxSideList: (inboxSideList) => set({ inboxSideList }),
  setInboxSideSentList: (inboxSideSentList) => set({ inboxSideSentList }),
  setInboxContentList: (inboxContentList) => set({ inboxContentList }),
  setForwardReceipt: (forwardReceipt) => set({ forwardReceipt }),
  setFetchEngageLoading: (fetchEngageLoading) => set({ fetchEngageLoading }),
  setFetchSentLoading: (fetchSentLoading) => set({ fetchSentLoading }),
  setFetchEmailLoading: (fetchEmailLoading) => set({ fetchEmailLoading }),
  setTotalEmails: (totalEmails) => set({ totalEmails }),
  setForwardEmailId: (forwardEmailId) => set({ forwardEmailId }),
  unshiftInboxSideList: (newData) =>
    set((state) => {
      return { inboxSideList: [newData, ...state.inboxSideList] };
    }),
  updateEmailIsRead: (emailId) =>
    set((state) => {
      const updatedList = state.inboxSideList.map((item) => {
        if (item.emailId === emailId) {
          return { ...item, read: false };
        }
        return item;
      });
      return { inboxSideList: updatedList };
    }),
  setFetchEmailDetailsLoading: (loading) =>
    set({ fetchEmailDetailsLoading: loading }),
  // fetchEmailDetails: async (emailId) => {
  //   try {
  //     const res = await _fetchEmailsDetails(emailId);
  //     if (
  //       Array.isArray(res.data.emailInfos) &&
  //       res.data.emailInfos.length > 0
  //     ) {
  //       set({ inboxContentList: res.data.emailInfos });
  //     }
  //   } catch (e) {
  //     const { message, header, variant } = e as HttpError;
  //     SDRToast({ message, header, variant });
  //   }
  // },
  // fetchEmailsData: async (params) => {
  //   try {
  //     const res = await _fetchEmails(params);
  //     if (res.data.content.length > 0) {
  //       if (params.emailType === ReceiptTypeEnum.engaged) {
  //         set((state) => {
  //           state.fetchEmailDetails(res.data.content[0].emailId);
  //           return {
  //             inboxSideList: res.data.content,
  //             selectedEmail: res.data.content[0],
  //           };
  //         });
  //       }
  //       if (params.emailType === ReceiptTypeEnum.sent) {
  //         set({
  //           inboxSideSentList: res.data.content,
  //           selectedEmail: res.data.content[0],
  //         });
  //       }
  //
  //       await this.fetchEmailDetails(res.data.content[0].emailId);
  //     }
  //   } catch (e) {
  //     const { message, header, variant } = e as HttpError;
  //     SDRToast({ message, header, variant });
  //   }
  // },
}));
