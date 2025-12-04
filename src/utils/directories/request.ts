import { DirectoriesBizIdEnum } from '@/types/directories';
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
  // Additional details authorization
  // When false, B (additional details) changes are ignored
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

    const additionalFieldsKeys = Object.entries(checkbox)
      .filter(([, value]) => value === true)
      .map(([key]) => key);

    return {
      additionalFields: additionalFieldsKeys,
      ...values,
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
    query[tabKey] = resolvedTabValue;
    const tabData = formValues[resolvedTabValue] || {};
    Object.assign(query, tabData);
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

  return requestData;
};
