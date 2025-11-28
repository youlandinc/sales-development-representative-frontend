import { DirectoriesBizIdEnum } from '@/types/directories';
import { UTypeOf } from '@/utils/UTypeOf';
import { HIERARCHICAL_CONFIG_BIZ_IDS } from '@/constants/directories';

/**
 * Form Values Data Structure
 *
 * Flat config (non-CAPITAL_MARKETS):
 * { bizId, formValues }
 *
 * Hierarchical config (CAPITAL_MARKETS):
 * { bizId, institutionType, entityType, formValues }
 */
export type DirectoriesFormValues = {
  bizId: DirectoriesBizIdEnum | '';
  formValues: Record<string, any>;
  // Hierarchical config only (CAPITAL_MARKETS only)
  institutionType?: string;
  entityType?: string;
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
 * Hierarchical config: { bizId, institutionType, entityType, ...formValues[entityType] }
 */
export const buildAdditionalRequestParams = (
  data: DirectoriesFormValues,
): Record<string, any> => {
  const { bizId, institutionType, entityType, formValues } = data;

  const requestData: Record<string, any> = {
    bizId,
  };

  // Hierarchical config: send institutionType and entityType
  const isHierarchical = HIERARCHICAL_CONFIG_BIZ_IDS.includes(
    bizId as DirectoriesBizIdEnum,
  );

  if (isHierarchical) {
    if (institutionType) {
      requestData.institutionType = institutionType;
    }
    if (entityType) {
      requestData.entityType = entityType;
    }
  }

  // Hierarchical config: group by entityType, Flat config: use formValues directly
  const entityData =
    isHierarchical && entityType ? formValues[entityType] || {} : formValues;

  mergeNonEmptyDirectoriesFields(requestData, entityData);

  return requestData;
};

/**
 * Build final combined data (query + additionalDetails)
 *
 * Flat config: { query: { bizId, ...formValues }, additionalDetails, timestamp }
 * Hierarchical config: { query: { bizId, institutionType, entityType, ...formValues }, additionalDetails, timestamp }
 */
export const buildFinalData = (
  formData: DirectoriesFormValues,
  additional: any,
) => {
  const processedAdditional = processAdditionalDetails(additional);

  const query: Record<string, any> = {
    bizId: formData.bizId,
    ...formData.formValues,
  };

  // Hierarchical config: add institutionType and entityType
  const isHierarchical = HIERARCHICAL_CONFIG_BIZ_IDS.includes(
    formData.bizId as DirectoriesBizIdEnum,
  );

  if (isHierarchical) {
    if (formData.institutionType) {
      query.institutionType = formData.institutionType;
    }
    if (formData.entityType) {
      query.entityType = formData.entityType;
    }
  }

  return {
    query,
    additionalDetails: processedAdditional,
    timestamp: Date.now(),
  };
};

/**
 * Build search/preview/import request params from finalData
 * Flattens nested structure into flat key-value pairs
 *
 * Flat config: { bizId, ...formValues, ...additionalDetails }
 * Hierarchical config: { bizId, institutionType, entityType, ...formValues[entityType], ...additionalDetails }
 */
export const buildSearchRequestParams = (
  finalData: any,
): Record<string, any> => {
  if (!finalData || !finalData.query) {
    return {};
  }

  const { query, additionalDetails } = finalData;
  const { bizId, institutionType, entityType } = query;

  const requestData: Record<string, any> = {
    bizId,
  };

  // Hierarchical config: send institutionType and entityType
  const isHierarchical = HIERARCHICAL_CONFIG_BIZ_IDS.includes(
    bizId as DirectoriesBizIdEnum,
  );

  if (isHierarchical) {
    if (institutionType) {
      requestData.institutionType = institutionType;
    }
    if (entityType) {
      requestData.entityType = entityType;
    }
  }

  // Hierarchical config: extract entityType's fields
  // Flat config: use query directly
  const entityData =
    isHierarchical && entityType ? query[entityType] || {} : query;
  mergeNonEmptyDirectoriesFields(requestData, entityData);

  // Flatten additional details fields
  if (UTypeOf.isObject(additionalDetails)) {
    mergeNonEmptyDirectoriesFields(requestData, additionalDetails);
  }

  return requestData;
};
