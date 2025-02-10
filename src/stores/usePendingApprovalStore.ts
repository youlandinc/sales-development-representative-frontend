import { create } from 'zustand';

import { ICampaignsPendingEmailsItem } from '@/types';

export type PendingApprovalState = {
  isNoData: boolean;
  pendingEmails: ICampaignsPendingEmailsItem[];
};

export type PendingApprovalStateStoreActions = {
  setPendingEmails: (emails: ICampaignsPendingEmailsItem[]) => void;
  updatePendingEmailById: (
    emailId: number,
    subject: string,
    content: string,
  ) => void;
  deletePendingEmailById: (emailId: number) => void;
  setIsNoData: (noData: boolean) => void;
};

export type PendingApprovalStoreProps = PendingApprovalState &
  PendingApprovalStateStoreActions;

export const usePendingApprovalStore = create<PendingApprovalStoreProps>()(
  (set) => ({
    isNoData: false,
    pendingEmails: [],
    setPendingEmails: (emails) =>
      set({ pendingEmails: emails, isNoData: emails.length === 0 }),
    updatePendingEmailById: (emailId, subject, content) =>
      set((state) => ({
        pendingEmails: state.pendingEmails.map((item) =>
          item.emailId === emailId
            ? { ...item, subject, content }
            : { ...item },
        ),
      })),
    deletePendingEmailById: (emailId) =>
      set((state) => ({
        pendingEmails: state.pendingEmails.filter(
          (item) => item.emailId !== emailId,
        ),
      })),
    setIsNoData: (isNoData) => set({ isNoData }),
  }),
);
