import { BehaviorSubject, combineLatest, EMPTY, from, merge, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  scan,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';

import { _fetchDirectoriesAdditionalConfig } from '@/request/directories';
import { DirectoriesBizIdEnum } from '@/types/Directories';

/**
 * Directories 数据流服务
 *
 * 数据流：
 * A (formValues) → debounce 500ms → B (additionalDetails) → debounce 500ms → C (finalData) → debounce 300ms
 *
 * A: 表单数据（来自 Zustand）
 * B: Additional details（依赖 A，可独立修改）
 * C: 最终提交数据 = A + B
 */
class DirectoriesDataFlow {
  // ========================================
  // 配置项
  // ========================================
  private readonly DEBOUNCE_TIME = {
    FORM_VALUES: 500, // A 的 debounce
    ADDITIONAL: 500, // B 的 debounce
    FINAL_DATA: 300, // C 的 debounce
  };

  // ========================================
  // 数据源 A: 表单数据
  // ========================================
  private formValuesRaw$ = new BehaviorSubject<{
    bizId: DirectoriesBizIdEnum | '';
    institutionType: string;
    entityType: string;
    formValues: Record<string, any>;
  }>({
    bizId: '',
    institutionType: '',
    entityType: '',
    formValues: {},
  });

  // A debounced (500ms)
  public formValuesDebounced$ = this.formValuesRaw$.pipe(
    debounceTime(this.DEBOUNCE_TIME.FORM_VALUES),
    distinctUntilChanged(
      (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
    ),
    shareReplay(1),
  );

  // ========================================
  // 数据源 B: Additional Details（依赖 A）
  // ========================================

  // B1: 从 A 自动获取的数据
  private additionalFromA$ = this.formValuesDebounced$.pipe(
    filter(
      (values) =>
        !!values.bizId &&
        !!values.institutionType &&
        !!values.entityType &&
        Object.keys(values.formValues).length > 0,
    ),
    tap(() => {
      // A 变化时立即设置 loading = true
      console.log('🔄 A changed, loading Additional Details...');
      this.loadingAdditional$.next(true);
    }),
    switchMap((data) => {
      // ✅ 在发起请求时捕获 A 的值，避免时序问题
      const formValuesKey = JSON.stringify(data);

      return from(this._fetchAdditionalDetails(data)).pipe(
        map((results) => ({
          source: 'api' as const,
          data: results,
          formValuesKey, // 携带发起请求时的 A
        })),
        catchError((error) => {
          console.error('❌ Fetch additional details failed:', error);
          // ✅ 不返回 null，返回空对象，让流继续
          return of({
            source: 'api' as const,
            data: {},
            formValuesKey, // 即使失败也携带 A 的标识
          });
        }),
        tap((result) => {
          // B 到达时设置 loading = false
          console.log('✅ Additional Details loaded:', {
            source: result.source,
            dataType: Array.isArray(result.data) ? 'array' : typeof result.data,
            dataLength: Array.isArray(result.data) ? result.data.length : 'N/A',
          });
          this.loadingAdditional$.next(false);
        }),
      );
    }),
    // ✅ 移除 filter，避免流卡住
    shareReplay(1),
  );

  // B2: 手动编辑的数据
  private additionalManualEdit$ = new BehaviorSubject<any>(null);

  // B = B1 + B2 合并（手动编辑优先，但 A 变化时重置）
  private additionalCombined$ = merge(
    // API 结果流：已经携带了发起请求时的 A 标识
    this.additionalFromA$,
    // 手动编辑流
    this.additionalManualEdit$.pipe(
      filter((data) => data !== null),
      map((data) => ({
        source: 'manual' as const,
        data,
        formValuesKey: null as string | null,
      })),
    ),
  ).pipe(
    scan<
      any,
      {
        source: 'api' | 'manual';
        data: any;
        hasManualEdit: boolean;
        formValuesKey: string | null;
      }
    >(
      (acc, curr) => {
        // A 变化了，重置手动编辑状态
        if (
          curr.source === 'api' &&
          curr.formValuesKey &&
          curr.formValuesKey !== acc.formValuesKey
        ) {
          return {
            source: curr.source,
            data: curr.data,
            hasManualEdit: false, // 重置手动编辑标记
            formValuesKey: curr.formValuesKey,
          };
        }

        // 手动编辑优先
        if (curr.source === 'manual') {
          return {
            source: curr.source,
            data: curr.data,
            hasManualEdit: true,
            formValuesKey: acc.formValuesKey, // 保持当前 A 的标识
          };
        }

        // API 结果只在没有手动编辑时更新
        if (acc.hasManualEdit) {
          return acc; // 保持手动编辑的数据
        }
        return {
          source: curr.source,
          data: curr.data,
          hasManualEdit: false,
          formValuesKey: curr.formValuesKey || acc.formValuesKey,
        };
      },
      {
        source: 'api' as const,
        data: null,
        hasManualEdit: false,
        formValuesKey: null,
      },
    ),
    shareReplay(1),
  );

  // 对外暴露的 additionalDebounced$，只返回 data 部分
  // 用于 Zustand 或其他外部订阅者
  public additionalDebounced$ = this.additionalCombined$.pipe(
    map((result) => result.data),
  );

  // ========================================
  // 数据源 C: 最终组合数据 = A + B
  // ========================================
  // 架构说明：
  // 1. switchMap: A 变化时重新订阅，避免旧 B + 新 A 的错误组合
  // 2. combineLatest: 内层监听 B 和 loading，B 手动编辑时也能触发
  // 3. filter: 阻塞 loading=true 或 formValuesKey 不匹配
  public finalData$ = this.formValuesDebounced$.pipe(
    switchMap((formData) => {
      // 检查 A 是否满足条件
      if (
        !formData.bizId ||
        !formData.institutionType ||
        !formData.entityType ||
        Object.keys(formData.formValues).length === 0
      ) {
        console.log('⚠️ A incomplete, skipping B request');
        return EMPTY;
      }

      const currentFormValuesKey = JSON.stringify(formData);

      // 内层 combineLatest：监听 B 和 loading
      // 关键：B 的任何变化（API 或手动编辑）都会触发这里
      return combineLatest([
        this.additionalCombined$,
        this.loadingAdditional$,
      ]).pipe(
        // 过滤条件：loading=false && formValuesKey 匹配
        filter(([result, isLoading]) => {
          // 阻塞：loading 中
          if (isLoading) {
            return false;
          }

          // 允许初始状态
          if (!result.formValuesKey) {
            return true;
          }

          // 检查 formValuesKey 匹配
          const isMatch = result.formValuesKey === currentFormValuesKey;
          return isMatch;
        }),
        // 提取数据并组装
        map(([result]) => {
          const additional = result.data;
          const finalData = this._assembleFinalData(formData, additional);

          // 🔍 打印最终请求数据
          console.log('📦 Final Data for Table Request:', {
            query: finalData.query,
            additionalDetails: finalData.additionalDetails,
            timestamp: new Date(finalData.timestamp).toLocaleString(),
          });

          return finalData;
        }),
      );
    }),
    // C 最终 debounce (300ms)：
    // 原因1: 防止 B 手动编辑时频繁触发（用户快速点击多个 checkbox）
    // 原因2: 确保数据完全稳定后才触发 Zustand 更新和组件重新渲染
    // 注：如果希望手动编辑立即响应，可以移除此 debounce
    debounceTime(this.DEBOUNCE_TIME.FINAL_DATA),
    distinctUntilChanged(
      (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
    ),
    shareReplay(1),
  );

  // ========================================
  // 辅助状态
  // ========================================
  // 注：loadingConfig 由 Zustand 管理，这里只管理 additionalDetails 的加载状态
  private loadingAdditional$ = new BehaviorSubject<boolean>(false);

  // ========================================
  // 公开方法
  // ========================================

  /**
   * 获取 additionalDetails 的 loading 状态
   * @returns Observable<boolean> - true 表示正在请求新的 B
   */
  public getLoadingAdditional$() {
    return this.loadingAdditional$.asObservable();
  }

  /**
   * 更新 A（表单数据变化）
   */
  updateFormValues(data: {
    bizId: DirectoriesBizIdEnum | '';
    institutionType: string;
    entityType: string;
    formValues: Record<string, any>;
  }) {
    console.log('📝 Updating form values:', {
      bizId: data.bizId,
      institutionType: data.institutionType,
      entityType: data.entityType,
    });
    this.formValuesRaw$.next(data);
  }

  /**
   * 手动编辑 B（Additional Details）
   */
  updateAdditionalManually(data: any) {
    this.additionalManualEdit$.next(data);
  }

  /**
   * 清理资源
   */
  destroy() {
    console.log('🧹 Destroying directories data flow');
    this.formValuesRaw$.complete();
    this.additionalManualEdit$.complete();
    this.loadingAdditional$.complete();
  }

  // ========================================
  // 私有方法
  // ========================================

  /**
   * 请求 Additional Details
   */
  private async _fetchAdditionalDetails(data: {
    bizId: DirectoriesBizIdEnum | '';
    institutionType: string;
    entityType: string;
    formValues: Record<string, any>;
  }) {
    const requestData = this._assembleAdditionalRequest(data);
    console.log('📡 Fetching additional details with:', requestData);

    this.loadingAdditional$.next(true);

    try {
      const response = await _fetchDirectoriesAdditionalConfig(requestData);
      this.loadingAdditional$.next(false);
      return response?.data || null;
    } catch (error) {
      this.loadingAdditional$.next(false);
      throw error;
    }
  }

  /**
   * 组装 Additional Details 请求数据
   * 根据 entityType 和 institutionType 从 formValues 中提取对应的数据
   */
  private _assembleAdditionalRequest(data: {
    bizId: DirectoriesBizIdEnum | '';
    institutionType: string;
    entityType: string;
    formValues: Record<string, any>;
  }) {
    const { bizId, institutionType, entityType, formValues } = data;

    // 获取当前 entityType 的数据
    const entityData = formValues[entityType] || {};

    // 基础字段
    const requestData: any = {
      bizId,
      institutionType,
      entityType,
    };

    // 合并 entityType 对应的所有字段
    Object.keys(entityData).forEach((key) => {
      const value = entityData[key];
      // 跳过空值
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      }
      requestData[key] = value;
    });

    // 注意：不需要合并顶层字段
    // formValues 的结构是嵌套分组的：
    // {
    //   institutionType: '...',
    //   entityType: 'FIRM',
    //   FIRM: { firmName: '...', ... },
    //   EXECUTIVE: { ... },  // ← 不应该包含其他 entityType 的数据
    // }
    // 所有业务字段都在 formValues[entityType] 中

    return requestData;
  }

  /**
   * 组装最终请求数据 C = A + B
   */
  private _assembleFinalData(
    formData: {
      bizId: DirectoriesBizIdEnum | '';
      institutionType: string;
      entityType: string;
      formValues: Record<string, any>;
    },
    additional: any,
  ) {
    // 转换 additionalDetails 格式
    // 从 {key: boolean/value} → {show: ['key1', 'key2']}
    const processedAdditional = this._processAdditionalDetails(additional);

    return {
      // A 的数据
      query: {
        bizId: formData.bizId,
        institutionType: formData.institutionType,
        entityType: formData.entityType,
        ...formData.formValues,
      },
      // B 的数据（已处理）
      additionalDetails: processedAdditional,
      // 元数据
      timestamp: Date.now(),
    };
  }

  /**
   * 处理 additionalDetails 数据格式
   *
   * 支持两种格式：
   * 1. 双状态格式（手动编辑）：{ checkbox: {...}, values: {...} }
   * 2. 配置数组格式（API）：[{ key, label, actionType, children }]
   *
   * 输出格式：{ show: ['key1', 'key2'], key1: value1, key2: value2 }
   *
   * @param additional - 原始的 additional 数据
   * @returns 处理后的格式
   */
  private _processAdditionalDetails(additional: any): any {
    if (!additional || typeof additional !== 'object') {
      return { show: [] };
    }

    // 1. 检测双状态格式（手动编辑）
    if ('checkbox' in additional && 'values' in additional) {
      const { checkbox, values } = additional;

      // 从 checkbox 中提取所有 true 的 keys
      const showKeys = Object.entries(checkbox)
        .filter(([, value]) => value === true)
        .map(([key]) => key);

      // 组装输出：show 数组 + values 对象
      return {
        show: showKeys,
        ...values, // 展开 SELECT 等字段的值
      };
    }

    // 2. 检测配置数组格式（API 返回，第一次加载）
    if (Array.isArray(additional)) {
      return { show: [] };
    }

    // 3. 未知格式
    console.warn('⚠️ Unknown additional format:', additional);
    return { show: [] };
  }
}

// 单例导出
export const directoriesDataFlow = new DirectoriesDataFlow();
