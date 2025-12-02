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
    slug: 'real-estate-and-lending',
    title: 'Real Estate & Lending Directory',
  },
  [DirectoriesBizIdEnum.business_corporate]: {
    slug: 'business-and-corporate',
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
  'real-estate-and-lending':
    DIRECTORIES[DirectoriesBizIdEnum.real_estate_lending].title,
  'business-and-corporate':
    DIRECTORIES[DirectoriesBizIdEnum.business_corporate].title,
};

export const DIRECTORIES_BADGE_AUTH: Record<
  DirectoriesBizIdEnum,
  { title: string; strong: string }
> = {
  [DirectoriesBizIdEnum.capital_markets]: {
    title: 'Requires Intelligence',
    strong: 'Intelligence',
  },
  [DirectoriesBizIdEnum.real_estate_lending]: {
    title: 'Requires Professional',
    strong: 'Professional',
  },
  [DirectoriesBizIdEnum.business_corporate]: {
    title: 'Requires Business',
    strong: 'Business',
  },
};
