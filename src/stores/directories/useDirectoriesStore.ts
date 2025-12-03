import { create } from 'zustand';

import { directoriesDataFlow } from '@/services';

import {
  additionalCollectKeys,
  additionalInit,
  collectKeysFromGroup,
  configInitFormValues,
  configParse,
  getAdditionalIsAuth,
  getButtonGroupKey,
  getTabKey,
} from '@/utils/directories';
import {
  DirectoriesBizIdEnum,
  DirectoriesQueryActionTypeEnum,
  DirectoriesQueryItem,
  DirectoriesQueryTableBodyApiResponse,
} from '@/types/directories';

import { SDRToast } from '@/components/atoms';

import { _fetchDirectoriesConfig } from '@/request/directories';
import { HttpError } from '@/types';

interface DirectoriesStoreState {
  bizId: DirectoriesBizIdEnum | '';
  // Dynamic keys from config
  buttonGroupKey: string | null; // e.g., 'institutionType'
  buttonGroupValue: string; // e.g., 'INVESTORS_FUNDS'
  tabKey: string | null; // e.g., 'entityType'
  buttonGroupConfig: DirectoriesQueryItem | null;
  isLoadingConfig: boolean;
  queryConfig: DirectoriesQueryItem[];
  configMap: Record<string, DirectoriesQueryItem[]>;
  formValuesByButtonGroup: Record<string, Record<string, any>>;
  formValues: Record<string, any>;
  // Additional Details
  isLoadingAdditional: boolean;
  additionalConfig: DirectoriesQueryItem[];
  additionalCheckbox: Record<string, boolean>;
  additionalValues: Record<string, any>;
  // Preview
  previewHeader: any[];
  previewBody: DirectoriesQueryTableBodyApiResponse;
  isLoadingPreview: boolean;
  hasSubmittedSearch: boolean;
  lastSearchParams: Record<string, any> | null;
}

interface DirectoriesStoreActions {
  updateButtonGroupValue: (value: string) => void;
  updateFormValues: (key: string, value: any, groupPath?: string) => void;
  resetGroupFormValues: (
    config: DirectoriesQueryItem,
    groupPath?: string,
  ) => void;
  // RxJS
  initializeDataFlow: (bizId: DirectoriesBizIdEnum) => Promise<boolean>;
  syncFromRxJS: () => () => void;
  reset: () => void;
  // Additional Details
  processAdditionalDetails: (data: DirectoriesQueryItem[]) => void;
  updateAdditionalSelection: (
    key: string | null,
    value: any,
    item?: DirectoriesQueryItem,
  ) => void;
}

type DirectoriesStoreProps = DirectoriesStoreState & DirectoriesStoreActions;

const INITIAL_STATE: DirectoriesStoreState = {
  bizId: '',
  buttonGroupKey: null,
  buttonGroupValue: '',
  tabKey: null,
  configMap: {},
  buttonGroupConfig: null,
  queryConfig: [],
  formValuesByButtonGroup: {},
  formValues: {},
  isLoadingConfig: false,
  // Additional Details
  isLoadingAdditional: false,
  additionalConfig: [],
  additionalCheckbox: {},
  additionalValues: {},
  // Preview
  previewHeader: [],
  previewBody: {
    findCount: 0,
    defaultPreviewCount: 0,
    maxImportCount: 0,
    findList: [],
  },
  isLoadingPreview: false,
  hasSubmittedSearch: false,
  lastSearchParams: null,
};

