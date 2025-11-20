import {
  DirectoriesBizIdEnum,
  DirectoriesQueryItem,
} from '@/types/Directories';

export const getBizIdFromSlug = (slug: string): DirectoriesBizIdEnum => {
  const slugMap: Record<string, DirectoriesBizIdEnum> = {
    'capital-markets': DirectoriesBizIdEnum.capital_markets,
    'real-estate-lending': DirectoriesBizIdEnum.real_estate_lending,
  };

  return slugMap[slug] || DirectoriesBizIdEnum.capital_markets;
};

export const convertToConfigMap = (
  apiData: DirectoriesQueryItem[],
): {
  configMap: Record<string, DirectoriesQueryItem[]>;
  buttonGroupConfig: DirectoriesQueryItem | null;
  firstInstitutionType: string;
} => {
  if (!apiData || apiData.length === 0) {
    return { configMap: {}, buttonGroupConfig: null, firstInstitutionType: '' };
  }

  const buttonGroup = apiData.find(
    (item) =>
      item.key === 'institutionType' && item.groupType === 'BUTTON_GROUP',
  );

  if (!buttonGroup || !buttonGroup.children) {
    return { configMap: {}, buttonGroupConfig: null, firstInstitutionType: '' };
  }

  const configMap: Record<string, DirectoriesQueryItem[]> = {};

  buttonGroup.children.forEach((child) => {
    const institutionType = child.defaultValue;
    if (institutionType && child.children) {
      configMap[institutionType] = child.children;
    }
  });

  const firstInstitutionType = buttonGroup.children[0]?.defaultValue || '';

  const buttonGroupConfig: DirectoriesQueryItem = {
    ...buttonGroup,
    children: null,
  };

  return { configMap, buttonGroupConfig, firstInstitutionType };
};

export const initializeFormValues = (
  configs: DirectoriesQueryItem[],
): Record<string, any> => {
  const result: Record<string, any> = {};

  if (!configs || configs.length === 0) {
    return result;
  }

  const entityTypeConfig = configs.find(
    (c) => c.groupType === 'TAB' && c.isGroup && c.key,
  );

  if (!entityTypeConfig || !entityTypeConfig.children) {
    return result;
  }

  const defaultEntityType =
    entityTypeConfig.defaultValue ?? entityTypeConfig.optionValues?.[0]?.value;

  if (entityTypeConfig.key) {
    result[entityTypeConfig.key] = defaultEntityType ?? 'FIRM';
  }

  entityTypeConfig.children.forEach((tabChild, index) => {
    const optionValue = entityTypeConfig.optionValues?.[index];
    const tabKey = optionValue?.value;

    if (tabKey) {
      result[tabKey] = {};
      collectFormKeys(tabChild, result[tabKey]);
    }
  });

  configs.forEach((child) => {
    if (
      child.groupType === 'EXCLUDE_FIRMS' ||
      child.groupType === 'EXCLUDE_INDIVIDUALS'
    ) {
      entityTypeConfig.children?.forEach((tabChild, index) => {
        const optionValue = entityTypeConfig.optionValues?.[index];
        const tabKey = optionValue?.value;
        if (tabKey && result[tabKey]) {
          collectFormKeys(child, result[tabKey]);
        }
      });
    }
  });

  return result;
};

const collectFormKeys = (
  config: DirectoriesQueryItem,
  result: Record<string, any>,
): void => {
  const { groupType, key, children } = config;

  if (groupType === 'GENERAL') {
    if (children && children.length > 0) {
      children.forEach((child) => {
        collectFormKeys(child, result);
      });
    }
    return;
  }

  if (groupType === 'EXCLUDE_FIRMS' || groupType === 'EXCLUDE_INDIVIDUALS') {
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

  if (groupType === 'ADDITIONAL_DETAILS') {
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
