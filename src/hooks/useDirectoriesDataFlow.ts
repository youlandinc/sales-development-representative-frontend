import { useEffect } from 'react';
import { useDirectoriesStore } from '@/stores/directories';
import { DirectoriesBizIdEnum } from '@/types/Directories';

/**
 * Directories 数据流 Hook
 *
 * 封装 Zustand + RxJS 的集成逻辑，简化组件使用
 *
 * @example
 * ```tsx
 * const {
 *   formValues,
 *   additionalDetails,
 *   additionalDetailsCheckbox,  // CHECKBOX 勾选状态
 *   additionalDetailsValues,     // SELECT 等字段的值
 *   finalData,
 *   updateFormValues,
 *   updateAdditionalSelection,
 *   submitFinalData
 * } = useDirectoriesDataFlow(bizId);
 * ```
 */
export const useDirectoriesDataFlow = (bizId: DirectoriesBizIdEnum) => {
  const {
    // 状态
    formValues,
    institutionType,
    queryConfig,
    additionalDetails,
    finalData,
    loadingConfig,
    loadingAdditional,
    loadingResults,

    // Additional Details 专用状态
    additionalDetailsConfig,
    additionalDetailsCheckbox,
    additionalDetailsValues,

    // 方法
    initializeDataFlow,
    syncFromRxJS,
    updateFormValues,
    updateAdditionalSelection,
    submitFinalData,
  } = useDirectoriesStore();

  // 初始化数据流
  useEffect(() => {
    if (bizId) {
      initializeDataFlow(bizId);
    }
  }, [bizId, initializeDataFlow]);

  // 订阅 RxJS 数据流
  useEffect(() => {
    const cleanup = syncFromRxJS();
    return cleanup;
  }, [syncFromRxJS]);

  return {
    // 数据
    formValues,
    institutionType,
    queryConfig,
    additionalDetails, // B: Additional details
    finalData, // C: A + B

    // Additional Details 专用
    additionalDetailsConfig, // 配置结构（数组）
    additionalDetailsCheckbox, // CHECKBOX 勾选状态
    additionalDetailsValues, // SELECT 等字段的值

    // Loading 状态
    loadingConfig,
    loadingAdditional,
    loadingResults,
    isLoading: loadingConfig || loadingAdditional || loadingResults,

    // 操作
    updateFormValues,
    updateAdditionalSelection, // 更新 Additional Details 状态（自动判断 checkbox/values）
    submitFinalData,
  };
};
