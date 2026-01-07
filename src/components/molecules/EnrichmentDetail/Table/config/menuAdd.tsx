import { MenuIcon, TypeIcon } from '../TableIcon';
import {
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';
import { TableColumnActionOption } from '../types';

// Add column menu (p1 - highest priority)
export const getAddColumnMenuActions = (): TableColumnActionOption[] => [
  {
    label: 'Atlas Intelligence Agent',
    icon: <MenuIcon action={TableColumnMenuActionEnum.ai_agent} />,
    value: TableColumnMenuActionEnum.ai_agent,
  },
  {
    label: 'Add enrichment',
    icon: <MenuIcon action={TableColumnMenuActionEnum.work_email} />,
    value: TableColumnMenuActionEnum.work_email,
  },
  {
    label: '1',
    icon: null,
    value: TableColumnMenuActionEnum.divider,
  },
  // {
  //   label: 'Message',
  //   icon: null,
  //   value: '', // No enum yet
  // },
  // {
  //   label: 'Waterfall',
  //   icon: null,
  //   value: '', // No enum yet
  // },
  // {
  //   label: 'Formula',
  //   icon: null,
  //   value: '', // No enum yet
  // },
  // {
  //   label: 'Merge columns',
  //   icon: null,
  //   value: '', // No enum yet
  // },
  {
    label: '2',
    icon: null,
    value: TableColumnMenuActionEnum.divider,
  },
  // Column types from TableColumnTypeEnum
  {
    label: 'Text',
    icon: <TypeIcon type={TableColumnTypeEnum.text} />,
    value: TableColumnTypeEnum.text,
  },
  // {
  //   label: 'Number',
  //   icon: <TypeIcon type={TableColumnTypeEnum.number} />,
  //   value: TableColumnTypeEnum.number,
  // },
  // {
  //   label: 'Currency',
  //   icon: <TypeIcon type={TableColumnTypeEnum.currency} />,
  //   value: TableColumnTypeEnum.currency,
  // },
  // {
  //   label: 'Date',
  //   icon: <TypeIcon type={TableColumnTypeEnum.date} />,
  //   value: TableColumnTypeEnum.date,
  // },
  {
    label: 'URL',
    icon: <TypeIcon type={TableColumnTypeEnum.url} />,
    value: TableColumnTypeEnum.url,
  },
  {
    label: 'Email',
    icon: <TypeIcon type={TableColumnTypeEnum.email} />,
    value: TableColumnTypeEnum.email,
  },
  // {
  //   label: 'Phone',
  //   icon: <TypeIcon type={TableColumnTypeEnum.phone} />,
  //   value: TableColumnTypeEnum.phone,
  // },
  // {
  //   label: 'Image from URL',
  //   icon: <TypeIcon type={TableColumnTypeEnum.img_url} />,
  //   value: TableColumnTypeEnum.img_url,
  // },
  // {
  //   label: 'Checkbox',
  //   icon: <TypeIcon type={TableColumnTypeEnum.checkbox} />,
  //   value: TableColumnTypeEnum.checkbox,
  // },
  // {
  //   label: 'Select',
  //   icon: <TypeIcon type={TableColumnTypeEnum.select} />,
  //   value: TableColumnTypeEnum.select,
  // },
  // {
  //   label: 'Assigned to',
  //   icon: null,
  //   value: '', // No enum for this type yet
  // },
];
