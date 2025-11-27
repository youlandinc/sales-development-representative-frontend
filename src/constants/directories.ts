import { DirectoriesBizIdEnum } from '@/types/directories';

export const HIERARCHICAL_CONFIG_BIZ_IDS = [
  DirectoriesBizIdEnum.capital_markets,
];

export const DIRECTORIES = {
  [DirectoriesBizIdEnum.capital_markets]: {
    slug: 'capital-markets',
    title: 'Capital Markets Directory',
  },
  [DirectoriesBizIdEnum.real_estate_lending]: {
    slug: 'real-estate',
    title: 'Real Estate & Lending Directory',
  },
  [DirectoriesBizIdEnum.business_corporate]: {
    slug: 'business-corporate',
    title: 'Business & Corporate Directory',
  },
} as const;

export const SLUG_MAP: Record<DirectoriesBizIdEnum, string> = {
  [DirectoriesBizIdEnum.capital_markets]:
    DIRECTORIES[DirectoriesBizIdEnum.capital_markets].slug,
  [DirectoriesBizIdEnum.real_estate_lending]:
    DIRECTORIES[DirectoriesBizIdEnum.real_estate_lending].slug,
  [DirectoriesBizIdEnum.business_corporate]:
    DIRECTORIES[DirectoriesBizIdEnum.business_corporate].slug,
};

export const TITLE_MAP: Record<string, string> = {
  'capital-markets': DIRECTORIES[DirectoriesBizIdEnum.capital_markets].title,
  'real-estate': DIRECTORIES[DirectoriesBizIdEnum.real_estate_lending].title,
  'business-corporate':
    DIRECTORIES[DirectoriesBizIdEnum.business_corporate].title,
};
