import { create } from 'zustand';
import {
  AIModelEnum,
  CampaignLeadItem,
  CampaignStatusEnum,
  CRMInfo,
  FileInfo,
  HttpError,
  ProcessCreateChatEnum,
  ProcessCreateTypeEnum,
  ResponseCampaignChatRecord,
  ResponseCampaignFilterFormData,
  ResponseCampaignLaunchInfo,
  ResponseCampaignMessagingStep,
  ResponseOfferOption,
  SavedListInfo,
  SetupPhaseEnum,
  SourceEnum,
} from '@/types';

import { SDRToast } from '@/components/atoms';
import {
  _closeSSE,
  _createCampaign,
  _fetchCrmProviderList,
  _fetchEnrichmentTableData,
  _fetchSegmentOptions,
  _renameCampaign,
  _updateCampaignProcessSnapshot,
} from '@/request';

export type DialogStoreState = {
  detailsFetchLoading: boolean;
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
  aiModel: AIModelEnum;

  filterFormData: ResponseCampaignFilterFormData;
  csvFormData: FileInfo;
  crmFormData: CRMInfo;
  fetchProviderOptionsLoading: boolean;
  providerOptions: TOption[];
  savedListFormData: SavedListInfo;
  fetchSavedListLoading: boolean;
  savedListOptions: TOption[];

  selectedEnrichmentTableId: string;
  fetchEnrichmentTableLoading: boolean;
  enrichmentTableOptions: TOption[];
  enrichmentTableDisabled: boolean;

  createCampaignErrorMessage: string;

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
  setDetailsFetchLoading: (detailsFetchLoading: boolean) => void;
  setAiModel: (aiModel: AIModelEnum) => void;
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

  setFilterFormData: (formData: ResponseCampaignFilterFormData) => void;
  setCSVFormData: (formData: FileInfo) => void;

  setCRMFormData: (formData: CRMInfo) => void;
  fetchProviderOptions: () => Promise<void>;

  setSavedListFormData: (formData: SavedListInfo) => void;
  fetchSavedListOptions: () => Promise<void>;

  fetchEnrichmentTableData: () => Promise<void>;
  setSelectedEnrichmentTableId: (id: string) => void;
  setEnrichmentTableDisabled: (disabled: boolean) => void;

  setCreateCampaignErrorMessage: (errorMessage: string) => void;

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
  detailsFetchLoading: false,
  aiModel: AIModelEnum.open_ai,
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

  filterFormData: {
    jobTitle: [],
    universityName: [],
    companyHeadcount: {
      selectValue: '',
      inputValue: '',
    },
    industry: [],
    currentCompany: [],
    personLocation: [],
    companyRevenue: {
      selectValue: '',
      inputValue: '',
    },
    skills: [],
    excludeSkill: [],
  },

  csvFormData: {
    url: '',
    originalFileName: '',
    fileName: '',
  },

  crmFormData: {
    listId: '',
    provider: '',
  },
  providerOptions: [],
  fetchProviderOptionsLoading: false,

  savedListFormData: {
    listId: '',
    name: '',
  },
  fetchSavedListLoading: false,
  savedListOptions: [],

  fetchEnrichmentTableLoading: false,
  enrichmentTableOptions: [],
  selectedEnrichmentTableId: '',
  enrichmentTableDisabled: false,

  createCampaignErrorMessage: '',

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
    // sender: null,
    // senderName: null,
    // signatureId: null,
    emilProfileId: null,
  },

  reloadTable: false,
  isValidate: undefined,
};

export type DialogStoreProps = DialogStoreState & DialogStoreActions;

