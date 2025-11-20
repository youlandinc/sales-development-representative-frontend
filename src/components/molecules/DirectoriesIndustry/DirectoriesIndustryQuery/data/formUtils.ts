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
