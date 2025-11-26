import {
  DirectoriesQueryActionTypeEnum,
  DirectoriesQueryItem,
} from '@/types/directories';

export const additionalInit = (
  config: DirectoriesQueryItem,
): {
  checkbox: Record<string, boolean>;
  values: Record<string, any>;
} => {
  const checkbox: Record<string, boolean> = {};
  const values: Record<string, any> = {};

  if (!config || !config.children) {
    return { checkbox, values };
  }

  const processItem = (item: DirectoriesQueryItem) => {
    const { key, actionType, children, defaultValue } = item;

    if (actionType === DirectoriesQueryActionTypeEnum.checkbox && key) {
      checkbox[key] = defaultValue ?? false;
    }

    if (actionType === DirectoriesQueryActionTypeEnum.select && key) {
      const isMultiple = item.optionMultiple ?? false;
      values[key] = defaultValue ?? (isMultiple ? [] : null);
    }

    if (children && children.length > 0) {
      children.forEach((child) => processItem(child));
    }
  };

  config.children.forEach((child) => processItem(child));

  return { checkbox, values };
};

export const additionalCollectKeys = (
  children: DirectoriesQueryItem[],
): string[] => {
  const keys: string[] = [];

  children.forEach((child) => {
    if (
      child.key &&
      child.actionType === DirectoriesQueryActionTypeEnum.checkbox
    ) {
      keys.push(child.key);
    }
    if (child.children) {
      keys.push(...additionalCollectKeys(child.children));
    }
  });

  return keys;
};
