import { create } from 'zustand';
import { CampaignStatusEnum } from '@/types';

export type DialogStoreState = {
  visible: boolean;
  activeStep: number;
  campaignId: number | string | null;
  campaignName: string | null;
  campaignStatus: CampaignStatusEnum;
};

export type DialogStoreActions = {
  open: () => void;
  close: () => void;
  setActiveStep: (activeStep: number) => void;
};

export type DialogStoreProps = DialogStoreState & DialogStoreActions;

export const useDialogStore = create<DialogStoreProps>()((set) => ({
  visible: false,
  activeStep: 1,
  campaignId: '2',
  campaignName: 'name',
  campaignStatus: CampaignStatusEnum.draft,
  setActiveStep: (activeStep) => set({ activeStep }),
  open: () => set({ visible: true }),
  close: () => set({ visible: false }),
}));
