import {
  DirectoriesBizIdEnum,
  DirectoriesEntityTypeEnum,
  DirectoriesQueryComponentNameEnum,
  DirectoriesQueryGroupTypeEnum,
  DirectoriesQueryItem,
} from '@/types/directories';
import { DIRECTORIES } from '@/constants/directories';

export const getDirectoriesBizId = (slug: string): DirectoriesBizIdEnum => {
  const entry = Object.entries(DIRECTORIES).find(([, v]) => v.slug === slug);
  return (
    (entry?.[0] as DirectoriesBizIdEnum) || DirectoriesBizIdEnum.capital_markets
  );
};

// ========================================
// Config Parse: Flat Config
// ========================================
export type FlatConfigResult = {
  configMap: Record<string, DirectoriesQueryItem[]>;
  buttonGroupConfig: null;
  firstKey: string;
};

const parseFlatConfig = (
  apiData: DirectoriesQueryItem[],
  bizId: DirectoriesBizIdEnum,
): FlatConfigResult => {
  return {
    configMap: { [bizId]: apiData },
    buttonGroupConfig: null,
    firstKey: bizId,
  };
};

// ========================================
// Config Parse: Hierarchical Config (BUTTON_GROUP)
// ========================================
export type HierarchicalConfigResult = {
  configMap: Record<string, DirectoriesQueryItem[]>;
  buttonGroupConfig: DirectoriesQueryItem | null;
  firstKey: string;
};

const parseHierarchicalConfig = (
  apiData: DirectoriesQueryItem[],
): HierarchicalConfigResult => {
  const buttonGroup = apiData.find(
    (item) => item.groupType === DirectoriesQueryGroupTypeEnum.button_group,
  );

  if (!buttonGroup || !buttonGroup.children) {
    return { configMap: {}, buttonGroupConfig: null, firstKey: '' };
  }

  const configMap: Record<string, DirectoriesQueryItem[]> = {};

  buttonGroup.children.forEach((child) => {
    const buttonGroupValue = child.defaultValue;
    if (buttonGroupValue && child.children) {
      configMap[buttonGroupValue] = child.children;
    }
  });

  const firstKey = buttonGroup.children[0]?.defaultValue || '';

  const buttonGroupConfig: DirectoriesQueryItem = {
    ...buttonGroup,
    children: null,
  };

  return { configMap, buttonGroupConfig, firstKey };
};

// ========================================
// Config Parse: Entry Function
// ========================================
export type ConfigParseResult = FlatConfigResult | HierarchicalConfigResult;

/**
 * Get BUTTON_GROUP key from config (e.g., 'institutionType')
 * Returns null if no BUTTON_GROUP found
 */
export const getButtonGroupKey = (
  configs: DirectoriesQueryItem[],
): string | null => {
  const buttonGroup = configs.find(
    (c) => c.groupType === DirectoriesQueryGroupTypeEnum.button_group,
  );
  return buttonGroup?.key || null;
};

/**
 * Get TAB key from config (e.g., 'entityType')
 * Returns null if no TAB found
 * Searches recursively in children
 */