export const useDialogStore = create<DialogStoreProps>()((set, get, store) => ({
  ...InitialState,
  setSavedListFormData: (formData: SavedListInfo) => {
    set({ savedListFormData: formData });
  },
  setAiModel: (aiModel: AIModelEnum) => set({ aiModel }),
  setDetailsFetchLoading: (detailsFetchLoading) => set({ detailsFetchLoading }),
  setCRMFormData: (formData: CRMInfo) => set({ crmFormData: formData }),
  setCSVFormData: (formData: FileInfo) => set({ csvFormData: formData }),
  setFilterFormData: (formData) => set({ filterFormData: formData }),
  setIsFirst: (isFirst) => set({ isFirst }),
  setLeadsFetchLoading: (leadsFetchLoading) => set({ leadsFetchLoading }),
  setCampaignType: (campaignType: ProcessCreateTypeEnum) =>
    set({ campaignType, activeStep: 1 }),
  setIsValidate: (isValidate: undefined | boolean) => set({ isValidate }),
  setOfferOptions: (offerOptions) => set({ offerOptions }),
  setLunchInfo: (lunchInfo: ResponseCampaignLaunchInfo) => set({ lunchInfo }),
  openProcess: () => set({ visibleProcess: true }),
  closeProcess: () =>
    set({
      visibleProcess: false,
      selectedEnrichmentTableId: '',
      enrichmentTableDisabled: false,
      createCampaignErrorMessage: '',
    }),
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
        set({ setupPhase, reloadTable: true });
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
  setActiveStep: (activeStep) => set({ activeStep }),
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
    const existingSSE = get().chatSSE;
    if (existingSSE) {
      existingSSE.close();
    }
    const params = chatId || get().chatId;

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_BASE_URL}/sdr/ai/chat/subscriber/${params}`,
    );

    if (!eventSource) {
      return;
    }

    set({ chatSSE: eventSource });

    const { chatSSE } = get();

    eventSource.onmessage = (e) => {
      if (e.data === 'heart-beating:alive' || e.data === 'heartbeat') {
        return;
      }
      const data = JSON.parse(e.data);

      switch (data.step) {
        case ProcessCreateChatEnum.thinking: {
          const { messageList } = get();
          const fakeIndex = messageList.findIndex((item) => item.isFake);
          if (fakeIndex !== -1) {
            messageList.splice(fakeIndex, 1);
          }
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
      if (eventSource.readyState === EventSource.CLOSED) {
        setTimeout(() => get().createChatSSE(chatId), 3000);
      }
    };
  },
  createCampaign: async () => {
    const { campaignType } = get();
    let postData;
    switch (campaignType) {
      case ProcessCreateTypeEnum.agent: {
        const { chatId } = get();
        if (!chatId) {
          return;
        }
        postData = {
          startingPoint: ProcessCreateTypeEnum.agent,
          data: {
            chatId,
          },
        };
        break;
      }
      case ProcessCreateTypeEnum.filter: {
        const { filterFormData } = get();
        postData = {
          startingPoint: ProcessCreateTypeEnum.filter,
          data: {
            conditions: filterFormData,
          },
        };
        break;
      }
      case ProcessCreateTypeEnum.csv: {
        const { csvFormData } = get();
        postData = {
          startingPoint: ProcessCreateTypeEnum.csv,
          data: {
            fileInfo: csvFormData,
          },
        };
        break;
      }
      case ProcessCreateTypeEnum.crm: {
        const { crmFormData } = get();
        postData = {
          startingPoint: ProcessCreateTypeEnum.crm,
          data: {
            ...crmFormData,
          },
        };
        break;
      }
      case ProcessCreateTypeEnum.saved_list: {
        const { savedListFormData } = get();
        postData = {
          startingPoint: ProcessCreateTypeEnum.saved_list,
          data: {
            ...savedListFormData,
          },
        };
        break;
      }
      case ProcessCreateTypeEnum.ai_table: {
        postData = {
          startingPoint: ProcessCreateTypeEnum.ai_table,
          data: {
            tableId: get().selectedEnrichmentTableId,
          },
        };
        break;
      }
    }
    if (!postData) {
      return;
    }
    set({ creating: true, createCampaignErrorMessage: '' });
    try {
      const { data } = await _createCampaign(postData);
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
        chatId: data.chatId,
        activeStep: 2,
      });
      switch (campaignType) {
        case ProcessCreateTypeEnum.filter: {
          set({
            filterFormData: data.data.conditions,
          });
          break;
        }
        case ProcessCreateTypeEnum.csv: {
          set({
            csvFormData: data.data.fileInfo,
          });
          break;
        }
        case ProcessCreateTypeEnum.crm: {
          set({
            crmFormData: data.data.crmInfo,
          });
        }
      }
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      campaignType === ProcessCreateTypeEnum.ai_table &&
        set({ createCampaignErrorMessage: message || 'Error' });
      campaignType !== ProcessCreateTypeEnum.ai_table &&
        SDRToast({ message, header, variant });
    } finally {
      set({ creating: false, /*activeStep: 2,*/ reloadTable: true });
    }
  },
  fetchProviderOptions: async () => {
    if (get().fetchProviderOptionsLoading || get().providerOptions.length > 0) {
      return;
    }
    set({ fetchProviderOptionsLoading: true });
    try {
      const { data } = await _fetchCrmProviderList();
      const reducedData = data.map((item) => ({
        label: item.crmName,
        value: item.provider,
        key: item.id,
        disabled: !item.connected,
      }));
      set({ providerOptions: reducedData });
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      set({ fetchProviderOptionsLoading: false });
    }
  },
  fetchSavedListOptions: async () => {
    if (get().fetchSavedListLoading || get().savedListOptions.length > 0) {
      return;
    }
    set({ fetchSavedListLoading: true });
    try {
      const { data } = await _fetchSegmentOptions(1);
      const reducedData = data.map((item) => ({
        label: item.name,
        value: item.id,
        key: item.id,
      }));
      set({ savedListOptions: reducedData });
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      set({ fetchSavedListLoading: false });
    }
  },
  fetchEnrichmentTableData: async () => {
    set({ fetchEnrichmentTableLoading: true });
    try {
      const { data } = await _fetchEnrichmentTableData();
      const reducedData = data.content.map((item) => ({
        label: item.tableName,
        value: item.tableId,
        key: item.tableId,
      }));
      set({ enrichmentTableOptions: reducedData });
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      set({ fetchEnrichmentTableLoading: false });
    }
  },
  setSelectedEnrichmentTableId: (id: string) =>
    set({ selectedEnrichmentTableId: id }),
  setEnrichmentTableDisabled: (disabled: boolean) =>
    set({ enrichmentTableDisabled: disabled }),
  setCreateCampaignErrorMessage: (errorMessage: string) =>
    set({ createCampaignErrorMessage: errorMessage }),
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
        savedListOptions: [],
        providerOptions: [],
        messageList: [],
        lunchInfo: {
          dailyLimit: 100,
          autopilot: false,
          sendNow: false,
          scheduleTime: null,
          // sender: null,
          // senderName: null,
          // signatureId: null,
          emilProfileId: null,
        },
      },
      true,
    );
  },
}));
