import { create } from 'zustand';
import {
  CampaignLeadItem,
  CampaignStatusEnum,
  HttpError,
  ResponseCampaignChatRecord,
  SetupPhaseEnum,
  SourceEnum,
} from '@/types';

import { SDRToast } from '@/components/atoms';

import { ProcessCreateChatEnum } from '@/types';
import {
  _createCampaign,
  _renameCampaign,
  _updateCampaignProcessSnapshot,
} from '@/request';

export type DialogStoreState = {
  visibleProcess: boolean;
  activeStep: number;
  chatId: string | number;
  returning: boolean;
  chatSSE: EventSource | undefined;
  isFirst: boolean;
  messageList: ResponseCampaignChatRecord[];
  leadsList: CampaignLeadItem[];
  leadsCount: number;
  leadsVisible: boolean;
  creating: boolean;
  campaignId: number | string | null;
  campaignName: string | null;
  campaignStatus: CampaignStatusEnum;
  reloadTable: boolean;
  setupPhase: SetupPhaseEnum;
};

export type DialogStoreActions = {
  openProcess: () => void;
  closeProcess: () => void;
  setActiveStep: (activeStep: number) => void;
  setChatId: (chatId: number | string) => void;
  createChatSSE: (chatId: number | string) => Promise<void>;
  setLeadsList: (leadsList: CampaignLeadItem[]) => void;
  setLeadsCount: (leadsCount: number) => void;
  setReturning: (returning: boolean) => void;
  setLeadsVisible: (leadsVisible: boolean) => void;
  addMessageItem: (message: ResponseCampaignChatRecord) => void;
  createCampaign: () => Promise<void>;

  setMessageList: (messageList: ResponseCampaignChatRecord[]) => void;

  renameCampaign: (name: string) => Promise<void>;

  setCampaignId: (campaignId: number | string) => void;
  setCampaignName: (name: string) => void;
  setCampaignStatus: (status: CampaignStatusEnum) => void;
  setSetupPhase: (phase: SetupPhaseEnum, redirect?: boolean) => Promise<void>;
  resetDialogState: () => void;
  setReloadTable: (reloadTable: boolean) => void;
};

const InitialState: DialogStoreState = {
  visibleProcess: false,
  activeStep: 1,
  chatId: '',
  chatSSE: void 0,
  isFirst: true,
  returning: false,
  messageList: [],
  leadsList: [],
  leadsCount: 0,
  leadsVisible: false,
  creating: false,
  campaignId: '',
  campaignName: 'name',
  campaignStatus: CampaignStatusEnum.draft,
  setupPhase: SetupPhaseEnum.audience,
  reloadTable: false,
};

export type DialogStoreProps = DialogStoreState & DialogStoreActions;

