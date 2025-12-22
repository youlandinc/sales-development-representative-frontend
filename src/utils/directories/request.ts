import {
  DirectoriesBizIdEnum,
  DirectoriesQueryItem,
} from '@/types/directories';
import { UTypeOf } from '@/utils/UTypeOf';

/**
 * Form Values Data Structure
 *
 * L4 Flat config: { bizId, formValues }
 * L3 Tab-based flat config: { bizId, tabKey, tabValue, formValues }
 * L1 Hierarchical config: { bizId, buttonGroupKey, buttonGroupValue, tabKey, tabValue, formValues }
 * L2 ButtonGroup-only config: { bizId, buttonGroupKey, buttonGroupValue, formValues }
 */
export type DirectoriesFormValues = {
  bizId: DirectoriesBizIdEnum | '';
  formValues: Record<string, any>;
  // L1/L2: Dynamic key from BUTTON_GROUP config (e.g., 'institutionType')
  buttonGroupKey?: string;
  buttonGroupValue?: string;
  // L1/L3: Dynamic key from TAB config (e.g., 'entityType')
  tabKey?: string;
  tabValue?: string;
  // Additional details config existence
  // When false, this bizId doesn't have ADDITIONAL_DETAILS, skip B layer entirely
  hasAdditionalConfig?: boolean;
  // Additional details authorization
  // When false, user doesn't have permission for additional details
  additionalIsAuth?: boolean;
};

// ============================================
// Internal Helpers
// ============================================

/**
 * Check if a field value is considered empty for directories request params
 * Empty values: null, undefined, empty string, empty array
 */
const isEmptyDirectoriesFieldValue = (value: unknown): boolean => {
  return (
    UTypeOf.isNullish(value) ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  );
};

/**
 * Find a field value in formData, supporting nested structures (L1/L3)
 * Searches:
 * 1. Top-level: formData[key]
 * 2. Nested (L1/L3): formData[tabValue][key] where tabValue is a string value at top level
 */
const findFieldValueInFormData = (
  key: string,
  formData: Record<string, any>,
): unknown => {
  // First, check top-level
  if (key in formData) {
    return formData[key];
  }

  // Then, check nested structure (L1/L3: formData[tabValue][key])
  for (const topKey of Object.keys(formData)) {
    const topValue = formData[topKey];
    // If topValue is a string, it might be a tabKey pointing to tabValue
    // Check if formData[topValue] exists and contains our key
    if (typeof topValue === 'string' && formData[topValue]) {
      const nestedData = formData[topValue];
      if (
        typeof nestedData === 'object' &&
        nestedData !== null &&
        key in nestedData
      ) {
        return nestedData[key];
      }
    }
  }

  return undefined;
};

/**
 * Check if a condition is met based on formData
 * Condition format: "fieldKey=fieldValue"
 * - Array values: uses includes() for matching
 * - Scalar values: uses strict equality
 * - Supports nested formData structures (L1/L3)
 */
const isConditionMet = (
  condition: string,
  formData: Record<string, any>,
): boolean => {
  // Validate condition format
  if (!condition.includes('=')) {
    return true; // Invalid format, treat as met
  }

  const eqIndex = condition.indexOf('=');
  const conditionKey = condition.slice(0, eqIndex);
  const conditionValue = condition.slice(eqIndex + 1);

  // Skip invalid condition
  if (!conditionKey || !conditionValue) {
    return true; // Invalid format, treat as met
  }

  const fieldValue = findFieldValueInFormData(conditionKey, formData);

  if (Array.isArray(fieldValue)) {
    return fieldValue.includes(conditionValue);
  }
  return fieldValue === conditionValue;
};

/**
 * Recursively collect all field keys from a config tree
 */
const collectKeysFromConfig = (
  config: DirectoriesQueryItem,
  keys: Set<string>,
): void => {
  if (config.key) {
    keys.add(config.key);
  }
  if (config.children) {
    config.children.forEach((child) => collectKeysFromConfig(child, keys));
  }
};

/**
 * Collect all field keys that should be excluded due to unmet conditions
 *
 * Logic: A key is excluded only if ALL configs containing it have unmet conditions.
 * If ANY config containing the key has its condition met, the key is kept.
 *
 * This handles cases where the same key (e.g., 'activityTimframe') exists in
 * multiple mutually exclusive condition groups (e.g., Venture Capital vs Private Equity).
 */
