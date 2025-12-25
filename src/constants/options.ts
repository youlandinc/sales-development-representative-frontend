import { EnrichmentDelimiterEnum, FilterOperationEnum } from '@/types';
import { TableColumnTypeEnum } from '@/types/enrichment/table';
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

export const ENRICHMENT_CSV_TYPE_OPTIONS = [
  {
    label: 'Comma',
    value: EnrichmentDelimiterEnum.comma,
    key: EnrichmentDelimiterEnum.comma,
  },
  {
    label: 'Semicolon',
    value: EnrichmentDelimiterEnum.semicolon,
    key: EnrichmentDelimiterEnum.semicolon,
  },
  {
    label: 'Tab',
    value: EnrichmentDelimiterEnum.tab,
    key: EnrichmentDelimiterEnum.tab,
  },
  {
    label: 'Pipe',
    value: EnrichmentDelimiterEnum.pipe,
    key: EnrichmentDelimiterEnum.pipe,
  },
];

export const FIELD_TYPE_OPTIONS = [
  {
    label: 'Text',
    value: TableColumnTypeEnum.text,
    key: TableColumnTypeEnum.text,
  },
  {
    label: 'Checkbox',
    value: TableColumnTypeEnum.checkbox,
    key: TableColumnTypeEnum.checkbox,
  },
  {
    label: 'Number',
    value: TableColumnTypeEnum.number,
    key: TableColumnTypeEnum.number,
  },
  {
    label: 'URL',
    value: TableColumnTypeEnum.url,
    key: TableColumnTypeEnum.url,
  },
  {
    label: 'Date',
    value: TableColumnTypeEnum.date,
    key: TableColumnTypeEnum.date,
  },
  {
    label: 'Select',
    value: TableColumnTypeEnum.select,
    key: TableColumnTypeEnum.select,
  },
  {
    label: 'Email',
    value: TableColumnTypeEnum.email,
    key: TableColumnTypeEnum.email,
  },
  {
    label: 'Image from URL',
    value: TableColumnTypeEnum.img_url,
    key: TableColumnTypeEnum.img_url,
  },
  {
    label: 'Currency',
    value: TableColumnTypeEnum.currency,
    key: TableColumnTypeEnum.currency,
  },
];
