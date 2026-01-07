import { DirectoriesBizIdEnum } from './base';
import { TableColumnTypeEnum } from '@/types/enrichment/table';

export enum DirectoriesQueryActionTypeEnum {
  click = 'CLICK',
  select = 'SELECT',
  radio = 'RADIO',
  checkbox = 'CHECKBOX',
  input = 'INPUT',
  switch = 'SWITCH',
  between = 'BETWEEN',
  date = 'DATE',
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
  // Firms: has list table (companyNames)
  // Individuals: no list table
  exclude_firms = 'EXCLUDE_FIRMS',
  exclude_individuals = 'EXCLUDE_INDIVIDUALS',
  additional_details = 'ADDITIONAL_DETAILS',
}

export enum DirectoriesQueryComponentNameEnum {
  date_range_select = 'DATE_RANGE_SELECT',
  auto_complete_location = 'AUTO_COMPLETE_LOCATION',
  cascade_select = 'CASCADE_SELECT',
  cascade_select_dynamic = 'CASCADE_SELECT_DYNAMIC',
}

export enum DirectoriesEntityTypeEnum {
  firm = 'FIRM',
  executive = 'EXECUTIVE',
}

export interface DirectoriesQueryItem {
  // ========== Backend Data (not used in frontend yet) ==========
  refreshSubsets: boolean;
  sort: number | null; // for sorting items (not implemented yet)

  // ========== Meta Information ==========
  isAuth: boolean;
  planName: string;
  bizId: DirectoriesBizIdEnum; // product category

  // ========== Form Field ==========
  key: string | null; // form key for data storage

  // ========== Container/Layout ==========
  label: string | null; // main label for container
  description: string | null;
  tooltip: string | null;
  isDefaultOpen: boolean; // for collapsible containers
  isGroup: boolean;
  showTips: boolean | null;

  // ========== Component Condition ==========
  isDefault: boolean;
  condition: string | null;

  // ========== Component Type Identifiers ==========
  // Based on these values, determine which component to render
  actionType: DirectoriesQueryActionTypeEnum | null;
  inputType: DirectoriesQueryInputTypeEnum | null;
  groupType: DirectoriesQueryGroupTypeEnum | null;
  componentName: DirectoriesQueryComponentNameEnum | null;

  // ========== Component Props ==========
  placeholder: string | null; // for input components
  subLabel: string | null; // for checkbox/switch inside tooltip
  subTooltip: string | null;
  subDescription: string | null;

  // ========== InputNumber Props ==========
  notAllowZero: boolean | null;
  maxLength: number | null;

  // ========== Options & Values ==========
  optionMultiple: boolean;
  defaultValue: any;
  optionDictCode: string | null;
  // For tab/button group/exclude components OR select/input options
  optionValues: { key: string; label: string; value: string }[];

  // ========== API Integration ==========
  url: string | null; // if url exists, fetch options from API
  requestParams: string[] | null;
  cascadeKey: string | null;

  // ========== Nested Structure ==========
  children: DirectoriesQueryItem[] | null; // sub-components
}

export type DirectoriesQueryConfigResponse = DirectoriesQueryItem[];
export type DirectoriesAdditionalConfigResponse = DirectoriesQueryItem[];

export interface DirectoriesQueryTableHeaderItem {
  columnKey: string | null;
  columnName: string | null;
  columnType: TableColumnTypeEnum;
  groupLabel: string | null;
  groupOrder: number | null;
  width?: number;
  isAuth: boolean;
}

export type DirectoriesTableHeaderResponse = DirectoriesQueryTableHeaderItem[];

export type DirectoriesQueryTableBodyItem = Record<string, any>;

export interface DirectoriesTableBodyResponse {
  findCount: number;
  defaultPreviewCount: number;
  maxImportCount: number;
  findList: DirectoriesQueryTableBodyItem[];
}
