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
  updateIntegrationsOrder: (integrations: IntegrationAction[]) => void;
  addIntegrationToDefault: (integration: IntegrationAction) => void;
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
  addIntegrationToDefault: (integration: IntegrationAction) => {
    const { allIntegrations } = get();

    // 查找要添加的集成
    const integrationToAdd = allIntegrations.find(
      (i) => i.actionKey === integration.actionKey,
    );

    if (!integrationToAdd) {
      return;
    }

    // 获取当前所有默认集成
    const defaultIntegrations = allIntegrations.filter((i) => i.isDefault);
    const nonDefaultIntegrations = allIntegrations.filter((i) => !i.isDefault);

    // 从非默认列表中移除要添加的集成
    const updatedNonDefault = nonDefaultIntegrations.filter(
      (i) => i.actionKey !== integration.actionKey,
    );

    // 创建要添加的集成的更新版本
    const updatedIntegration = {
      ...integrationToAdd,
      isDefault: true,
    };

    // 更新 allIntegrations，将新集成添加到默认列表末尾
    set({
      allIntegrations: [
        ...defaultIntegrations,
        updatedIntegration,
        ...updatedNonDefault,
      ],
    });
  },
  updateIntegrationsOrder: (sortedIntegrations: IntegrationAction[]) => {
    const { allIntegrations, editConfigParams } = get();

    // 获取当前所有默认和非默认集成
    const currentDefaultIntegrations = allIntegrations.filter(
      (i) => i.isDefault,
    );
    const nonDefaultIntegrations = allIntegrations.filter((i) => !i.isDefault);

    // 创建一个映射，记录排序后的集成的顺序
    const sortedMap = new Map(
      sortedIntegrations.map((integration, index) => [
        integration.actionKey,
        index,
      ]),
    );

    // 按照排序后的顺序重新排列 defaultIntegrations
    const sortedDefaultIntegrations = [...currentDefaultIntegrations].sort(
      (a, b) => {
        const indexA = sortedMap.get(a.actionKey);
        const indexB = sortedMap.get(b.actionKey);

        // 如果两个项都在排序列表中，按照排序列表的顺序排序
        if (indexA !== undefined && indexB !== undefined) {
          return indexA - indexB;
        }

        // 如果只有一个项在排序列表中，将不在列表中的项放在后面
        if (indexA !== undefined) {
          return -1;
        }
        if (indexB !== undefined) {
          return 1;
        }

        // 如果两个项都不在排序列表中，保持原顺序
        return 0;
      },
    );

    // 更新 allIntegrations
    set({
      allIntegrations: [
        ...sortedDefaultIntegrations,
        ...nonDefaultIntegrations,
      ],
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

          // 创建一个映射，记录 editParam 中每个项的顺序
          const orderMap = new Map(
            editParam?.map((item, index) => [item.actionKey, index]),
          );

          // 处理 API 返回的数据
          const processedIntegrations = res.data.map((i) => {
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
          });

          // 对集成进行排序
          // 1. 先分离出在 editParam 中的项和不在的项
          const inEditParam = processedIntegrations.filter((i) =>
            editParam?.some((e) => e.actionKey === i.actionKey),
          );
          const notInEditParam = processedIntegrations.filter(
            (i) => !editParam?.some((e) => e.actionKey === i.actionKey),
          );

          // 2. 按照 editParam 的顺序排序
          inEditParam.sort((a, b) => {
            const orderA = orderMap.get(a.actionKey) ?? Number.MAX_SAFE_INTEGER;
            const orderB = orderMap.get(b.actionKey) ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
          });

          // 3. 合并排序后的结果
          set({
            allIntegrations: [...inEditParam, ...notInEditParam],
          });
          return;
        }

        // 如果没有 editConfigParams，按原来的逻辑处理
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
