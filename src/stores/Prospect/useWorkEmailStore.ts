import { create } from 'zustand';

import { SDRToast } from '@/components/atoms';

import { _fetchAllActionsList } from '@/request/enrichments/suggestions';

import {
  IntegrationAction,
  IntegrationActionType,
} from '@/types/Prospect/tableActions';
import { HttpError } from '@/types';

type WorkEmailStoreProps = {
  workEmailVisible: boolean;
  dialogIntegrationsVisible: boolean;
  displayType: 'main' | 'integration';
  allIntegrations: IntegrationAction[];
  selectedIntegration: IntegrationAction | null;
};

type WorkEmailStoreActions = {
  setWorkEmailVisible: (open: boolean) => void;
  setDialogIntegrationsVisible: (open: boolean) => void;
  setDisplayType: (type: 'main' | 'integration') => void;
  // setAllIntegrations: (integrations: FetchAllActionsListResponse[]) => void;
  setSelectedIntegration: (integration: IntegrationAction | null) => void;
  fetchIntegrations: () => Promise<void>;
};

export const useWorkEmailStore = create<
  WorkEmailStoreProps & WorkEmailStoreActions
>((set) => ({
  displayType: 'main',
  workEmailVisible: false,
  dialogIntegrationsVisible: false,
  allIntegrations: [],
  selectedIntegration: null,
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
  setDisplayType: (type: 'main' | 'integration') => {
    set({
      displayType: type,
    });
  },
  setSelectedIntegration: (integration: IntegrationAction | null) => {
    set({
      selectedIntegration: integration,
    });
  },
  fetchIntegrations: async () => {
    try {
      const res = await _fetchAllActionsList(IntegrationActionType.work_email);
      if (Array.isArray(res.data)) {
        set({
          allIntegrations: res.data,
        });
      }
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
}));