export const collectExcludedKeysByCondition = (
  configs: DirectoriesQueryItem[],
  formData: Record<string, any>,
): Set<string> => {
  // Guard: return empty set if inputs are invalid
  if (!Array.isArray(configs) || !formData || typeof formData !== 'object') {
    return new Set<string>();
  }

  // Track keys that have at least one condition met
  const keysWithConditionMet = new Set<string>();
  // Track keys from configs with conditions (regardless of met/unmet)
  const keysWithCondition = new Set<string>();

  const traverse = (items: DirectoriesQueryItem[]): void => {
    items.forEach((config) => {
      if (config.condition) {
        // Collect all keys under this conditional config
        const configKeys = new Set<string>();
        collectKeysFromConfig(config, configKeys);

        configKeys.forEach((key) => keysWithCondition.add(key));

        if (isConditionMet(config.condition, formData)) {
          // Condition met, mark these keys as "should keep"
          configKeys.forEach((key) => keysWithConditionMet.add(key));
        }
      }

      if (config.children) {
        traverse(config.children);
      }
    });
  };

  traverse(configs);

  // Exclude keys that have conditions but none of them are met
  const excludedKeys = new Set<string>();
  keysWithCondition.forEach((key) => {
    if (!keysWithConditionMet.has(key)) {
      excludedKeys.add(key);
    }
  });

  return excludedKeys;
};

/**
 * Merge non-empty fields from source into target object
 */
const mergeNonEmptyDirectoriesFields = (
  target: Record<string, any>,
  source: Record<string, any>,
): void => {
  Object.keys(source).forEach((key) => {
    const value = source[key];
    if (!isEmptyDirectoriesFieldValue(value)) {
      target[key] = value;
    }
  });
};

// ============================================
// Exported Functions
// ============================================

/**
 * Process additional details data into standardized format
 * Supports two input formats:
 * 1. Dual-state format (from manual edits): { checkbox: {key: true/false}, values: {key: value} }
 * 2. Array format (from API): [...config items]
 *
 * Output format: { additionalFields: ['checkedKey1', 'checkedKey2'], ...otherValues }
 */
export const processAdditionalDetails = (additional: any): any => {
  // Handle array format (initial API data) or empty/invalid input
  if (!UTypeOf.isObject(additional) || UTypeOf.isEmptyObject(additional)) {
    return { additionalFields: [] };
  }

  // Handle dual-state format (manual edits): { checkbox: {...}, values: {...} }
  if ('checkbox' in additional && 'values' in additional) {
    const checkbox = additional.checkbox as Record<string, boolean>;
    const values = additional.values as Record<string, any>;

    console.log(checkbox, values);

    const checkedKeys = Object.entries(checkbox)
      .filter(([, isChecked]) => isChecked)
      .map(([key]) => key);

    // Only include values for checked fields (unchecked fields are excluded from request
    // but preserved in local store for re-enabling later)
    const filteredValues: Record<string, any> = {};
    checkedKeys.forEach((key) => {
      if (key in values) {
        filteredValues[key] = values[key];
      }
    });

    return {
      additionalFields: checkedKeys,
      ...filteredValues,
    };
  }

  return { additionalFields: [] };
};

/**
 * Build additional details request params from form values
 *
 * Flat config: { bizId, ...formValues }
 * Flat config with Tab: { bizId, entityType, ...formValues[entityType] }
 * Hierarchical config: { bizId, institutionType, entityType, ...formValues[entityType] }
 */
export const buildAdditionalRequestParams = (
  data: DirectoriesFormValues,
  options?: {
    configs?: DirectoriesQueryItem[];
    formData?: Record<string, unknown>;
  },
): Record<string, any> => {
  const {
    bizId,
    buttonGroupKey,
    buttonGroupValue,
    tabKey,
    tabValue,
    formValues,
  } = data;

  const requestData: Record<string, any> = {
    bizId,
  };

  // Detect config type by data structure:
  // - hasButtonGroup: L1/L2 (has BUTTON_GROUP)
  // - hasTab: L1/L3 (has TAB)
  const hasButtonGroup = !!buttonGroupKey && !!buttonGroupValue;
  const resolvedTabValue = tabValue || (tabKey ? formValues?.[tabKey] : null);
  const hasTab = !!tabKey && !!resolvedTabValue;

  if (hasButtonGroup) {
    // L1/L2: Has BUTTON_GROUP, send buttonGroupKey=buttonGroupValue
    requestData[buttonGroupKey] = buttonGroupValue;
    if (hasTab && tabKey) {
      // L1: Has both BUTTON_GROUP + TAB
      requestData[tabKey] = resolvedTabValue;
      const tabData = formValues[resolvedTabValue] || {};
      mergeNonEmptyDirectoriesFields(requestData, tabData);
    } else {
      // L2: Has BUTTON_GROUP only
      mergeNonEmptyDirectoriesFields(requestData, formValues);
    }
  } else if (hasTab && tabKey) {
    // L3: Tab-based flat config, send tabKey=tabValue
    requestData[tabKey] = resolvedTabValue;
    const tabData = formValues[resolvedTabValue] || {};
    mergeNonEmptyDirectoriesFields(requestData, tabData);
  } else {
    // L4: Pure flat config, use formValues directly
    mergeNonEmptyDirectoriesFields(requestData, formValues);
  }

  // Filter out keys that don't meet their condition
  if (options?.configs && options?.formData) {
    const excludedKeys = collectExcludedKeysByCondition(
      options.configs,
      options.formData,
    );
    excludedKeys.forEach((key) => {
      delete requestData[key];
    });
  }

  return requestData;
};

