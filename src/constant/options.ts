import { FilterOperationEnum, ProspectDelimiterEnum } from '@/types';
import { ReactNode } from 'react';

export const WORD_COUNT_OPTIONS: {
  value: number;
  label?: ReactNode;
}[] = [
  { label: '', value: 100 },
  { label: '', value: 125 },
  { label: '', value: 150 },
  { label: '', value: 175 },
  { label: '', value: 200 },
  { label: '', value: 225 },
  { label: '', value: 250 },
  { label: '', value: 275 },
  { label: '', value: 300 },
  { label: '', value: 325 },
  { label: '', value: 350 },
  { label: '', value: 375 },
  { label: '', value: 400 },
];

export const FILTER_OPERATIONS: TOption[] = [
  {
    label: 'Is equal to',
    value: FilterOperationEnum.equals,
    key: FilterOperationEnum.equals,
  },
  {
    label: 'Is not equal to',
    value: FilterOperationEnum.not,
    key: FilterOperationEnum.not,
  },
  {
    label: 'Contains',
    value: FilterOperationEnum.contains,
    key: FilterOperationEnum.contains,
  },
  {
    label: 'Does not contain',
    value: FilterOperationEnum.not_contains,
    key: FilterOperationEnum.not_contains,
  },
  {
    label: 'Starts with',
    value: FilterOperationEnum.starts_with,
    key: FilterOperationEnum.starts_with,
  },
  {
    label: 'Does not start with',
    value: FilterOperationEnum.not_starts_with,
    key: FilterOperationEnum.not_starts_with,
  },
  {
    label: 'Ends with',
    value: FilterOperationEnum.ends_with,
    key: FilterOperationEnum.ends_with,
  },
  {
    label: 'Does not end with',
    value: FilterOperationEnum.not_ends_with,
    key: FilterOperationEnum.not_ends_with,
  },
];

export const PROSPECT_CSV_TYPE_OPTIONS = [
  {
    label: 'Comma',
    value: ProspectDelimiterEnum.comma,
    key: ProspectDelimiterEnum.comma,
  },
  {
    label: 'Semicolon',
    value: ProspectDelimiterEnum.semicolon,
    key: ProspectDelimiterEnum.semicolon,
  },
  {
    label: 'Tab',
    value: ProspectDelimiterEnum.tab,
    key: ProspectDelimiterEnum.tab,
  },
  {
    label: 'Pipe',
    value: ProspectDelimiterEnum.pipe,
    key: ProspectDelimiterEnum.pipe,
  },
];