export const getTabKey = (configs: DirectoriesQueryItem[]): string | null => {
  for (const config of configs) {
    if (config.groupType === DirectoriesQueryGroupTypeEnum.tab && config.key) {
      return config.key;
    }
    if (config.children?.length) {
      const found = getTabKey(config.children);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/**
 * Check if config has BUTTON_GROUP
 */
export const hasButtonGroup = (configs: DirectoriesQueryItem[]): boolean => {
  return getButtonGroupKey(configs) !== null;
};

/**
 * Check if config has TAB
 */
export const hasTab = (configs: DirectoriesQueryItem[]): boolean => {
  return getTabKey(configs) !== null;
};

export const configParse = (
  apiData: DirectoriesQueryItem[],
  bizId: DirectoriesBizIdEnum,
): ConfigParseResult => {
  if (!apiData || apiData.length === 0) {
    return { configMap: {}, buttonGroupConfig: null, firstKey: '' };
  }

  // Detect by config feature: has BUTTON_GROUP → hierarchical
  if (getButtonGroupKey(apiData) !== null) {
    return parseHierarchicalConfig(apiData);
  }

  return parseFlatConfig(apiData, bizId);
};

export const configInitFormValues = (
  configs: DirectoriesQueryItem[],
): Record<string, any> => {
  const result: Record<string, any> = {};

  if (!configs || configs.length === 0) {
    return result;
  }

  // Find TAB config for hierarchical structure
  const entityTypeConfig = configs.find(
    (c) =>
      c.groupType === DirectoriesQueryGroupTypeEnum.tab && c.isGroup && c.key,
  );

  const isHierarchical = !!(
    entityTypeConfig && entityTypeConfig.children?.length
  );

  // ========================================
  // Flat Config: process all configs directly
  // ========================================
  if (!isHierarchical) {
    configs.forEach((config) => {
      collectFormKeys(config, result);
    });
    return result;
  }

  // ========================================
  // Hierarchical Config: process by tabs
  // ========================================

  // 1. Set entityType default value
  const defaultEntityType =
    entityTypeConfig.defaultValue ?? entityTypeConfig.optionValues?.[0]?.value;

  if (entityTypeConfig.key) {
    result[entityTypeConfig.key] =
      defaultEntityType ?? DirectoriesEntityTypeEnum.firm;
  }

  // 2. Process each tab's children (exclude_* is inside tab children, handled by recursion)
  entityTypeConfig.children!.forEach((tabChild, index) => {
    const tabKey = entityTypeConfig.optionValues?.[index]?.value;
    if (tabKey) {
      result[tabKey] = {};
      collectFormKeys(tabChild, result[tabKey]);
    }
  });

  return result;
};

const collectFormKeys = (
  config: DirectoriesQueryItem,
  result: Record<string, any>,
): void => {
  const { groupType, key, children, componentName } = config;

  if (componentName === DirectoriesQueryComponentNameEnum.date_range_select) {
    if (key) {
      result[key] = {
        selectType: '',
        startDate: '',
        endDate: '',
      };
    }
    return;
  }

  if (groupType === DirectoriesQueryGroupTypeEnum.general) {
    if (children && children.length > 0) {
      children.forEach((child) => {
        collectFormKeys(child, result);
      });
    }
    return;
  }

  if (
    groupType === DirectoriesQueryGroupTypeEnum.exclude_firms ||
    groupType === DirectoriesQueryGroupTypeEnum.exclude_individuals
  ) {
    if (key) {
      result[key] = {
        tableId: '',
        tableFieldId: '',
        tableViewId: '',
        keywords: [],
      };
    }
    return;
  }

  if (groupType === DirectoriesQueryGroupTypeEnum.additional_details) {
    return;
  }

  if (key) {
    result[key] = null;
  }

  if (children && children.length > 0) {
    children.forEach((child) => {
      collectFormKeys(child, result);
    });
  }
};

/**
 * Find ADDITIONAL_DETAILS config recursively
 */
const findAdditionalDetailsConfig = (
  configs: DirectoriesQueryItem[],
): DirectoriesQueryItem | undefined => {
  for (const config of configs) {
    if (config.groupType === DirectoriesQueryGroupTypeEnum.additional_details) {
      return config;
    }
    if (config.children?.length) {
      const found = findAdditionalDetailsConfig(config.children);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};

/**
 * Check if config contains ADDITIONAL_DETAILS
 * Returns false if this bizId doesn't have additional config at all
 */
export const hasAdditionalConfig = (
  queryConfig: DirectoriesQueryItem[],
): boolean => {
  return findAdditionalDetailsConfig(queryConfig) !== undefined;
};

/**
 * Check if user has permission to access additional details
 * Only meaningful when hasAdditionalConfig returns true
 * Returns true if ADDITIONAL_DETAILS config has isAuth=true (or isAuth not set)
 */
export const getAdditionalIsAuth = (
  queryConfig: DirectoriesQueryItem[],
): boolean => {
  const additionalConfig = findAdditionalDetailsConfig(queryConfig);
  if (!additionalConfig) {
    return true; // Default to true when no config (irrelevant)
  }
  return additionalConfig.isAuth ?? true;
};
