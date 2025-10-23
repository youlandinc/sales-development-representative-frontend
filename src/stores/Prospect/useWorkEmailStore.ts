import { create } from 'zustand';

import { SDRToast } from '@/components/atoms';

import { useProspectTableStore } from '@/stores/Prospect';

import { _fetchAllActionsList } from '@/request/enrichments/integrations';

import { ActiveTypeEnum, HttpError } from '@/types';

import {
  DisplayTypeEnum,
  IntegrationAction,
  IntegrationActionType,
  WaterfallConfigTypeEnum,
} from '@/types/Prospect';

interface EditWaterfallConfig
  extends Pick<IntegrationAction, 'actionKey' | 'skipped'> {
  inputParams: {
    name: string;
    selectedOption: TOption;
  }[];
}

interface EditConfigParams {
  groupId: string;
  waterfallConfigs: EditWaterfallConfig[];
}

type WorkEmailStoreProps = {
  activeType: ActiveTypeEnum;
  editConfigParams: EditConfigParams | null;
  dialogHeaderName: string;
  integrationActionType: IntegrationActionType;
  waterfallDescription: string;
  workEmailVisible: boolean;
  dialogIntegrationsVisible: boolean;
  displayType: DisplayTypeEnum;
  allIntegrations: IntegrationAction[];
  selectedIntegration: IntegrationAction | null;
  selectedIntegrationToConfig: IntegrationAction | null;
  waterfallConfigType: WaterfallConfigTypeEnum;
  isValidatedInputParams: boolean;
};

type WorkEmailStoreActions = {
  setActiveType: (type: ActiveTypeEnum) => void;
  setWorkEmailVisible: (open: boolean) => void;
  setIntegrationActionType: (type: IntegrationActionType) => void;
  setDialogIntegrationsVisible: (open: boolean) => void;
  setDisplayType: (type: DisplayTypeEnum) => void;
  setDialogHeaderName: (name: string) => void;
  setWaterfallDescription: (description: string) => void;
  setSelectedIntegration: (integration: IntegrationAction | null) => void;
  setSelectedIntegrationToConfig: (
    integration: IntegrationAction | null,
  ) => void;
  setAllIntegrations: (integrations: IntegrationAction[]) => void;
  setWaterfallConfigType: (type: WaterfallConfigTypeEnum) => void;
  setIsValidatedInputParams: (isValidated: boolean) => void;
  setEditConfigParams: (params: EditConfigParams | null) => void;
  fetchIntegrations: () => Promise<void>;
};

export const useWorkEmailStore = create<
  WorkEmailStoreProps & WorkEmailStoreActions
>((set, get) => ({
  activeType: ActiveTypeEnum.add,
  editConfigParams: null,
  dialogHeaderName: '',
  integrationActionType: IntegrationActionType.work_email,
  waterfallDescription: '',
  displayType: DisplayTypeEnum.main,
  isValidatedInputParams: false,
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
  setActiveType: (type: ActiveTypeEnum) => {
    set({
      activeType: type,
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
  setIsValidatedInputParams: (isValidated: boolean) => {
    set({
      isValidatedInputParams: isValidated,
    });
  },
  setDialogHeaderName: (name: string) => {
    set({
      dialogHeaderName: name,
    });
  },
  setEditConfigParams: (params: EditConfigParams | null) => {
    set({
      editConfigParams: params,
    });
  },
  setWaterfallDescription: (description: string) => {
    set({
      waterfallDescription: description,
    });
  },
  setIntegrationActionType: (type: IntegrationActionType) => {
    set({
      integrationActionType: type,
    });
  },
  fetchIntegrations: async () => {
    // reset integrations
    set({
      allIntegrations: [],
      waterfallConfigType: WaterfallConfigTypeEnum.setup,
    });
    try {
      const res = await _fetchAllActionsList(get().integrationActionType);
      if (Array.isArray(res.data)) {
        if (get().editConfigParams) {
          const editParam = get().editConfigParams?.waterfallConfigs;
          set({
            allIntegrations: res.data.map((i) => {
              const editItem = editParam?.find(
                (item) => item.actionKey === i.actionKey,
              );
              if (editItem) {
                return {
                  ...i,
                  inputParams: i.inputParams.map((p) => ({
                    ...p,
                    ...editItem.inputParams.find(
                      (item) => item.name === p.columnName,
                    ),
                  })),
                  isDefault: true,
                  skipped: editItem?.skipped || false,
                };
              }
              return {
                ...i,
                isDefault: false,
              };
            }),
          });
          return;
        }
        set({
          allIntegrations: res.data.map((i) => ({
            ...i,
            inputParams: i.inputParams.map((p) => {
              const column = useProspectTableStore
                .getState()
                .columns.find((c) => c.semanticType === p.semanticType);
              return {
                ...p,
                selectedOption: column?.fieldId
                  ? {
                      label: column?.fieldName || '',
                      value: column?.fieldId || '',
                      key: column?.fieldId || '',
                    }
                  : null,
              };
            }),
          })),
        });
      }
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
}));
