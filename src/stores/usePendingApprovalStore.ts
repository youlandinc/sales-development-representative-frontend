import { create } from 'zustand';

import {
  CampaignsPendingEmailsResponseData,
  HttpError,
  ICampaignsPendingEmailsItem,
} from '@/types';
import { _fetCampaignPendingEmails } from '@/request';
import { SDRToast } from '@/components/atoms';

export type PendingApprovalState = {
  isNoData: boolean;
  pendingEmails: ICampaignsPendingEmailsItem[];
  loading: boolean;
  totalEmails: number;
  pageSize: number;
  pageNumber: number;
};

export type PendingApprovalStateStoreActions = {
  setPendingEmails: (emails: ICampaignsPendingEmailsItem[]) => void;
  setTotalEmails: (totalEmails: number) => void;
  updatePendingEmailById: (
    emailId: number,
    subject: string,
    content: string,
  ) => void;
  deletePendingEmailById: (emailId: number) => void;
  setIsNoData: (noData: boolean) => void;
  fetchPendingEmailsData: (
    campaignId: number,
    pageSize: number,
    pageNumber: number,
  ) => Promise<CampaignsPendingEmailsResponseData | undefined>;
  setLoading: (loading: boolean) => void;
};

export type PendingApprovalStoreProps = PendingApprovalState &
  PendingApprovalStateStoreActions;

export const usePendingApprovalStore = create<PendingApprovalStoreProps>()(
  (set) => ({
    isNoData: false,
    pageSize: 10,
    pageNumber: 0,
    totalEmails: 0,
    loading: false,
    pendingEmails: [],
    setPendingEmails: (emails) => set(() => ({ pendingEmails: emails })),
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
    setLoading: (loading) => set({ loading }),
    setTotalEmails: (totalEmails) => set({ totalEmails }),
    fetchPendingEmailsData: async (campaignId, pageSize, pageNumber) => {
      try {
        set({ loading: true });
        const { data } = await _fetCampaignPendingEmails(
          campaignId,
          pageSize,
          pageNumber,
        );
        set(() => ({
          isNoData: data.page.totalElements === 0,
          pendingEmails: data.content,
          loading: false,
          totalEmails: data.page.totalElements,
          pageNumber: data.page.number,
        }));
        return data;
      } catch (err) {
        set({ loading: false });
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
  }),
);
