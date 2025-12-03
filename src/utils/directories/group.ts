import { DirectoriesQueryItem } from '@/types/directories';
import { UTypeOf } from '@/utils';

const getValueCount = (value: unknown): number => {
  if (UTypeOf.isNullish(value)) {
    return 0;
  }

  if (UTypeOf.isArray(value)) {
    return value.length;
  }

  if (UTypeOf.isString(value)) {
    return value.trim() === '' ? 0 : 1;
  }

  if (UTypeOf.isNumber(value) || UTypeOf.isBoolean(value)) {
    return 1;
  }

  if (UTypeOf.isObject(value)) {
    // For objects (e.g., date_range_select with { selectType, startDate, endDate }),
    // count as 1 if any value inside is filled
    const hasAnyValue = Object.values(value).some((v) => getValueCount(v) > 0);
    return hasAnyValue ? 1 : 0;
  }

  return 1;
};

export const countFilledFieldsInGroup = (
  groupConfig: DirectoriesQueryItem,
  formValues: Record<string, any>,
): number => {
  if (!groupConfig.children || groupConfig.children.length === 0) {
    return 0;
  }

  let count = 0;

  const checkItem = (item: DirectoriesQueryItem) => {
    // Skip items without key (they are just containers/labels)
    if (!item.key) {
      // But check their children
      if (item.children && item.children.length > 0) {
        item.children.forEach(checkItem);
      }
      return;
    }

    // Count based on value type
    const value = formValues[item.key];
    count += getValueCount(value);

    // Recursively check children
    if (item.children && item.children.length > 0) {
      item.children.forEach(checkItem);
    }
  };

  groupConfig.children.forEach(checkItem);

  return count;
};

export const getGroupFilterSummary = (count: number): string => {
  if (count === 0) {
    return '';
  }
  return `${count} filter${count > 1 ? 's' : ''}`;
};

/**
 * Collect all keys from a group config tree
 */
export const collectKeysFromGroup = (
  groupConfig: DirectoriesQueryItem,
): string[] => {
  const keys: string[] = [];

  const collectItem = (item: DirectoriesQueryItem) => {
    if (item.key) {
      keys.push(item.key);
    }
    if (item.children && item.children.length > 0) {
      item.children.forEach(collectItem);
    }
  };

  if (groupConfig.children && groupConfig.children.length > 0) {
    groupConfig.children.forEach(collectItem);
  }

  // Also include the group's own key if it has one (e.g., excludeFirms)
  if (groupConfig.key) {
    keys.push(groupConfig.key);
  }

  return keys;
};
