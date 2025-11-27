import { create } from 'zustand';

import { directoriesDataFlow } from '@/services';

import {
  additionalCollectKeys,
  additionalInit,
  configInitFormValues,
  configParse,
} from '@/utils/directories';
import {
  DirectoriesBizIdEnum,
  DirectoriesQueryActionTypeEnum,
  DirectoriesQueryItem,
  DirectoriesQueryTableBodyApiResponse,
} from '@/types/directories';
import { HIERARCHICAL_CONFIG_BIZ_IDS } from '@/constants/directories';

import { SDRToast } from '@/components/atoms';

import { _fetchDirectoriesConfig } from '@/request/directories';
import { HttpError } from '@/types';

interface DirectoriesStoreState {
  bizId: DirectoriesBizIdEnum | '';
  institutionType: string;
  buttonGroupConfig: DirectoriesQueryItem | null;
  isLoadingConfig: boolean;
  queryConfig: DirectoriesQueryItem[];
  configMap: Record<string, DirectoriesQueryItem[]>;
  formValuesByInstitutionType: Record<string, Record<string, any>>;
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
  updateInstitutionType: (value: string) => void;
  updateFormValues: (key: string, value: any, groupPath?: string) => void;
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
  institutionType: '',
  configMap: {},
  buttonGroupConfig: null,
  queryConfig: [],
  formValuesByInstitutionType: {},
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

    updateInstitutionType: (value: string) => {
      const {
        institutionType: currentInstitutionType,
        configMap,
        formValuesByInstitutionType,
        bizId,
      } = get();

      // Only hierarchical config supports institutionType switching
      if (
        !HIERARCHICAL_CONFIG_BIZ_IDS.includes(bizId as DirectoriesBizIdEnum)
      ) {
        return;
      }

      if (currentInstitutionType === value || !value) {
        return;
      }

      const queryConfig = configMap[value] || [];
      const formValues = formValuesByInstitutionType[value];

      set({
        institutionType: value,
        queryConfig,
        formValues,
      });

      // Hierarchical config: pass institutionType and entityType
      directoriesDataFlow.updateFormValues({
        bizId,
        institutionType: value,
        entityType: formValues?.entityType || '',
        formValues: formValues || {},
      });
    },

    updateFormValues: (key: string, value: any, groupPath?: string) => {
      const {
        formValues,
        institutionType,
        formValuesByInstitutionType,
        bizId,
      } = get();

      let updatedFormValues: Record<string, any>;

      if (key === 'entityType') {
        const currentEntityType = formValues.entityType;
        const targetEntityType = value;

        // When switching tab, copy shared field values from current tab to target tab
        if (
          currentEntityType &&
          targetEntityType &&
          currentEntityType !== targetEntityType
        ) {
          const currentTabValues = formValues[currentEntityType] || {};
          const targetTabValues = formValues[targetEntityType] || {};

          // Find shared keys and copy values from current tab to target tab
          const mergedTargetValues = { ...targetTabValues };
          Object.keys(currentTabValues).forEach((fieldKey) => {
            if (fieldKey in targetTabValues) {
              mergedTargetValues[fieldKey] = currentTabValues[fieldKey];
            }
          });

          updatedFormValues = {
            ...formValues,
            [key]: value,
            [targetEntityType]: mergedTargetValues,
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

      const isHierarchical = HIERARCHICAL_CONFIG_BIZ_IDS.includes(
        bizId as DirectoriesBizIdEnum,
      );

      // Hierarchical config: store by institutionType
      if (isHierarchical) {
        set({
          formValues: updatedFormValues,
          formValuesByInstitutionType: {
            ...formValuesByInstitutionType,
            [institutionType]: updatedFormValues,
          },
        });

        directoriesDataFlow.updateFormValues({
          bizId,
          institutionType,
          entityType: updatedFormValues.entityType || '',
          formValues: updatedFormValues,
        });
      } else {
        // Flat config: store directly
        set({ formValues: updatedFormValues });

        directoriesDataFlow.updateFormValues({
          bizId,
          formValues: updatedFormValues,
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

        const isHierarchical = HIERARCHICAL_CONFIG_BIZ_IDS.includes(bizId);

        if (isHierarchical) {
          // Hierarchical config: store grouped by institutionType
          const formValuesByInstitutionType: Record<
            string,
            Record<string, any>
          > = {};
          Object.keys(configMap).forEach((key) => {
            formValuesByInstitutionType[key] = configInitFormValues(
              configMap[key],
            );
          });

          const queryConfig = configMap[firstKey] || [];
          const currentFormValues = formValuesByInstitutionType[firstKey];

          set({
            configMap,
            buttonGroupConfig,
            queryConfig,
            institutionType: firstKey,
            formValuesByInstitutionType,
            formValues: currentFormValues || {},
            isLoadingConfig: false,
          });

          directoriesDataFlow.updateFormValues({
            bizId,
            institutionType: firstKey,
            entityType: currentFormValues?.entityType || '',
            formValues: currentFormValues || {},
          });
        } else {
          // Flat config: store directly
          const queryConfig = configMap[firstKey] || [];
          const currentFormValues = configInitFormValues(queryConfig);

          set({
            configMap: {},
            buttonGroupConfig: null,
            queryConfig,
            institutionType: '',
            formValuesByInstitutionType: {},
            formValues: currentFormValues || {},
            isLoadingConfig: false,
          });

          directoriesDataFlow.updateFormValues({
            bizId,
            formValues: currentFormValues || {},
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
        institutionType: '',
        configMap: {},
        buttonGroupConfig: null,
        queryConfig: [],
        formValuesByInstitutionType: {},
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