/**
 * Build final combined data (query + additionalDetails)
 *
 * Flat config: { query: { bizId, ...formValues }, additionalDetails, timestamp }
 * Flat config with Tab: { query: { bizId, entityType, ...formValues[entityType] }, additionalDetails, timestamp }
 * Hierarchical config: { query: { bizId, institutionType, entityType, ...formValues }, additionalDetails, timestamp }
 */
export const buildFinalData = (
  formData: DirectoriesFormValues,
  additional: any,
) => {
  const processedAdditional = processAdditionalDetails(additional);

  const { buttonGroupKey, buttonGroupValue, tabKey, tabValue, formValues } =
    formData;

  // Detect config type by data structure
  const hasButtonGroup = !!buttonGroupKey && !!buttonGroupValue;
  const resolvedTabValue = tabValue || (tabKey ? formValues?.[tabKey] : null);
  const hasTab = !!tabKey && !!resolvedTabValue;

  const query: Record<string, any> = {
    bizId: formData.bizId,
  };

  if (hasButtonGroup) {
    // L1/L2: Has BUTTON_GROUP
    query[buttonGroupKey] = buttonGroupValue;
    if (hasTab && tabKey) {
      // L1: Has both BUTTON_GROUP + TAB, include all formValues + tabKey
      Object.assign(query, formValues);
      query[tabKey] = resolvedTabValue;
    } else {
      // L2: Has BUTTON_GROUP only, include all formValues
      Object.assign(query, formValues);
    }
  } else if (hasTab && tabKey) {
    // L3: Tab-based flat config, only include tab's data
    const tabData = formValues[resolvedTabValue] || {};
    Object.assign(query, tabData);
    // Set tabKey after Object.assign to prevent tabData from overwriting it
    // (some configs have tabKey in tabData with null value)
    query[tabKey] = resolvedTabValue;
  } else {
    // L4: Pure flat config, include all formValues
    Object.assign(query, formValues);
  }

  return {
    query,
    additionalDetails: processedAdditional,
    timestamp: Date.now(),
    // Pass keys for buildSearchRequestParams
    _meta: { buttonGroupKey, tabKey },
  };
};

/**
 * Build search/preview/import request params from finalData
 * Flattens nested structure into flat key-value pairs
 *
 * Flat config: { bizId, ...formValues, ...additionalDetails }
 * Flat config with Tab: { bizId, entityType, ...formValues[entityType], ...additionalDetails }
 * Hierarchical config: { bizId, institutionType, entityType, ...formValues[entityType], ...additionalDetails }
 */
export const buildSearchRequestParams = (
  finalData: any,
  options?: {
    configs?: DirectoriesQueryItem[];
    formData?: Record<string, any>;
  },
): Record<string, any> => {
  if (!finalData || !finalData.query) {
    return {};
  }

  const { query, additionalDetails, _meta } = finalData;
  const { bizId } = query;
  const buttonGroupKey = _meta?.buttonGroupKey;
  const tabKey = _meta?.tabKey;

  const requestData: Record<string, any> = {
    bizId,
  };

  // Detect config type by query structure using dynamic keys
  const buttonGroupValue = buttonGroupKey ? query[buttonGroupKey] : null;
  const tabValue = tabKey ? query[tabKey] : null;
  const hasButtonGroup = !!buttonGroupKey && !!buttonGroupValue;
  const hasTab = !!tabKey && !!tabValue;

  if (hasButtonGroup) {
    // L1/L2: Has BUTTON_GROUP
    requestData[buttonGroupKey] = buttonGroupValue;
    if (hasTab) {
      // L1: Has both BUTTON_GROUP + TAB, extract tab's fields
      requestData[tabKey] = tabValue;
      const tabData = query[tabValue] || {};
      mergeNonEmptyDirectoriesFields(requestData, tabData);
    } else {
      // L2: Has BUTTON_GROUP only, merge query fields (excluding bizId and buttonGroupKey)
      Object.keys(query).forEach((key) => {
        if (key !== 'bizId' && key !== buttonGroupKey) {
          const value = query[key];
          if (!isEmptyDirectoriesFieldValue(value)) {
            requestData[key] = value;
          }
        }
      });
    }
  } else if (hasTab) {
    // L3: Tab-based flat config, send tabKey=tabValue, query already contains only tab's fields
    requestData[tabKey] = tabValue;
    mergeNonEmptyDirectoriesFields(requestData, query);
  } else {
    // L4: Pure flat config, use query directly
    mergeNonEmptyDirectoriesFields(requestData, query);
  }

  // Flatten additional details fields
  if (UTypeOf.isObject(additionalDetails)) {
    mergeNonEmptyDirectoriesFields(requestData, additionalDetails);
  }

  // Filter out keys that don't meet their condition
  if (options?.configs && options?.formData) {
    const excludedKeys = collectExcludedKeysByCondition(
      options.configs,
      options.formData,
    );
    excludedKeys.forEach((key) => {
      delete requestData[key];
    });
  }

  return requestData;
};
