import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { combine } from 'zustand/middleware';

import { SDRToast } from '@/components/atoms';

import { useEnrichmentTableStore } from '@/stores/enrichment';

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

import {
  TableColumnProps,
  TableViewColumnProps,
} from '@/types/enrichment/table';

const getMergedColumns = (): TableColumnProps[] => {
  const { metaColumns, views, activeViewId } =
    useEnrichmentTableStore.getState();
  const activeView = views.find((v) => v.viewId === activeViewId);
  const fieldProps = activeView?.fieldProps ?? [];
  const fieldPropsMap = new Map<string, TableViewColumnProps>(
    fieldProps.map((fp) => [fp.fieldId, fp]),
  );
  return metaColumns.map((meta) => {
    const fp = fieldPropsMap.get(meta.fieldId);
    if (!fp) {
      return meta;
    }
    return {
      ...meta,
      pin: fp.pin,
      visible: fp.visible,
      width: fp.width,
      color: fp.color,
      csn: fp.sort,
    };
  });
};

const getMergedColumnById = (fieldId: string): TableColumnProps | undefined => {
  return getMergedColumns().find((col) => col.fieldId === fieldId);
};

// Constants
const LEADMAGIC_VALIDATION_KEY = 'leadmagic';

// Helper function: build selectedOption object
const buildSelectedOption = (column: TableColumnProps | undefined) =>
  column?.fieldId
    ? {
        label: column.fieldName || '',
        value: column.fieldId || '',
        key: column.fieldId || '',
      }
    : null;

