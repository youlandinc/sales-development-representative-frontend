import { create } from 'zustand';
import {
  DirectoriesBizIdEnum,
  DirectoriesQueryItem,
} from '@/types/Directories';
import { _fetchDirectoriesConfig } from '@/request/directories';
import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import {
  convertToConfigMap,
  initializeFormValues,
} from '@/components/molecules/DirectoriesIndustry/DirectoriesIndustryQuery/data';
import { directoriesDataFlow } from '@/services';

interface DirectoriesStoreState {
  bizId: DirectoriesBizIdEnum | '';
  institutionType: string;
  buttonGroupConfig: DirectoriesQueryItem | null;
  configMap: Record<string, DirectoriesQueryItem[]>;
  queryConfig: DirectoriesQueryItem[];
  formValuesByInstitutionType: Record<string, Record<string, any>>;
  formValues: Record<string, any>;
  results: any[];
  resultCount: number;
  loadingConfig: boolean;
  loadingResults: boolean;
  // RxJS 数据流状态
  additionalDetails: any;
  finalData: any;
  loadingAdditional: boolean;
  // Additional Details 专用状态
  additionalDetailsConfig: DirectoriesQueryItem[]; // 配置结构数组（嵌套）
  additionalDetailsCheckbox: Record<string, boolean>; // CHECKBOX 的勾选状态
  additionalDetailsValues: Record<string, any>; // SELECT 等其他字段的值
}

interface DirectoriesStoreActions {
  fetchDefaultViaBiz: (bizId: DirectoriesBizIdEnum) => Promise<boolean>;
  fetchResults: () => Promise<void>;
  updateInstitutionType: (value: string) => void;
  updateFormValues: (key: string, value: any, groupPath?: string) => void;
  // RxJS 数据流方法
  initializeDataFlow: (bizId: DirectoriesBizIdEnum) => Promise<boolean>;
  syncFromRxJS: () => () => void;
  submitFinalData: () => Promise<void>;
  reset: () => void;
  // Additional Details 专用方法
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
  results: [],
  resultCount: 0,
  loadingConfig: false,
  loadingResults: false,
  // RxJS 数据流状态
  additionalDetails: null,
  finalData: null,
  loadingAdditional: false,
  // Additional Details 专用状态
  additionalDetailsConfig: [],
  additionalDetailsCheckbox: {},
  additionalDetailsValues: {},
};

