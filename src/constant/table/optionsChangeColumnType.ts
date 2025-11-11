import { COLUMN_TYPE_ICONS } from './index';
import {
  TableColumnActionOption,
  TableColumnTypeEnum,
} from '@/types/Prospect/table';

// Column type labels mapping
export const COLUMN_TYPE_LABELS: {
  [key in TableColumnTypeEnum]: string;
} = {
  [TableColumnTypeEnum.text]: 'Text',
  [TableColumnTypeEnum.number]: 'Number',
  [TableColumnTypeEnum.email]: 'Email',
  [TableColumnTypeEnum.phone]: 'Phone',
  [TableColumnTypeEnum.currency]: 'Currency',
  [TableColumnTypeEnum.date]: 'Date',
  [TableColumnTypeEnum.url]: 'URL',
  [TableColumnTypeEnum.img_url]: 'Image from URL',
  [TableColumnTypeEnum.checkbox]: 'Checkbox',
  [TableColumnTypeEnum.select]: 'Select',
  [TableColumnTypeEnum.assigned_to]: 'Assigned To',
  [TableColumnTypeEnum.paragraph]: 'Paragraph',
};

// Get all available column type options for the submenu
// Order matches the reference design
export const getChangeColumnTypeMenuActions = (): TableColumnActionOption[] => [
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.checkbox],
  //  icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.checkbox],
  //  value: TableColumnTypeEnum.checkbox,
  //},
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.number],
  //  icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.number],
  //  value: TableColumnTypeEnum.number,
  //},
  {
    label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.text],
    icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.text],
    value: TableColumnTypeEnum.text,
  },
  {
    label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.url],
    icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.url],
    value: TableColumnTypeEnum.url,
  },
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.date],
  //  icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.date],
  //  value: TableColumnTypeEnum.date,
  //},
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.select],
  //  icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.select],
  //  value: TableColumnTypeEnum.select,
  //},
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.assigned_to],
  //  icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.assigned_to],
  //  value: TableColumnTypeEnum.assigned_to,
  //},
  {
    label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.email],
    icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.email],
    value: TableColumnTypeEnum.email,
  },
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.img_url],
  //  icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.img_url],
  //  value: TableColumnTypeEnum.img_url,
  //},
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.currency],
  //  icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.currency],
  //  value: TableColumnTypeEnum.currency,
  //},
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.paragraph],
  //  icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.paragraph],
  //  value: TableColumnTypeEnum.paragraph,
  //},
];
