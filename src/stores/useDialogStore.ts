import { create } from 'zustand';
import {
  CampaignLeadItem,
  CampaignStatusEnum,
  HttpError,
  ProcessCreateTypeEnum,
  ResponseCampaignChatRecord,
  ResponseCampaignLaunchInfo,
  ResponseCampaignMessagingStep,
  ResponseOfferOption,
  SetupPhaseEnum,
  SourceEnum,
} from '@/types';

import { SDRToast } from '@/components/atoms';

import { ProcessCreateChatEnum } from '@/types';
import {
  _closeSSE,
  _createCampaign,
  _renameCampaign,
  _updateCampaignProcessSnapshot,
} from '@/request';

export type DialogStoreState = {
  campaignType: ProcessCreateTypeEnum | undefined;
  reloadTable: boolean;
  visibleProcess: boolean;
  activeStep: number;
  chatId: string | number;
  chatSSE: EventSource | undefined;
  isFirst: boolean;
  creating: boolean;
  returning: boolean;
  messageList: ResponseCampaignChatRecord[];
  leadsFetchLoading: boolean;
  leadsList: CampaignLeadItem[];
  leadsCount: number;
  leadsVisible: boolean;

  campaignId: number | string | null;
  campaignName: string | null;
  campaignStatus: CampaignStatusEnum;
  setupPhase: SetupPhaseEnum;

  offerOptions: ResponseOfferOption[];

  messagingSteps: ResponseCampaignMessagingStep[];

  lunchInfo: ResponseCampaignLaunchInfo;
  isValidate: boolean | undefined;
};

export type DialogStoreActions = {
  setCampaignType: (campaignType: ProcessCreateTypeEnum) => void;
  openProcess: () => void;
  closeProcess: () => void;
  setActiveStep: (activeStep: number) => void;
  setChatId: (chatId: number | string) => void;
  setReturning: (returning: boolean) => void;
  createChatSSE: (chatId: number | string) => Promise<void>;
  addMessageItem: (message: ResponseCampaignChatRecord) => void;
  createCampaign: () => Promise<void>;

  setIsFirst: (isFirst: boolean) => void;

  setLeadsList: (leadsList: CampaignLeadItem[]) => void;
  setLeadsCount: (leadsCount: number) => void;
  setLeadsVisible: (leadsVisible: boolean) => void;
  setLeadsFetchLoading: (leadsFetchLoading: boolean) => void;

  setMessageList: (messageList: ResponseCampaignChatRecord[]) => void;

  renameCampaign: (name: string) => Promise<void>;

  setCampaignId: (campaignId: number | string) => void;
  setCampaignName: (name: string) => void;
  setCampaignStatus: (status: CampaignStatusEnum) => void;
  setSetupPhase: (phase: SetupPhaseEnum, redirect?: boolean) => Promise<void>;
  setReloadTable: (reloadTable: boolean) => void;
  setMessagingSteps: (messagingSteps: ResponseCampaignMessagingStep[]) => void;

  setLunchInfo: (lunchInfo: ResponseCampaignLaunchInfo) => void;
  setIsValidate: (isValidate: boolean | undefined) => void;

  setOfferOptions: (offerOptions: ResponseOfferOption[]) => void;

  resetDialogState: () => Promise<void>;
};

const InitialState: DialogStoreState = {
  campaignType: void 0,
  campaignId: '',
  campaignName: 'name',
  campaignStatus: CampaignStatusEnum.draft,
  setupPhase: SetupPhaseEnum.audience,
  activeStep: 0,

  visibleProcess: false,

  chatId: '',
  chatSSE: void 0,
  messageList: [],

  isFirst: true,
  returning: false,

  creating: false,

  leadsFetchLoading: false,
  leadsList: [],
  leadsCount: 0,
  leadsVisible: false,

  messagingSteps: [],

  offerOptions: [],

  lunchInfo: {
    dailyLimit: 100,
    autopilot: false,
    sendNow: false,
    scheduleTime: null,
    sender: null,
    replyTo: null,
    senderName: null,
  },

  reloadTable: false,
  isValidate: undefined,
};

export type DialogStoreProps = DialogStoreState & DialogStoreActions;

export const useDialogStore = create<DialogStoreProps>()((set, get, store) => ({
  ...InitialState,
  setIsFirst: (isFirst) => set({ isFirst }),
  setLeadsFetchLoading: (leadsFetchLoading) => set({ leadsFetchLoading }),
  setCampaignType: (campaignType: ProcessCreateTypeEnum) =>
    set({ campaignType, activeStep: 1 }),
  setIsValidate: (isValidate: undefined | boolean) => {
    set({ isValidate });
  },
  setOfferOptions(offerOptions) {
    set({ offerOptions });
  },
  setLunchInfo: (lunchInfo: ResponseCampaignLaunchInfo) => set({ lunchInfo }),
  openProcess: () => set({ visibleProcess: true }),
  closeProcess: () => set({ visibleProcess: false }),
  setCampaignName: (name) => set({ campaignName: name }),
  setCampaignStatus: (status) => set({ campaignStatus: status }),
  renameCampaign: async (campaignName) => {
    const { campaignName: current, campaignId } = get();
    if (!campaignId) {
      return;
    }
    set({ campaignName: campaignName || 'Untitled Campaign' });
    try {
      await _renameCampaign({
        campaignId: get().campaignId!,
        campaignName: campaignName || 'Untitled Campaign',
      });
      set({ reloadTable: true });
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

    const initialSSE = () => {
      return new EventSource(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sdr/ai/chat/subscriber/${params}`,
      );
    };

    const eventSource = initialSSE();

    if (!eventSource) {
      return;
    }

    set({ chatSSE: eventSource });

    const { chatSSE } = get();

    chatSSE!.onmessage = (e) => {
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
            data: [data],
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
            target.data!.push(data);
          }
          set({ messageList });
          break;
        }
        case ProcessCreateChatEnum.search: {
          const { messageList } = get();
          const target = messageList.find((item) => item.id === data.id);
          if (target) {
            target.data!.push(data);
          }
          set({ messageList });
          break;
        }
        case ProcessCreateChatEnum.completed: {
          const { messageList } = get();
          const target = messageList.find((item) => item.id === data.id);
          if (target) {
            target.data!.push(data);
          }
          set({ messageList, returning: false, isFirst: false });
          break;
        }
        default: {
          const { messageList } = get();
          const target = messageList.find((item) => item.id === data.id);
          if (target) {
            target.data!.push(data);
          }
          set({ messageList, returning: false });
          break;
        }
      }
    };

    chatSSE!.onerror = async () => {
      if (chatSSE?.readyState === EventSource.CLOSED) {
        const retriedSSE = initialSSE();
        eventSource.close();
        set({ chatSSE: retriedSSE });
      }
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
        messagingSteps: data.data.steps,
        lunchInfo: data.data.launchInfo,
        offerOptions: data.data.offerOptions,
      });
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      set({ creating: false, activeStep: 2, reloadTable: true });
    }
  },
  setMessagingSteps: (messagingSteps) => set({ messagingSteps }),
  resetDialogState: async () => {
    const { chatSSE, chatId } = get();
    if (chatSSE?.readyState === 1) {
      chatSSE?.close();
      await _closeSSE(chatId);
    }
    set(
      {
        ...store.getInitialState(),
        messageList: [],
        lunchInfo: {
          dailyLimit: 100,
          autopilot: false,
          sendNow: false,
          scheduleTime: null,
          sender: null,
          replyTo: null,
          senderName: null,
        },
      },
      true,
    );
  },
}));
