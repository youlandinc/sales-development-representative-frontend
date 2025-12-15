import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { combine } from 'zustand/middleware';

import { SDRToast } from '@/components/atoms';

import { useProspectTableStore } from '@/stores/enrichment';

import { ActiveTypeEnum, HttpError } from '@/types';

import {
  DisplayTypeEnum,
  IntegrationAction,
  IntegrationActionMenu,
  IntegrationActionType,
  IntegrationActionValidation,
  WaterfallConfigTypeEnum,
} from '@/types/enrichment';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

// 工具函数：构建selectedOption对象
const buildSelectedOption = (column: any) =>
  column?.fieldId
    ? {
        label: column.fieldName || '',
        value: column.fieldId || '',
        key: column.fieldId || '',
      }
    : null;

type WorkEmailStoreState = {
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
  validationOptions: IntegrationActionValidation[] | null;
  waterfallConfigType: WaterfallConfigTypeEnum;
  isValidatedInputParams: boolean;
  selectedValidationOption: string | null;
  safeToSend: boolean;
  requireValidationSuccess: boolean;
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
  setIntegrationMenus: (menus: IntegrationActionMenu[]) => void;
  setValidationOptions: (config: IntegrationActionValidation[] | null) => void;
  setSelectedValidationOption: (option: string | null) => void;
  setSafeToSend: (safeToSend: boolean) => void;
  setRequireValidationSuccess: (requireValidationSuccess: boolean) => void;
};

const initialState: WorkEmailStoreState = {
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
  validationOptions: null,
  selectedValidationOption: null,
  safeToSend: false,
  requireValidationSuccess: false,
};

export const useWorkEmailStore = create<
  WorkEmailStoreState & WorkEmailStoreActions
