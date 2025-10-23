import { create } from 'zustand';

import { HttpError } from '@/types';

import { SDRToast } from '@/components/atoms';

import { _fetchEmailSignatures } from '@/request';

interface SignatureInfo {
  name: string;
  content: string;
  id: number;
}
export interface SettingsStoreState {
  signatures: SignatureInfo[];
  fetchSignatureLoading: boolean;
}

export type SettingsStoreStateActions = {
  fetchSignatures: () => Promise<void>;
};

export type SettingsStoreProps = SettingsStoreState & SettingsStoreStateActions;

export const useSettingsStore = create<SettingsStoreProps>()((set) => ({
  signatures: [],
  fetchSignatureLoading: false,
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
}));
