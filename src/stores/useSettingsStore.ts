import { create } from 'zustand';

import { EmailDomainDetails, HttpError, Mailbox } from '@/types';

import { SDRToast } from '@/components/atoms';

import {
  _fetchCustomEmailDomains,
  _fetchEmailSignatures,
  _fetchMailboxes,
} from '@/request';

interface SignatureInfo {
  name: string;
  content: string;
  id: number;
}
export interface SettingsStoreState {
  signatures: SignatureInfo[];
  fetchSignatureLoading: boolean;
  emailDomainList: EmailDomainDetails[];
  mailboxes: Mailbox[];
}

export type SettingsStoreStateActions = {
  fetchSignatures: () => Promise<void>;
  fetchEmailDomainList: (tenantId: string) => Promise<void>;
  fetchMailboxes: () => Promise<void>;
};

export type SettingsStoreProps = SettingsStoreState & SettingsStoreStateActions;

const initialState: SettingsStoreState = {
  signatures: [],
  fetchSignatureLoading: false,
  emailDomainList: [],
  mailboxes: [],
};

export const useSettingsStore = create<SettingsStoreProps>()((set) => ({
  ...initialState,
  fetchSignatures: async () => {
    try {
      set({ fetchSignatureLoading: true });
      const res = await _fetchEmailSignatures();
      if (Array.isArray(res.data)) {
        set({ signatures: res.data });
      }
    } catch (e) {
      const { message, header, variant } = e as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      set({ fetchSignatureLoading: false });
    }
  },
  fetchEmailDomainList: async (tenantId: string) => {
    try {
      const { data } = await _fetchCustomEmailDomains(tenantId);
      set({ emailDomainList: data });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
  fetchMailboxes: async () => {
    try {
      const { data } = await _fetchMailboxes();
      set({ mailboxes: data });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
}));
