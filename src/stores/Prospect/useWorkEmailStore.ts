import { create } from 'zustand';

import { SDRToast } from '@/components/atoms';

import { _fetchAllActionsList } from '@/request/enrichments/suggestions';

import {
  DisplayTypeEnum,
  IntegrationAction,
  IntegrationActionType,
  WaterfallConfigTypeEnum,
} from '@/types/Prospect/tableActions';
import { HttpError } from '@/types';

type WorkEmailStoreProps = {
  workEmailVisible: boolean;
  dialogIntegrationsVisible: boolean;
  displayType: DisplayTypeEnum;
  allIntegrations: IntegrationAction[];
  selectedIntegration: IntegrationAction | null;
  selectedIntegrationToConfig: IntegrationAction | null;
  waterfallConfigType: WaterfallConfigTypeEnum;
};

type WorkEmailStoreActions = {
  setWorkEmailVisible: (open: boolean) => void;
  setDialogIntegrationsVisible: (open: boolean) => void;
  setDisplayType: (type: DisplayTypeEnum) => void;
  setSelectedIntegration: (integration: IntegrationAction | null) => void;
  setSelectedIntegrationToConfig: (
    integration: IntegrationAction | null,
  ) => void;
  setAllIntegrations: (integrations: IntegrationAction[]) => void;
  setWaterfallConfigType: (type: WaterfallConfigTypeEnum) => void;
  fetchIntegrations: () => Promise<void>;
};

export const useWorkEmailStore = create<
  WorkEmailStoreProps & WorkEmailStoreActions
>((set) => ({
  displayType: DisplayTypeEnum.main,
  waterfallConfigType: WaterfallConfigTypeEnum.setup,
  workEmailVisible: false,
  dialogIntegrationsVisible: false,
  allIntegrations: [],
  selectedIntegration: null,
  selectedIntegrationToConfig: null,
  setAllIntegrations: (integrations: IntegrationAction[]) => {
    set({
      allIntegrations: integrations,
    });
  },
  setWorkEmailVisible: (open: boolean) => {
    set({
      workEmailVisible: open,
    });
  },
  setDialogIntegrationsVisible: (open: boolean) => {
    set({
      dialogIntegrationsVisible: open,
    });
  },
  setDisplayType: (type: DisplayTypeEnum) => {
    set({
      displayType: type,
    });
  },
  setSelectedIntegration: (integration: IntegrationAction | null) => {
    set({
      selectedIntegration: integration,
    });
  },
  setSelectedIntegrationToConfig: (integration: IntegrationAction | null) => {
    set({
      selectedIntegrationToConfig: integration,
    });
  },
  setWaterfallConfigType: (type: WaterfallConfigTypeEnum) => {
    set({
      waterfallConfigType: type,
    });
  },
  fetchIntegrations: async () => {
    try {
      const res = await _fetchAllActionsList(IntegrationActionType.work_email);
      if (Array.isArray(res.data)) {
        set({
          allIntegrations: res.data.map((i) => ({
            ...i,
            skipped: false,
          })),
        });
      }
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
}));