>()(
  immer(
    combine(initialState, (set) => ({
      setAllIntegrations: (integrations: IntegrationAction[]) =>
        set((state) => {
          state.allIntegrations = integrations;
        }),
      setActiveType: (type: ActiveTypeEnum) =>
        set((state) => {
          state.activeType = type;
        }),
      setWorkEmailVisible: (open: boolean) =>
        set((state) => {
          state.workEmailVisible = open;
        }),
      setDialogIntegrationsVisible: (open: boolean) =>
        set((state) => {
          state.dialogIntegrationsVisible = open;
        }),
      setDisplayType: (type: DisplayTypeEnum) =>
        set((state) => {
          state.displayType = type;
        }),
      setSelectedIntegration: (integration: IntegrationAction | null) =>
        set((state) => {
          state.selectedIntegration = integration;
        }),
      setSelectedIntegrationToConfig: (integration: IntegrationAction | null) =>
        set((state) => {
          state.selectedIntegrationToConfig = integration;
        }),
      setWaterfallConfigType: (type: WaterfallConfigTypeEnum) =>
        set((state) => {
          state.waterfallConfigType = type;
        }),
      setIsValidatedInputParams: (isValidated: boolean) =>
        set((state) => {
          state.isValidatedInputParams = isValidated;
        }),
      setDialogHeaderName: (name: string) =>
        set((state) => {
          state.dialogHeaderName = name;
        }),
      setWaterfallDescription: (description: string) =>
        set((state) => {
          state.waterfallDescription = description;
        }),
      setValidationOptions: (config: IntegrationActionValidation[] | null) =>
        set((state) => {
          state.validationOptions = config;
          if (config && config?.length > 0) {
            state.selectedValidationOption =
              config.find((item) => item.isDefault)?.actionKey || null;
          } else {
            state.selectedValidationOption = null;
          }
          state.safeToSend = false;
          state.requireValidationSuccess = false;
        }),
      setSelectedValidationOption: (option: string | null) =>
        set((state) => {
          state.selectedValidationOption = option;
          if (!option?.includes('leadmagic')) {
            state.safeToSend = false;
          }
        }),
      setSafeToSend: (safeToSend: boolean) =>
        set((state) => {
          state.safeToSend = safeToSend;
        }),
      setRequireValidationSuccess: (requireValidationSuccess: boolean) =>
        set((state) => {
          state.requireValidationSuccess = requireValidationSuccess;
        }),
      addIntegrationToDefault: (integration: IntegrationAction) =>
        set((state) => {
          // 查找要添加的集成
          const integrationToAdd = state.allIntegrations.find(
            (i) => i.actionKey === integration.actionKey,
          );

          if (!integrationToAdd) {
            return;
          }

          // 获取当前所有默认集成
          const defaultIntegrations = state.allIntegrations.filter(
            (i) => i.isDefault,
          );
          const nonDefaultIntegrations = state.allIntegrations.filter(
            (i) => !i.isDefault,
          );

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
          state.allIntegrations = [
            ...defaultIntegrations,
            updatedIntegration,
            ...updatedNonDefault,
          ];
        }),
      updateIntegrationsOrder: (sortedIntegrations: IntegrationAction[]) =>
        set((state) => {
          // 获取当前所有默认和非默认集成
          const currentDefaultIntegrations = state.allIntegrations.filter(
            (i) => i.isDefault,
          );
          const nonDefaultIntegrations = state.allIntegrations.filter(
            (i) => !i.isDefault,
          );

          // 创建一个映射，记录排序后的集成的顺序
          const sortedMap = new Map(
            sortedIntegrations.map((integration, index) => [
              integration.actionKey,
              index,
            ]),
          );

          // 按照排序后的顺序重新排列 defaultIntegrations
          const sortedDefaultIntegrations = [
            ...currentDefaultIntegrations,
          ].sort((a, b) => {
            const indexA =
              sortedMap.get(a.actionKey) ?? Number.MAX_SAFE_INTEGER;
            const indexB =
              sortedMap.get(b.actionKey) ?? Number.MAX_SAFE_INTEGER;
            return indexA - indexB;
          });

          // 更新 allIntegrations
          state.allIntegrations = [
            ...sortedDefaultIntegrations,
            ...nonDefaultIntegrations,
          ];
        }),
      handleEditClick: (columnId: string) =>
        set((state) => {
          const { columns, fieldGroupMap } = useProspectTableStore.getState();
          const column = columns.find((col) => col.fieldId === columnId);

          if (!column?.groupId || !fieldGroupMap) {
            return;
          }

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

          const validationActionConfig =
            fieldGroupMap?.[column.groupId]?.validationActionConfig;

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
          const integration = state.integrationMenus.find(
            (i) => column && column.actionKey?.includes(i.key || ''),
          );

          if (!waterfallConfigInField || !integration) {
            return;
          }

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
          state.allIntegrations = [...inEditParam, ...notInEditParam];
          state.activeType = ActiveTypeEnum.edit;
          state.workEmailVisible = true;
          state.dialogHeaderName = integration.name;
          state.waterfallDescription = integration.description;
          state.groupId = column.groupId;
          if (integration.validations) {
            state.validationOptions = integration.validations;
          }
          if (validationActionConfig) {
            state.safeToSend = validationActionConfig.safeToSend;
            state.requireValidationSuccess =
              validationActionConfig.requireValidationSuccess;
            state.selectedValidationOption = validationActionConfig.actionKey;
          }
          useProspectTableStore
            .getState()
            .openDialog(TableColumnMenuActionEnum.work_email);
        }),
      setIntegrationMenus: (menus) => {
        try {
          if (Array.isArray(menus)) {
            set((state) => {
              state.integrationMenus = menus.map((item) => ({
                ...item,
                waterfallConfigs: (item.waterfallConfigs || []).map((i) => ({
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
              }));
            });
          }
        } catch (err) {
          const { message, header, variant } = err as HttpError;
          SDRToast({ message, header, variant });
        }
      },
    })),
  ),
);
