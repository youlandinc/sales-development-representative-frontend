import { DirectoriesBizIdEnum } from '@/types/directories';
import { UTypeOf } from '@/utils/UTypeOf';

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
  if (!additional || typeof additional !== 'object') {
    return { additionalFields: [] };
  }

  // Handle dual-state format (manual edits)
  if ('checkbox' in additional && 'values' in additional) {
    const { checkbox, values } = additional;

    const additionalFieldsKeys = Object.entries(checkbox)
      .filter(([, value]) => value === true)
      .map(([key]) => key);

    return {
      additionalFields: additionalFieldsKeys,
      ...values,
    };
  }

  // Handle array format (initial API data)
  if (Array.isArray(additional)) {
    return { additionalFields: [] };
  }

  return { additionalFields: [] };
};

/**
 * Build additional details request params from form values
 * Input: { bizId, entityType: 'FIRM', formValues: { FIRM: {...}, EXECUTIVE: {...} } }
 * Output: { bizId, entityType: 'FIRM', ...FIRM fields }
 */
export const buildAdditionalRequestParams = (data: {
  bizId: DirectoriesBizIdEnum | '';
  institutionType: string;
  entityType: string;
  formValues: Record<string, any>;
}): Record<string, any> => {
  const { bizId, institutionType, entityType, formValues } = data;

  const entityData = formValues[entityType] || {};

  const requestData: Record<string, any> = {
    bizId,
    institutionType,
    entityType,
  };

  mergeNonEmptyDirectoriesFields(requestData, entityData);

  return requestData;
};

/**
 * Build final combined data (query + additionalDetails)
 * Output structure:
 * {
 *   query: { bizId, institutionType, entityType, ...all formValues },
 *   additionalDetails: { additionalFields: ['key1'], ...values },
 *   timestamp: number
 * }
 */
export const buildFinalData = (
  formData: {
    bizId: DirectoriesBizIdEnum | '';
    institutionType: string;
    entityType: string;
    formValues: Record<string, any>;
  },
  additional: any,
) => {
  const processedAdditional = processAdditionalDetails(additional);

  return {
    query: {
      bizId: formData.bizId,
      institutionType: formData.institutionType,
      entityType: formData.entityType,
      ...formData.formValues,
    },
    additionalDetails: processedAdditional,
    timestamp: Date.now(),
  };
};

/**
 * Build search/preview/import request params from finalData
 * Flattens nested structure into flat key-value pairs
 * Input: { query: { bizId, entityType, FIRM: {...} }, additionalDetails: {...} }
 * Output: { bizId, entityType, ...FIRM fields, ...additionalDetails }
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
    institutionType,
    entityType,
  };

  // Flatten current entityType's fields
  const entityData = query[entityType] || {};
  mergeNonEmptyDirectoriesFields(requestData, entityData);

  // Flatten additional details fields
  if (additionalDetails && typeof additionalDetails === 'object') {
    mergeNonEmptyDirectoriesFields(requestData, additionalDetails);
  }

  return requestData;
};
