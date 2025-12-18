import { COLUMN_MENU_ICONS, COLUMN_TYPE_ICONS } from './index';
import {
  TableColumnActionOption,
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

// Add column menu (p1 - highest priority)
export const getAddColumnMenuActions = (): TableColumnActionOption[] => [
  {
    label: 'Add enrichment',
    icon: '',
    value: '', // No enum yet
  },
  {
    label: 'Use AI',
    icon: COLUMN_MENU_ICONS.USE_AI,
    value: TableColumnMenuActionEnum.ai_agent,
  },
  {
    label: '1',
    icon: '',
    value: TableColumnMenuActionEnum.divider,
  },
  // {
  //   label: 'Message',
  //   icon: '',
  //   value: '', // No enum yet
  // },
  // {
  //   label: 'Waterfall',
  //   icon: '',
  //   value: '', // No enum yet
  // },
  // {
  //   label: 'Formula',
  //   icon: '',
  //   value: '', // No enum yet
  // },
  // {
  //   label: 'Merge columns',
  //   icon: '',
  //   value: '', // No enum yet
  // },
  {
    label: '2',
    icon: '',
    value: TableColumnMenuActionEnum.divider,
  },
  // Column types from TableColumnTypeEnum
  {
    label: 'Text',
    icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.text],
    value: TableColumnTypeEnum.text,
  },
  // {
  //   label: 'Number',
  //   icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.number],
  //   value: TableColumnTypeEnum.number,
  // },
  // {
  //   label: 'Currency',
  //   icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.currency],
  //   value: TableColumnTypeEnum.currency,
  // },
  // {
  //   label: 'Date',
  //   icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.date],
  //   value: TableColumnTypeEnum.date,
  // },
  {
    label: 'URL',
    icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.url],
    value: TableColumnTypeEnum.url,
  },
  {
    label: 'Email',
    icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.email],
    value: TableColumnTypeEnum.email,
  },
  // {
  //   label: 'Phone',
  //   icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.phone],
  //   value: TableColumnTypeEnum.phone,
  // },
  // {
  //   label: 'Image from URL',
  //   icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.img_url],
  //   value: TableColumnTypeEnum.img_url,
  // },
  // {
  //   label: 'Checkbox',
  //   icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.checkbox],
  //   value: TableColumnTypeEnum.checkbox,
  // },
  // {
  //   label: 'Select',
  //   icon: COLUMN_TYPE_ICONS[TableColumnTypeEnum.select],
  //   value: TableColumnTypeEnum.select,
  // },
  // {
  //   label: 'Assigned to',
  //   icon: '',
  //   value: '', // No enum for this type yet
  // },
];