export const useDirectoriesStore = create<DirectoriesStoreProps>()(
  (set, get) => ({
    ...INITIAL_STATE,

    fetchDefaultViaBiz: async (bizId: DirectoriesBizIdEnum) => {
      if (!bizId) {
        return false;
      }

      set({ loadingConfig: true, bizId });

      try {
        const response = await _fetchDirectoriesConfig({ bizId });

        const apiData = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const { configMap, buttonGroupConfig, firstInstitutionType } =
          convertToConfigMap(apiData);

        const formValuesByInstitutionType: Record<
          string,
          Record<string, any>
        > = {};
        Object.keys(configMap).forEach((institutionType) => {
          formValuesByInstitutionType[institutionType] = initializeFormValues(
            configMap[institutionType],
          );
        });

        const queryConfig = configMap[firstInstitutionType] || [];
        const currentFormValues =
          formValuesByInstitutionType[firstInstitutionType];

        set({
          configMap,
          buttonGroupConfig,
          queryConfig,
          institutionType: firstInstitutionType,
          formValuesByInstitutionType,
          formValues: currentFormValues,
          loadingConfig: false,
        });

        return true;
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        set({ loadingConfig: false });
        return false;
      }
    },

    fetchResults: async () => {
      const { bizId, institutionType, formValues } = get();

      if (!bizId || !institutionType) {
        return;
      }

      set({ loadingResults: true });

      try {
        set({ loadingResults: false });
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        set({ loadingResults: false });
      }
    },

    updateInstitutionType: (value: string) => {
      const {
        institutionType: currentInstitutionType,
        configMap,
        formValuesByInstitutionType,
      } = get();

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
        updatedFormValues = {
          ...formValues,
          [key]: value,
        };
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

      set({
        formValues: updatedFormValues,
        formValuesByInstitutionType: {
          ...formValuesByInstitutionType,
          [institutionType]: updatedFormValues,
        },
      });

      // 同步到 RxJS 数据流（触发 debounce 和后续流程）
      directoriesDataFlow.updateFormValues({
        bizId,
        institutionType,
        entityType: updatedFormValues.entityType || '',
        formValues: updatedFormValues,
      });
    },

    // ========================================
    // RxJS 数据流方法
    // ========================================

    /**
     * 初始化 RxJS 数据流（替代 fetchDefaultViaBiz）
     */
    initializeDataFlow: async (bizId: DirectoriesBizIdEnum) => {
      if (!bizId) {
        return false;
      }

      set({ loadingConfig: true, bizId });

      try {
        // 1. 获取配置
        const response = await _fetchDirectoriesConfig({ bizId });
        const apiData = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const { configMap, buttonGroupConfig, firstInstitutionType } =
          convertToConfigMap(apiData);

        const formValuesByInstitutionType: Record<
          string,
          Record<string, any>
        > = {};
        Object.keys(configMap).forEach((institutionType) => {
          formValuesByInstitutionType[institutionType] = initializeFormValues(
            configMap[institutionType],
          );
        });

        const queryConfig = configMap[firstInstitutionType] || [];
        const currentFormValues =
          formValuesByInstitutionType[firstInstitutionType];

        set({
          configMap,
          buttonGroupConfig,
          queryConfig,
          institutionType: firstInstitutionType,
          formValuesByInstitutionType,
          formValues: currentFormValues,
          loadingConfig: false,
        });

        // 2. 初始化 RxJS 数据流
        directoriesDataFlow.updateFormValues({
          bizId,
          institutionType: firstInstitutionType,
          entityType: currentFormValues.entityType || '',
          formValues: currentFormValues,
        });

        return true;
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        set({ loadingConfig: false });
        return false;
      }
    },

    /**
     * 订阅 RxJS 数据流，将结果同步回 Zustand
     */
    syncFromRxJS: () => {
      // 订阅 Additional Details (B)
      const additionalSub = directoriesDataFlow.additionalDebounced$.subscribe(
        (additional) => {
          set({ additionalDetails: additional });

          // ✅ 关键：检测是否为配置数组结构（来自 API）
          // 配置格式：[{ key, label, actionType, children }, ...]
          // 手动编辑格式：{ checkbox: {...}, values: {...} }
          if (
            Array.isArray(additional) &&
            additional.length > 0 &&
            additional[0].actionType // 确保是配置对象，不是手动编辑数据
          ) {
            const { processAdditionalDetails } = get();
            processAdditionalDetails(additional);
          } else if (
            additional &&
            typeof additional === 'object' &&
            'checkbox' in additional
          ) {
            // Manual edit state, already updated by store
          }
        },
      );

      // 订阅 Final Data (C)
      const finalSub = directoriesDataFlow.finalData$.subscribe((finalData) => {
        set({ finalData });
      });

      // 订阅 Additional Details Loading 状态
      const loadingSub = directoriesDataFlow
        .getLoadingAdditional$()
        .subscribe((loading) => {
          console.log(`🔄 Loading Additional Details: ${loading}`);
          set({ loadingAdditional: loading });

          // ✅ 关键：A 变化时 loading=true，立即清空 B 的数据
          // 这样 UI 会立即显示 loading 状态，而不是显示旧的手动编辑数据
          if (loading) {
            console.log('🧹 Clearing Additional Details data (A changed)');
            set({
              additionalDetailsCheckbox: {},
              additionalDetailsValues: {},
              additionalDetailsConfig: [],
            });
          }
        });

      // 返回清理函数
      return () => {
        additionalSub.unsubscribe();
        finalSub.unsubscribe();
        loadingSub.unsubscribe();
      };
    },

    /**
     * 提交最终数据
     */
    submitFinalData: async () => {
      const { finalData } = get();

      if (!finalData) {
        console.warn('⚠️ No final data to submit');
        return;
      }

      try {
        set({ loadingResults: true });

        // TODO: 调用实际的提交 API
        // await _submitLeadsQuery(finalData);

        set({ loadingResults: false });
      } catch (error) {
        console.error('❌ Submit failed:', error);
        const { message, header, variant } = error as HttpError;
        SDRToast({ message, header, variant });
        set({ loadingResults: false });
      }
    },

    // ========================================
    // Additional Details 专用方法
    // ========================================

    /**
     * 处理 Additional Details 配置（来自 API）
     *
     * 功能：
     * 1. 保存配置结构到 additionalDetailsConfig
     * 2. 初始化 checkbox 和 values 双状态
     *
     * 注意：仅在收到新配置时调用，不在手动编辑时调用
     */
    processAdditionalDetails: (data: DirectoriesQueryItem[]) => {
      // 1. 保存配置数组
      set({ additionalDetailsConfig: data });

      // 2. 初始化状态（遍历数组中的每一项）
      const checkboxState: Record<string, boolean> = {};
      const valuesState: Record<string, any> = {};

      data.forEach((item) => {
        const { checkbox, values } = initializeAdditionalSelection(item);
        Object.assign(checkboxState, checkbox);
        Object.assign(valuesState, values);
      });

      set({
        additionalDetailsCheckbox: checkboxState,
        additionalDetailsValues: valuesState,
      });
    },

    /**
     * 更新 additional details 的选中状态（扁平结构）
     * @param key - 字段 key（可能为 null，表示分组）
     * @param value - 值（boolean for checkbox, string/array for select）
     * @param item - 配置项，用于判断是否需要全选 children
     */
    updateAdditionalSelection: (
      key: string | null,
      value: any,
      item?: DirectoriesQueryItem,
    ) => {
      const { additionalDetailsCheckbox, additionalDetailsValues } = get();

      // 如果 key 为 null 且有 children，则全选/取消全选 children（只影响 CHECKBOX）
      if (!key && item?.children) {
        // 递归收集所有 CHECKBOX 类型的 keys
        const collectChildKeys = (
          children: DirectoriesQueryItem[],
        ): string[] => {
          const keys: string[] = [];
          children.forEach((child) => {
            if (child.key && child.actionType === 'CHECKBOX') {
              keys.push(child.key);
            }
            if (child.children) {
              keys.push(...collectChildKeys(child.children));
            }
          });
          return keys;
        };

        const childKeys = collectChildKeys(item.children);

        // 更新 CHECKBOX 状态
        const newCheckbox = { ...additionalDetailsCheckbox };
        childKeys.forEach((childKey) => {
          newCheckbox[childKey] = value;
        });

        set({ additionalDetailsCheckbox: newCheckbox });

        // 触发 RxJS（传递双状态供下游使用）
        // 注意：不更新 additionalDetails，保持配置不变
        directoriesDataFlow.updateAdditionalManually({
          checkbox: newCheckbox,
          values: additionalDetailsValues,
        });
      } else if (key && item) {
        // 有 key：根据 actionType 更新不同的状态
        if (item.actionType === 'CHECKBOX') {
          const newCheckbox = { ...additionalDetailsCheckbox, [key]: value };
          set({ additionalDetailsCheckbox: newCheckbox });

          // 触发 RxJS（传递双状态供 finalData$ 使用）
          directoriesDataFlow.updateAdditionalManually({
            checkbox: newCheckbox,
            values: additionalDetailsValues,
          });
        } else if (item.actionType === 'SELECT') {
          const newValues = { ...additionalDetailsValues, [key]: value };
          set({ additionalDetailsValues: newValues });

          // 触发 RxJS（传递双状态供 finalData$ 使用）
          directoriesDataFlow.updateAdditionalManually({
            checkbox: additionalDetailsCheckbox,
            values: newValues,
          });
        }
      } else {
        console.warn(
          '⚠️  updateAdditionalSelection called with invalid params',
        );
      }
    },

    reset: () => {
      directoriesDataFlow.destroy();
      set(INITIAL_STATE);
    },
  }),
);

// ========================================
// 辅助函数：初始化 Additional Details 的选中状态
// ========================================

/**
 * 递归初始化 Additional Details 状态
 * 返回格式：{ checkbox: {}, values: {} }
 */
function initializeAdditionalSelection(config: DirectoriesQueryItem): {
  checkbox: Record<string, boolean>;
  values: Record<string, any>;
} {
  const checkbox: Record<string, boolean> = {};
  const values: Record<string, any> = {};

  if (!config || !config.children) {
    return { checkbox, values };
  }

  const processItem = (item: DirectoriesQueryItem) => {
    const { key, actionType, children, defaultValue } = item;

    // 处理 CHECKBOX
    if (actionType === 'CHECKBOX' && key) {
      checkbox[key] = defaultValue ?? false; // 默认未选中
    }

    // 处理 SELECT
    if (actionType === 'SELECT' && key) {
      // multiple 时初始化为空数组，single 时初始化为 null
      const isMultiple = item.optionMultiple ?? false;
      values[key] = defaultValue ?? (isMultiple ? [] : null);
    }

    // 递归处理子节点
    if (children && children.length > 0) {
      children.forEach((child) => processItem(child));
    }
  };

  config.children.forEach((child) => processItem(child));

  return { checkbox, values };
}
