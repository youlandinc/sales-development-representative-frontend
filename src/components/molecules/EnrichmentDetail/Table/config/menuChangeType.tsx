import { TypeIcon } from '../TableIcon';
import { TableColumnTypeEnum } from '@/types/enrichment/table';
import { TableColumnActionOption } from '../types';

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
  [TableColumnTypeEnum.action]: 'Action',
};

// Get all available column type options for the submenu
// Order matches the reference design
export const getChangeColumnTypeMenuActions = (): TableColumnActionOption[] => [
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.checkbox],
  //  icon: <TypeIcon type={TableColumnTypeEnum.checkbox} />,
  //  value: TableColumnTypeEnum.checkbox,
  //},
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.number],
  //  icon: <TypeIcon type={TableColumnTypeEnum.number} />,
  //  value: TableColumnTypeEnum.number,
  //},
  {
    label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.text],
    icon: <TypeIcon type={TableColumnTypeEnum.text} />,
    value: TableColumnTypeEnum.text,
  },
  {
    label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.url],
    icon: <TypeIcon type={TableColumnTypeEnum.url} />,
    value: TableColumnTypeEnum.url,
  },
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.date],
  //  icon: <TypeIcon type={TableColumnTypeEnum.date} />,
  //  value: TableColumnTypeEnum.date,
  //},
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.select],
  //  icon: <TypeIcon type={TableColumnTypeEnum.select} />,
  //  value: TableColumnTypeEnum.select,
  //},
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.assigned_to],
  //  icon: <TypeIcon type={TableColumnTypeEnum.assigned_to} />,
  //  value: TableColumnTypeEnum.assigned_to,
  //},
  {
    label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.email],
    icon: <TypeIcon type={TableColumnTypeEnum.email} />,
    value: TableColumnTypeEnum.email,
  },
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.img_url],
  //  icon: <TypeIcon type={TableColumnTypeEnum.img_url} />,
  //  value: TableColumnTypeEnum.img_url,
  //},
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.currency],
  //  icon: <TypeIcon type={TableColumnTypeEnum.currency} />,
  //  value: TableColumnTypeEnum.currency,
  //},
  //{
  //  label: COLUMN_TYPE_LABELS[TableColumnTypeEnum.paragraph],
  //  icon: <TypeIcon type={TableColumnTypeEnum.paragraph} />,
  //  value: TableColumnTypeEnum.paragraph,
  //},
];
