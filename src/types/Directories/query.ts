import { DirectoriesBizIdEnum } from './base';

export enum DirectoriesQueryActionTypeEnum {
  click = 'CLICK',
  select = 'SELECT',
  radio = 'RADIO',
  checkbox = 'CHECKBOX',
  input = 'INPUT',
  switch = 'SWITCH',
  between = 'BETWEEN',
}

export enum DirectoriesQueryInputTypeEnum {
  text = 'TEXT',
  number = 'NUMBER',
  boolean = 'BOOLEAN',
}

export enum DirectoriesQueryGroupTypeEnum {
  general = 'GENERAL',
  button_group = 'BUTTON_GROUP',
  tab = 'TAB',
  // firms => have list table(companyNames)
  // individuals => don't have list table
  exclude_firms = 'EXCLUDE_FIRMS',
  exclude_individuals = 'EXCLUDE_INDIVIDUALS',
  additional_details = 'ADDITIONAL_DETAILS',
}

export interface DirectoriesQueryItem {
  // ========== Backend Data (not used in frontend yet) ==========
  componentName: string | null;
  isDefault: boolean;
  refreshSubsets: boolean;
  sort: number | null; // for sorting items (not implemented yet)

  // ========== Meta Information ==========
  bizId: DirectoriesBizIdEnum; // product category

  // ========== Form Field ==========
  key: string | null; // form key for data storage

  // ========== Container/Layout ==========
  label: string | null; // main label for container
  description: string | null;
  tooltip: string | null;
  isDefaultOpen: boolean; // for collapsible containers
  isGroup: boolean;

  // ========== Component Type Identifiers ==========
  // Based on these values, determine which component to render
  actionType: DirectoriesQueryActionTypeEnum | null;
  inputType: DirectoriesQueryInputTypeEnum | null;
  groupType: DirectoriesQueryGroupTypeEnum | null;

  // ========== Component Props ==========
  placeholder: string | null; // for input components
  subLabel: string | null; // for checkbox/switch inside tooltip
  subTooltip: string | null;

  // ========== Options & Values ==========
  optionMultiple: boolean;
  defaultValues: any;
  // For tab/button group/exclude components OR select/input options
  optionValues: { key: string; label: string; value: string }[];

  // ========== API Integration ==========
  url: string | null; // if url exists, fetch options from API

  // ========== Nested Structure ==========
  children: DirectoriesQueryItem[]; // sub components
}

export interface DirectoriesQueryDefaultApiResponse {
  data: DirectoriesQueryItem[];
}
