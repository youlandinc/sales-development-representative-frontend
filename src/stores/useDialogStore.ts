import { create } from 'zustand';
import { CampaignStatusEnum } from '@/types';

export type DialogStoreState = {
  visible: boolean;
  activeStep: number;
  chatId: string | number;
  campaignId: number | string | null;
  campaignName: string | null;
  campaignStatus: CampaignStatusEnum;
};

export type DialogStoreActions = {
  open: () => void;
  close: () => void;
  setActiveStep: (activeStep: number) => void;
  resetDialogState: () => void;
};

const InitialState: DialogStoreState = {
  visible: false,
  activeStep: 1,
  chatId: '',
  campaignId: '',
  campaignName: 'name',
  campaignStatus: CampaignStatusEnum.draft,
};

export type DialogStoreProps = DialogStoreState & DialogStoreActions;

export const useDialogStore = create<DialogStoreProps>()((set, get) => ({
  ...InitialState,
  open: () => set({ visible: true }),
  close: () => set({ visible: false }),
  setActiveStep: (activeStep) => set({ activeStep }),
  resetDialogState: () => set(InitialState),
}));
