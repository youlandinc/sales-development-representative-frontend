import { DirectoriesBizIdEnum } from './base';
import { TableColumnTypeEnum } from '@/types/Prospect/table';

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
}

export enum DirectoriesEntityTypeEnum {
  firm = 'FIRM',
  executive = 'EXECUTIVE',
}

export interface DirectoriesQueryItem {
  // ========== Backend Data (not used in frontend yet) ==========
  componentName: string | null;
  isDefault: boolean;
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

  // ========== Component Type Identifiers ==========
  // Based on these values, determine which component to render
  actionType: DirectoriesQueryActionTypeEnum | null;
  inputType: DirectoriesQueryInputTypeEnum | null;
  groupType: DirectoriesQueryGroupTypeEnum | null;

  // ========== Component Props ==========
  placeholder: string | null; // for input components
  subLabel: string | null; // for checkbox/switch inside tooltip
  subTooltip: string | null;
  subDescription: string | null;

  // ========== Options & Values ==========
  optionMultiple: boolean;
  defaultValue: any;
  optionDictCode: string | null;
  // For tab/button group/exclude components OR select/input options
  optionValues: { key: string; label: string; value: string }[];

  // ========== API Integration ==========
  url: string | null; // if url exists, fetch options from API

  // ========== Nested Structure ==========
  children: DirectoriesQueryItem[] | null; // sub-components
}

export type DirectoriesQueryDefaultApiResponse = DirectoriesQueryItem[];
export type DirectoriesQueryAdditionalApiResponse = DirectoriesQueryItem[];

export interface DirectoriesQueryTableHeaderItem {
  columnKey: string | null;
  columnName: string | null;
  columnType: TableColumnTypeEnum;
  groupLabel: string | null;
  groupOrder: number | null;
  width?: number;
  isAuth: boolean;
}

export type DirectoriesQueryTableHeaderApiResponse =
  DirectoriesQueryTableHeaderItem[];

export type DirectoriesQueryTableBodyItem = Record<string, any>;

export interface DirectoriesQueryTableBodyApiResponse {
  findCount: number;
  defaultPreviewCount: number;
  maxImportCount: number;
  findList: DirectoriesQueryTableBodyItem[];
}
