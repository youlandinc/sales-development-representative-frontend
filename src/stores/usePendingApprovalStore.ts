import { create } from 'zustand';

import { HttpError, ICampaignsPendingEmailsItem } from '@/types';
import { _fetCampaignPendingEmails } from '@/request';
import { SDRToast } from '@/components/atoms';

export type PendingApprovalState = {
  isNoData: boolean;
  pendingEmails: ICampaignsPendingEmailsItem[];
  loading: boolean;
  totalEmails: number;
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
  fetchPendingEmailsData: (campaignId: number) => Promise<void>;
};

export type PendingApprovalStoreProps = PendingApprovalState &
  PendingApprovalStateStoreActions;

export const usePendingApprovalStore = create<PendingApprovalStoreProps>()(
  (set) => ({
    isNoData: false,
    totalEmails: 0,
    loading: false,
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
    setIsNoData: (isNoData) => set({ isNoData }),
    fetchPendingEmailsData: async (campaignId) => {
      try {
        set({ loading: true });
        const { data } = await _fetCampaignPendingEmails(campaignId, 1000, 0);
        set({
          isNoData: data.page.totalElements === 0,
          pendingEmails: data.content,
          loading: false,
          totalEmails: data.page.totalElements,
        });
      } catch (err) {
        set({ loading: false });
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
  }),
);
