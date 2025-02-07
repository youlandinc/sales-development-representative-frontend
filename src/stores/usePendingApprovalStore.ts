import { create } from 'zustand';

import { ICampaignsPendingEmailsItem } from '@/types';

export type PendingApprovalState = {
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
};

export type PendingApprovalStoreProps = PendingApprovalState &
  PendingApprovalStateStoreActions;

export const usePendingApprovalStore = create<PendingApprovalStoreProps>()(
  (set) => ({
    pendingEmails: [],
    setPendingEmails: (emails) => set({ pendingEmails: emails }),
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
  }),
);
