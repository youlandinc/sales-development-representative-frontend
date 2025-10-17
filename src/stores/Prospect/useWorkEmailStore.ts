import { create } from 'zustand';

import { SDRToast } from '@/components/atoms';

import { _fetchAllActionsList } from '@/request/enrichments/suggestions';

import { HttpError } from '@/types';
import {
  DisplayTypeEnum,
  IntegrationAction,
  IntegrationActionType,
  WaterfallConfigTypeEnum,
} from '@/types/Prospect';

type WorkEmailStoreProps = {
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
  fetchIntegrations: (
    editParam?: (Pick<IntegrationAction, 'actionKey'> & {
      inputParams: {
        name: string;
        selectedOption: TOption;
      }[];
    })[],
  ) => Promise<void>;
};

export const useWorkEmailStore = create<
  WorkEmailStoreProps & WorkEmailStoreActions
>((set, get) => ({
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
  fetchIntegrations: async (
    editParam?: (Pick<IntegrationAction, 'actionKey'> & {
      inputParams: {
        name: string;
        selectedOption: TOption;
      }[];
    })[],
  ) => {
    // reset integrations
    set({
      allIntegrations: [],
      waterfallConfigType: WaterfallConfigTypeEnum.setup,
    });
    try {
      const res = await _fetchAllActionsList(get().integrationActionType);
      if (Array.isArray(res.data)) {
        if (editParam) {
          set({
            allIntegrations: res.data.map((i) => {
              const editItem = editParam.find(
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
                  skipped: false,
                };
              }
              return {
                ...i,
                isDefault: false,
                skipped: false,
              };
            }),
          });
          return;
        }
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