export enum IntegrationTypeEnum {
  collectionIntegrated = 'collectionIntegrated',
  singleIntegrated = 'singleIntegrated',
}

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
  integrationType: IntegrationTypeEnum;
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
  onWorkEmailEditClick: (columnId: string) => void;
  onClickToSingleIntegration: (columnId: string) => void;
  setIntegrationMenus: (menus: IntegrationActionMenu[]) => void;
  setValidationOptions: (config: IntegrationActionValidation[] | null) => void;
  setSelectedValidationOption: (option: string | null) => void;
  setSafeToSend: (safeToSend: boolean) => void;
  setRequireValidationSuccess: (requireValidationSuccess: boolean) => void;
  setIntegrationType: (type: IntegrationTypeEnum) => void;
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
  integrationType: IntegrationTypeEnum.collectionIntegrated,
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
          if (integration) {
            state.selectedIntegrationToConfig = {
              ...integration,
              inputParams: integration.inputParams.map((p) => {
                const columns = getMergedColumns();
                const column = columns.find(
                  (c) => c.semanticType === p.semanticType,
                );
                return {
                  ...p,
                  selectedOption: p.selectedOption
                    ? p.selectedOption
                    : buildSelectedOption(column),
                };
              }),
            };
            return;
          }
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
          if (config && config.length > 0) {
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
          if (!option?.includes(LEADMAGIC_VALIDATION_KEY)) {
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
      setIntegrationType: (type: IntegrationTypeEnum) =>
        set((state) => {
          state.integrationType = type;
        }),
      addIntegrationToDefault: (integration: IntegrationAction) =>
        set((state) => {
          // Find integration to add
          const integrationToAdd = state.allIntegrations.find(
            (i) => i.actionKey === integration.actionKey,
          );

          if (!integrationToAdd) {
            return;
          }

          // Get current default integrations
          const defaultIntegrations = state.allIntegrations.filter(
            (i) => i.isDefault,
          );
          const nonDefaultIntegrations = state.allIntegrations.filter(
            (i) => !i.isDefault,
          );

          // Remove integration from non-default list
          const updatedNonDefault = nonDefaultIntegrations.filter(
            (i) => i.actionKey !== integration.actionKey,
          );

          // Create updated version of integration to add
          const updatedIntegration = {
            ...integrationToAdd,
            isDefault: true,
          };

          // Update allIntegrations, add new integration to end of default list
          state.allIntegrations = [
            ...defaultIntegrations,
            updatedIntegration,
            ...updatedNonDefault,
          ];
        }),
      updateIntegrationsOrder: (sortedIntegrations: IntegrationAction[]) =>
        set((state) => {
          // Get current default and non-default integrations
          const currentDefaultIntegrations = state.allIntegrations.filter(
            (i) => i.isDefault,
          );
          const nonDefaultIntegrations = state.allIntegrations.filter(
            (i) => !i.isDefault,
          );

          // Create map to record order of sorted integrations
          const sortedMap = new Map(
            sortedIntegrations.map((integration, index) => [
              integration.actionKey,
              index,
            ]),
          );

          // Sort defaultIntegrations by sorted order
          const sortedDefaultIntegrations = [
            ...currentDefaultIntegrations,
          ].sort((a, b) => {
            const indexA =
              sortedMap.get(a.actionKey) ?? Number.MAX_SAFE_INTEGER;
            const indexB =
              sortedMap.get(b.actionKey) ?? Number.MAX_SAFE_INTEGER;
            return indexA - indexB;
          });

          // Update allIntegrations
          state.allIntegrations = [
            ...sortedDefaultIntegrations,
            ...nonDefaultIntegrations,
          ];
        }),
      onWorkEmailEditClick: (columnId: string) =>
        set((state) => {
          const { fieldGroupMap } = useEnrichmentTableStore.getState();
          const columns = getMergedColumns();
          const column = columns.find(
            (col: TableColumnProps) => col.fieldId === columnId,
          );

          if (!column?.groupId || !fieldGroupMap) {
            return;
          }

          //Convert requiredInputsBinding to selected options for display
          const requiredInputsBinding =
            fieldGroupMap?.[column.groupId]?.requiredInputsBinding || [];

          const selectedOptions = requiredInputsBinding.map((i) => {
            const field = columns.find(
              (col: TableColumnProps) => col.fieldId === i.formulaText,
            );
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

          //Find integration by actionKey
          const integration = state.integrationMenus.find(
            (i) => column && column.actionKey?.includes(i.key || ''),
          );

          if (!waterfallConfigInField || !integration) {
            return;
          }

          const editParam = waterfallConfigInField;

          // Create map to record order of each item in editParam
          const orderMap = new Map(
            editParam.map((item, index) => [item.actionKey, index]),
          );

          // Process API returned data
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

          // Sort integrations - use Set for better performance
          const editParamKeys = new Set(editParam.map((e) => e.actionKey));
          const inEditParam = processedIntegrations.filter((i) =>
            editParamKeys.has(i.actionKey),
          );
          const notInEditParam = processedIntegrations.filter(
            (i) => !editParamKeys.has(i.actionKey),
          );

          // Sort by editParam order
          inEditParam.sort((a, b) => {
            const orderA = orderMap.get(a.actionKey) ?? Number.MAX_SAFE_INTEGER;
            const orderB = orderMap.get(b.actionKey) ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
          });

          // Merge sorted results
          state.allIntegrations = [...inEditParam, ...notInEditParam];
          state.activeType = ActiveTypeEnum.edit;
          state.integrationType = IntegrationTypeEnum.collectionIntegrated;
          state.workEmailVisible = true;
          state.displayType = DisplayTypeEnum.main;
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
          useEnrichmentTableStore
            .getState()
            .openDialog(TableColumnMenuActionEnum.work_email);
        }),
      onClickToSingleIntegration: (columnId: string) => {
        const column = getMergedColumnById(columnId);
        if (!column) {
          return;
        }
        const { actionDefinition, typeSettings } = column;
        if (actionDefinition) {
          const editInputParams = typeSettings?.inputBinding || [];
          const columns = getMergedColumns();

          set({
            activeType: ActiveTypeEnum.edit,
            displayType: DisplayTypeEnum.integration,
            integrationType: IntegrationTypeEnum.singleIntegrated,
            selectedIntegrationToConfig: {
              ...actionDefinition,
              inputParams:
                actionDefinition?.inputParams?.map((item) => {
                  //Find name in inputBinding by semanticType in item
                  const selectedBinding = editInputParams.find(
                    (i) => i.name === item.semanticType,
                  );
                  //Find column by formulaText in inputBinding
                  const column = columns.find(
                    (c) => c.fieldId === selectedBinding?.formulaText,
                  );
                  return {
                    ...item,
                    selectedOption: {
                      label: column?.fieldName || '',
                      value: column?.fieldId || '',
                      key: column?.fieldId || '',
                    },
                  };
                }) || [],
            },
          });
          useEnrichmentTableStore
            .getState()
            .openDialog(TableColumnMenuActionEnum.work_email);
        } else {
          console.error('actionDefinition is undefined');
        }
      },
      setIntegrationMenus: (menus) => {
        try {
          if (Array.isArray(menus)) {
            set((state) => {
              state.integrationMenus = menus.map((item) => ({
                ...item,
                waterfallConfigs: (item.waterfallConfigs || []).map((i) => ({
                  ...i,
                  inputParams: (i.inputParams || []).map((p) => {
                    const columns = getMergedColumns();
                    const column = columns.find(
                      (c: TableColumnProps) =>
                        c.semanticType === p.semanticType,
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
