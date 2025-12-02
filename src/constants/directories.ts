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

// Auto-generated from DIRECTORIES
export const SLUG_MAP = Object.fromEntries(
  Object.entries(DIRECTORIES).map(([k, v]) => [k, v.slug]),
) as Record<DirectoriesBizIdEnum, string>;

export const TITLE_MAP = Object.fromEntries(
  Object.values(DIRECTORIES).map((v) => [v.slug, v.title]),
) as Record<string, string>;

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
