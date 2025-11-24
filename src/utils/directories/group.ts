import { DirectoriesQueryItem } from '@/types/directories';

const isValueFilled = (value: any): boolean => {
  if (value == null) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'object') {
    const values = Object.values(value);
    return values.length > 0 && values.some((v) => isValueFilled(v));
  }
  return true;
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

    // Check if this field has a value
    const value = formValues[item.key];
    if (isValueFilled(value)) {
      count++;
    }

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