export const useDirectoriesStore = create<DirectoriesStoreProps>()(
  (set, get) => ({
    ...INITIAL_STATE,

    updateButtonGroupValue: (value: string) => {
      const {
        buttonGroupValue: currentValue,
        buttonGroupKey,
        configMap,
        formValuesByButtonGroup,
        bizId,
        buttonGroupConfig,
      } = get();

      // Only hierarchical config (has BUTTON_GROUP) supports switching
      if (!buttonGroupConfig || !buttonGroupKey) {
        return;
      }

      if (currentValue === value || !value) {
        return;
      }

      const queryConfig = configMap[value] || [];
      const formValues = formValuesByButtonGroup[value];
      const resolvedTabKey = getTabKey(queryConfig);

      set({
        buttonGroupValue: value,
        tabKey: resolvedTabKey,
        queryConfig,
        formValues,
      });

      // Pass dynamic keys to RxJS
      directoriesDataFlow.updateFormValues({
        bizId,
        buttonGroupKey,
        buttonGroupValue: value,
        tabKey: resolvedTabKey || undefined,
        tabValue: resolvedTabKey
          ? formValues?.[resolvedTabKey] || ''
          : undefined,
        formValues: formValues || {},
        additionalIsAuth: getAdditionalIsAuth(queryConfig),
      });
    },

    updateFormValues: (key: string, value: any, groupPath?: string) => {
      const {
        formValues,
        buttonGroupKey,
        buttonGroupValue,
        tabKey,
        formValuesByButtonGroup,
        bizId,
        queryConfig,
      } = get();

      let updatedFormValues: Record<string, any>;

      // Check if updating the tab key (e.g., 'entityType')
      const isTabKeyUpdate = tabKey && key === tabKey;

      if (isTabKeyUpdate) {
        const currentTabValue = formValues[tabKey];
        const targetTabValue = value;

        // When switching tab, copy shared field values from current tab to target tab
        if (
          currentTabValue &&
          targetTabValue &&
          currentTabValue !== targetTabValue
        ) {
          const currentTabData = formValues[currentTabValue] || {};
          const targetTabData = formValues[targetTabValue] || {};

          // Find shared keys and copy values from current tab to target tab
          const mergedTargetData = { ...targetTabData };
          Object.keys(currentTabData).forEach((fieldKey) => {
            if (fieldKey in targetTabData) {
              mergedTargetData[fieldKey] = currentTabData[fieldKey];
            }
          });

          updatedFormValues = {
            ...formValues,
            [key]: value,
            [targetTabValue]: mergedTargetData,
          };
        } else {
          updatedFormValues = {
            ...formValues,
            [key]: value,
          };
        }
      } else if (groupPath) {
        updatedFormValues = {
          ...formValues,
          [groupPath]: {
            ...(formValues[groupPath] || {}),
            [key]: value,
          },
        };
      } else {
        updatedFormValues = {
          ...formValues,
          [key]: value,
        };
      }

      const { buttonGroupConfig } = get();

      // Hierarchical config (has BUTTON_GROUP): store by buttonGroupValue
      if (buttonGroupConfig && buttonGroupKey) {
        set({
          formValues: updatedFormValues,
          formValuesByButtonGroup: {
            ...formValuesByButtonGroup,
            [buttonGroupValue]: updatedFormValues,
          },
        });

        directoriesDataFlow.updateFormValues({
          bizId,
          buttonGroupKey,
          buttonGroupValue,
          tabKey: tabKey || undefined,
          tabValue: tabKey ? updatedFormValues[tabKey] || '' : undefined,
          formValues: updatedFormValues,
          additionalIsAuth: getAdditionalIsAuth(queryConfig),
        });
      } else {
        // Flat config: store directly
        set({ formValues: updatedFormValues });

        directoriesDataFlow.updateFormValues({
          bizId,
          tabKey: tabKey || undefined,
          tabValue: tabKey ? updatedFormValues[tabKey] || '' : undefined,
          formValues: updatedFormValues,
          additionalIsAuth: getAdditionalIsAuth(queryConfig),
        });
      }
    },

    resetGroupFormValues: (
      config: DirectoriesQueryItem,
      groupPath?: string,
    ) => {
      const {
        formValues,
        buttonGroupKey,
        buttonGroupValue,
        tabKey,
        formValuesByButtonGroup,
        bizId,
        queryConfig,
      } = get();

      const keysToReset = collectKeysFromGroup(config);
      let updatedFormValues: Record<string, any>;

      if (groupPath) {
        // Reset fields within a group path
        const groupValues = { ...(formValues[groupPath] || {}) };
        keysToReset.forEach((key) => {
          if (key in groupValues) {
            groupValues[key] = null;
          }
        });
        updatedFormValues = {
          ...formValues,
          [groupPath]: groupValues,
        };
      } else {
        // Reset fields at root level
        updatedFormValues = { ...formValues };
        keysToReset.forEach((key) => {
          if (key in updatedFormValues) {
            // Reset to appropriate initial value based on type
            const currentValue = updatedFormValues[key];
            if (Array.isArray(currentValue)) {
              updatedFormValues[key] = [];
            } else if (
              typeof currentValue === 'object' &&
              currentValue !== null
            ) {
              // Reset object fields (like excludeFirms) to initial structure
              updatedFormValues[key] = {
                tableId: '',
                tableFieldId: '',
                tableViewId: '',
                keywords: [],
              };
            } else {
              updatedFormValues[key] = null;
            }
          }
        });
      }

      const { buttonGroupConfig } = get();

      // Hierarchical config (has BUTTON_GROUP): store by buttonGroupValue
      if (buttonGroupConfig && buttonGroupKey) {
        set({
          formValues: updatedFormValues,
          formValuesByButtonGroup: {
            ...formValuesByButtonGroup,
            [buttonGroupValue]: updatedFormValues,
          },
        });

        directoriesDataFlow.updateFormValues({
          bizId,
          buttonGroupKey,
          buttonGroupValue,
          tabKey: tabKey || undefined,
          tabValue: tabKey ? updatedFormValues[tabKey] || '' : undefined,
          formValues: updatedFormValues,
          additionalIsAuth: getAdditionalIsAuth(queryConfig),
        });
      } else {
        set({ formValues: updatedFormValues });

        directoriesDataFlow.updateFormValues({
          bizId,
          tabKey: tabKey || undefined,
          tabValue: tabKey ? updatedFormValues[tabKey] || '' : undefined,
          formValues: updatedFormValues,
          additionalIsAuth: getAdditionalIsAuth(queryConfig),
        });
      }
    },

    // ========================================
    // RxJS
    // ========================================
    initializeDataFlow: async (bizId: DirectoriesBizIdEnum) => {
      if (!bizId) {
        return false;
      }

      set({ isLoadingConfig: true, bizId });

      try {
        const { data } = await _fetchDirectoriesConfig({ bizId });
        const { configMap, buttonGroupConfig, firstKey } = configParse(
          data || [],
          bizId,
        );

        // Detect hierarchical config by buttonGroupConfig existence
        const resolvedButtonGroupKey = getButtonGroupKey(data || []);

        if (buttonGroupConfig && resolvedButtonGroupKey) {
          // Hierarchical config: store grouped by buttonGroupValue
          const formValuesByButtonGroup: Record<
            string,
            Record<string, any>
          > = {};
          Object.keys(configMap).forEach((key) => {
            formValuesByButtonGroup[key] = configInitFormValues(configMap[key]);
          });

          const queryConfig = configMap[firstKey] || [];
          const currentFormValues = formValuesByButtonGroup[firstKey];
          const resolvedTabKey = getTabKey(queryConfig);

          set({
            configMap,
            buttonGroupConfig,
            buttonGroupKey: resolvedButtonGroupKey,
            buttonGroupValue: firstKey,
            tabKey: resolvedTabKey,
            queryConfig,
            formValuesByButtonGroup,
            formValues: currentFormValues || {},
            isLoadingConfig: false,
          });

          directoriesDataFlow.updateFormValues({
            bizId,
            buttonGroupKey: resolvedButtonGroupKey,
            buttonGroupValue: firstKey,
            tabKey: resolvedTabKey || undefined,
            tabValue: resolvedTabKey
              ? currentFormValues?.[resolvedTabKey] || ''
              : undefined,
            formValues: currentFormValues || {},
            additionalIsAuth: getAdditionalIsAuth(queryConfig),
          });
        } else {
          // Flat config: store directly
          const queryConfig = configMap[firstKey] || [];
          const currentFormValues = configInitFormValues(queryConfig);
          const resolvedTabKey = getTabKey(queryConfig);

          set({
            configMap: {},
            buttonGroupConfig: null,
            buttonGroupKey: null,
            buttonGroupValue: '',
            tabKey: resolvedTabKey,
            queryConfig,
            formValuesByButtonGroup: {},
            formValues: currentFormValues || {},
            isLoadingConfig: false,
          });

          directoriesDataFlow.updateFormValues({
            bizId,
            tabKey: resolvedTabKey || undefined,
            tabValue: resolvedTabKey
              ? currentFormValues?.[resolvedTabKey] || ''
              : undefined,
            formValues: currentFormValues || {},
            additionalIsAuth: getAdditionalIsAuth(queryConfig),
          });
        }

        return true;
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        set({ isLoadingConfig: false });
        return false;
      }
    },

    syncFromRxJS: () => {
      const additionalSub = directoriesDataFlow.additionalDebounced$.subscribe(
        (additional) => {
          const { processAdditionalDetails } = get();
          processAdditionalDetails(additional);
        },
      );

      const loadingSub = directoriesDataFlow.isLoadingAdditional$.subscribe(
        (loading) => {
          set({ isLoadingAdditional: loading });

          if (loading) {
            set({
              additionalCheckbox: {},
              additionalValues: {},
              additionalConfig: [],
            });
          }
        },
      );

      const finalDataSub = directoriesDataFlow.finalData$.subscribe(
        (finalData) => {
          set({ lastSearchParams: finalData });
        },
      );

      const previewSub = directoriesDataFlow.preview$.subscribe((preview) => {
        set({
          previewHeader: preview.header,
          previewBody: preview.body,
          hasSubmittedSearch: true,
        });
      });

      const previewLoadingSub = directoriesDataFlow.isLoadingPreview$.subscribe(
        (loading) => {
          set({ isLoadingPreview: loading });

          if (loading) {
            set({
              previewHeader: [],
              previewBody: {
                findCount: 0,
                defaultPreviewCount: 0,
                maxImportCount: 0,
                findList: [],
              },
            });
          }
        },
      );

      return () => {
        additionalSub.unsubscribe();
        loadingSub.unsubscribe();
        finalDataSub.unsubscribe();
        previewSub.unsubscribe();
        previewLoadingSub.unsubscribe();
      };
    },

    // ========================================
    // Additional Details
    // ========================================
    processAdditionalDetails: (data: DirectoriesQueryItem[]) => {
      set({ additionalConfig: data });

      const checkboxState: Record<string, boolean> = {};
      const valuesState: Record<string, any> = {};

      data.forEach((item) => {
        const { checkbox, values } = additionalInit(item);
        Object.assign(checkboxState, checkbox);
        Object.assign(valuesState, values);
      });

      set({
        additionalCheckbox: checkboxState,
        additionalValues: valuesState,
      });
    },

    updateAdditionalSelection: (
      key: string | null,
      value: any,
      item?: DirectoriesQueryItem,
    ) => {
      const { additionalCheckbox, additionalValues } = get();

      if (!key && item?.children) {
        const childKeys = additionalCollectKeys(item.children);

        const newCheckbox = { ...additionalCheckbox };
        childKeys.forEach((childKey) => {
          newCheckbox[childKey] = value;
        });

        set({ additionalCheckbox: newCheckbox });

        directoriesDataFlow.updateAdditionalManually({
          checkbox: newCheckbox,
          values: additionalValues,
        });
      } else if (key && item) {
        if (item.actionType === DirectoriesQueryActionTypeEnum.checkbox) {
          const newCheckbox = { ...additionalCheckbox, [key]: value };
          set({ additionalCheckbox: newCheckbox });

          directoriesDataFlow.updateAdditionalManually({
            checkbox: newCheckbox,
            values: additionalValues,
          });
        } else if (item.actionType === DirectoriesQueryActionTypeEnum.select) {
          const newValues = { ...additionalValues, [key]: value };
          set({ additionalValues: newValues });

          directoriesDataFlow.updateAdditionalManually({
            checkbox: additionalCheckbox,
            values: newValues,
          });
        }
      } else {
        //console.warn(
        //  '⚠️  updateAdditionalSelection called with invalid params',
        //);
      }
    },

    reset: () => {
      directoriesDataFlow.reset();
      set({
        bizId: '',
        buttonGroupKey: null,
        buttonGroupValue: '',
        tabKey: null,
        configMap: {},
        buttonGroupConfig: null,
        queryConfig: [],
        formValuesByButtonGroup: {},
        formValues: {},
        isLoadingConfig: false,
        isLoadingAdditional: false,
        additionalConfig: [],
        additionalCheckbox: {},
        additionalValues: {},
        previewHeader: [],
        previewBody: {
          findCount: 0,
          defaultPreviewCount: 0,
          maxImportCount: 0,
          findList: [],
        },
        isLoadingPreview: false,
        hasSubmittedSearch: false,
        lastSearchParams: null,
      });
    },
  }),
);
