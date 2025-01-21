import { create } from 'zustand';
import { CampaignLeadItem, CampaignStatusEnum } from '@/types';
import {
  ProcessCreateChatEnum,
  ResponseCampaignProcessChatServer,
} from '@/types/Campaign/processCreate';

export type DialogStoreState = {
  visible: boolean;
  activeStep: number;
  chatId: string | number;
  campaignId: number | string | null;
  returning: boolean;
  chatSSE: EventSource | undefined;
  isFirst: boolean;
  messageList: {
    source: string;
    id?: string | number;
    message?: string;
    data?: ResponseCampaignProcessChatServer[];
    isFake?: boolean;
  }[];
  leadsList: CampaignLeadItem[];
  leadsCount: number;
  leadsVisible: boolean;
  campaignName: string | null;
  campaignStatus: CampaignStatusEnum;
};

export type DialogStoreActions = {
  open: () => void;
  close: () => void;
  setActiveStep: (activeStep: number) => void;
  setChatId: (chatId: number | string) => void;
  createChatSSE: (chatId: number | string) => Promise<void>;
  setLeadsList: (leadsList: CampaignLeadItem[]) => void;
  setLeadsCount: (leadsCount: number) => void;
  setReturning: (returning: boolean) => void;
  setLeadsVisible: (leadsVisible: boolean) => void;
  addMessageItem: (message: {
    source: string;
    id?: string | number;
    message?: string;
    data?: ResponseCampaignProcessChatServer[];
    isFake?: boolean;
  }) => void;
  resetDialogState: () => void;
};

const InitialState: DialogStoreState = {
  visible: false,
  activeStep: 1,
  chatId: '',
  chatSSE: void 0,
  isFirst: true,
  returning: false,
  messageList: [],
  leadsList: [],
  leadsCount: 0,
  leadsVisible: false,
  campaignId: '',
  campaignName: 'name',
  campaignStatus: CampaignStatusEnum.draft,
};

export type DialogStoreProps = DialogStoreState & DialogStoreActions;

export const useDialogStore = create<DialogStoreProps>()((set, get, store) => ({
  ...InitialState,
  open: () => set({ visible: true }),
  close: () => set({ visible: false }),
  setActiveStep: (activeStep) => set({ activeStep }),
  setChatId: (chatId) => set({ chatId }),
  setReturning: (returning) => set({ returning }),
  setLeadsList: (leadsList) => set({ leadsList }),
  setLeadsCount: (leadsCount) => set({ leadsCount }),
  setLeadsVisible: (leadsVisible) => set({ leadsVisible }),
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
            source: 'server',
            id: data.id,
            data: [{ ...data, sort: 1 }],
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
  resetDialogState: () => {
    get().chatSSE?.close();
    set({ ...store.getInitialState(), messageList: [] }, true);
  },
}));