export const useDialogStore = create<DialogStoreProps>()((set, get, store) => ({
  ...InitialState,
  openProcess: () => set({ visibleProcess: true }),
  closeProcess: () => set({ visibleProcess: false }),
  setCampaignName: (name) => set({ campaignName: name }),
  setCampaignStatus: (status) => set({ campaignStatus: status }),
  renameCampaign: async (campaignName) => {
    const { campaignName: current, campaignId } = get();
    if (!campaignId) {
      return;
    }
    set({ campaignName });
    try {
      await _renameCampaign({ campaignId: get().campaignId!, campaignName });
    } catch (err) {
      set({ campaignName: current });
      const { message, header, variant } = err as HttpError;
      SDRToast({
        message,
        header,
        variant,
      });
    }
  },
  setSetupPhase: async (setupPhase, redirect = true) => {
    const { campaignId } = get();
    if (!redirect) {
      set({ setupPhase });
      return;
    }
    if (campaignId) {
      try {
        await _updateCampaignProcessSnapshot({
          campaignId: campaignId,
          setupPhase,
        });
        set({ setupPhase });
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        set({
          activeStep: 1,
          setupPhase: SetupPhaseEnum.audience,
        });
      }
    }
  },
  setMessageList: (messageList) => set({ messageList }),
  setCampaignId: (campaignId) => set({ campaignId }),
  setActiveStep: (activeStep) => {
    set({ activeStep });
  },
  setChatId: (chatId) => set({ chatId }),
  setReturning: (returning) => set({ returning }),
  setLeadsList: (leadsList) => set({ leadsList }),
  setLeadsCount: (leadsCount) => set({ leadsCount }),
  setLeadsVisible: (leadsVisible) => set({ leadsVisible }),
  setReloadTable: (reloadTable) => set({ reloadTable }),
  addMessageItem: (message) => {
    const { messageList } = get();
    messageList.push(message);
    set({ messageList });
  },
  createChatSSE: async (chatId: number | string) => {
    const params = chatId || get().chatId;

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_BASE_URL}/sdr/ai/chat/subscriber/${params}`,
    );

    set({ chatSSE: eventSource });

    eventSource.onmessage = (e) => {
      if (e.data === 'heart-beating:alive' || e.data === 'heartbeat') {
        return;
      }
      const data = JSON.parse(e.data);

      switch (data.step) {
        case ProcessCreateChatEnum.thinking: {
          const { messageList } = get();
          messageList.splice(
            messageList.findIndex((item) => item.isFake),
            1,
          );
          const temp = {
            source: SourceEnum.server,
            id: data.id,
            data: [{ ...data, sort: 1 }],
            message: '',
          };
          get().addMessageItem(temp);
          set({ messageList, returning: true, isFirst: data.isFirst });
          break;
        }
        case ProcessCreateChatEnum.create_plan: {
          const { messageList } = get();
          const target = messageList.find((item) => item.id === data.id);
          if (target) {
            target.data!.push({ ...data, sort: 2 });
          }
          set({ messageList });
          break;
        }
        case ProcessCreateChatEnum.job_title: {
          const { messageList } = get();
          const target = messageList.find((item) => item.id === data.id);
          if (target) {
            target.data!.push({ ...data, sort: 3 });
          }
          set({ messageList });
          break;
        }
        case ProcessCreateChatEnum.job_role: {
          const { messageList } = get();
          const target = messageList.find((item) => item.id === data.id);
          if (target) {
            target.data!.push({ ...data, sort: 4 });
          }
          set({ messageList });
          break;
        }
        case ProcessCreateChatEnum.company_industry: {
          const { messageList } = get();
          const target = messageList.find((item) => item.id === data.id);
          if (target) {
            target.data!.push({ ...data, sort: 5 });
          }
          set({ messageList });
          break;
        }
        case ProcessCreateChatEnum.search: {
          const { messageList } = get();
          const target = messageList.find((item) => item.id === data.id);
          if (target) {
            target.data!.push({ ...data, sort: 6 });
          }
          set({ messageList });
          break;
        }
        case ProcessCreateChatEnum.completed: {
          const { messageList } = get();
          const target = messageList.find((item) => item.id === data.id);
          if (target) {
            target.data!.push({ ...data, sort: 7 });
          }
          set({ messageList, returning: false, isFirst: false });
          break;
        }
        default:
          return data;
      }
    };

    eventSource.onerror = (e) => {
      //eslint-disable-next-line no-console
      console.log(e);
      eventSource.close();
      set({ chatSSE: void 0 });
      throw new Error('SSE connection error');
    };
  },
  createCampaign: async () => {
    const { chatId } = get();
    if (!chatId) {
      return;
    }
    set({ creating: true });
    try {
      const { data } = await _createCampaign({ chatId });
      await _updateCampaignProcessSnapshot({
        campaignId: data.campaignId,
        setupPhase: SetupPhaseEnum.messaging,
      });
      set({
        campaignId: data.campaignId,
        campaignName: data.campaignName,
        campaignStatus: data.campaignStatus,
        setupPhase: SetupPhaseEnum.messaging,
      });
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      set({ creating: false, activeStep: 2, reloadTable: true });
    }
  },
  resetDialogState: () => {
    get().chatSSE?.close();
    set({ ...store.getInitialState(), messageList: [] }, true);
  },
}));
