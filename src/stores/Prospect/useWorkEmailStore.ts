import { create } from 'zustand';

import { SDRToast } from '@/components/atoms';

import { useProspectTableStore } from '@/stores/Prospect';

import { _fetchIntegrationMenus } from '@/request/prospect/integrations';

import { ActiveTypeEnum, HttpError } from '@/types';

import {
  DisplayTypeEnum,
  IntegrationAction,
  IntegrationActionMenu,
  IntegrationActionType,
  WaterfallConfigTypeEnum,
} from '@/types/Prospect';

// 工具函数：构建selectedOption对象
const buildSelectedOption = (column: any) =>
  column?.fieldId
    ? {
        label: column.fieldName || '',
        value: column.fieldId || '',
        key: column.fieldId || '',
      }
    : null;

type WorkEmailStoreProps = {
  integrationMenus: IntegrationActionMenu[];
  activeType: ActiveTypeEnum;
  groupId: string;
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
  updateIntegrationsOrder: (integrations: IntegrationAction[]) => void;
  addIntegrationToDefault: (integration: IntegrationAction) => void;
  handleEditClick: (columnId: string) => void;
  fetchIntegrations: () => Promise<void>;
  fetchIntegrationMenus: () => Promise<void>;
};

export const useWorkEmailStore = create<
  WorkEmailStoreProps & WorkEmailStoreActions
>((set, get) => ({
  integrationMenus: [],
  activeType: ActiveTypeEnum.add,
  groupId: '',
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
  setWaterfallDescription: (description: string) => {
    set({
      waterfallDescription: description,
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
    const { allIntegrations } = get();

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
        const indexA = sortedMap.get(a.actionKey) ?? Number.MAX_SAFE_INTEGER;
        const indexB = sortedMap.get(b.actionKey) ?? Number.MAX_SAFE_INTEGER;
        return indexA - indexB;
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
  handleEditClick: (columnId: string) => {
    const { columns, fieldGroupMap } = useProspectTableStore.getState();
    const column = columns.find((col) => col.fieldId === columnId);

    if (column?.groupId && fieldGroupMap) {
      //将requiredInputsBinding转换为选中的选项展示
      const requiredInputsBinding =
        fieldGroupMap?.[column.groupId]?.requiredInputsBinding || [];

      const selectedOptions = requiredInputsBinding.map((i) => {
        const field = columns.find((col) => col.fieldId === i.formulaText);
        return {
          label: field?.fieldName || '',
          value: field?.fieldId || '',
          key: field?.fieldId || '',
        };
      });

      const waterfallConfigInField = fieldGroupMap?.[
        column.groupId
      ]?.waterfallConfigs?.map((i) => ({
        actionKey: i.actionKey,
        skipped: i.skipped,
        inputParams: i.inputParameters.map((p) => {
          const field = selectedOptions.find(
            (col) => col.value === p.formulaText,
          );
          return {
            name: p.name,
            selectedOption: {
              label: field?.label || '',
              value: field?.value || '',
              key: field?.key || '',
            },
          };
        }),
      }));
      //根据actionKey找到integration
      const integration = get().integrationMenus.find(
        (i) => column && column.actionKey?.includes(i.actionKey || ''),
      );

      if (waterfallConfigInField && integration) {
        const editParam = waterfallConfigInField;

        // 创建一个映射，记录 editParam 中每个项的顺序
        const orderMap = new Map(
          editParam.map((item, index) => [item.actionKey, index]),
        );

        // 处理 API 返回的数据
        const processedIntegrations =
          integration.waterfallConfigs?.map((i) => {
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
                skipped: editItem.skipped || false,
              };
            }
            return {
              ...i,
              isDefault: false,
            };
          }) || [];

        // 对集成进行排序 - 使用Set提高性能
        const editParamKeys = new Set(editParam.map((e) => e.actionKey));
        const inEditParam = processedIntegrations.filter((i) =>
          editParamKeys.has(i.actionKey),
        );
        const notInEditParam = processedIntegrations.filter(
          (i) => !editParamKeys.has(i.actionKey),
        );

        // 按照 editParam 的顺序排序
        inEditParam.sort((a, b) => {
          const orderA = orderMap.get(a.actionKey) ?? Number.MAX_SAFE_INTEGER;
          const orderB = orderMap.get(b.actionKey) ?? Number.MAX_SAFE_INTEGER;
          return orderA - orderB;
        });

        // 合并排序后的结果
        set({
          allIntegrations: [...inEditParam, ...notInEditParam],
          activeType: ActiveTypeEnum.edit,
          workEmailVisible: true,
          dialogHeaderName: integration.name,
          waterfallDescription: integration.description,
          groupId: column.groupId,
        });
      }
    }
  },
  fetchIntegrations: async () => {
    // TODO: 实现集成列表获取逻辑
  },
  fetchIntegrationMenus: async () => {
    try {
      const res = await _fetchIntegrationMenus();
      if (Array.isArray(res.data)) {
        set({
          integrationMenus: res.data.map((item) => ({
            ...item,
            waterfallConfigs: item.waterfallConfigs.map((i) => ({
              ...i,
              inputParams: i.inputParams.map((p) => {
                const columns = useProspectTableStore.getState().columns;
                const column = columns.find(
                  (c) => c.semanticType === p.semanticType,
                );

                return {
                  ...p,
                  selectedOption: buildSelectedOption(column),
                };
              }),
            })),
          })),
        });
      }
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
}));
