import { COLUMN_TYPE_ICONS } from '@/components/atoms/StyledTable/columnTypeIcons';
import { TableColumnTypeEnum } from '@/types/Prospect/table';
import { COLUMN_MENU_ICONS } from './columnMenuIcons';

export enum TableColumnMenuEnum {
  divider = 'DIVIDER',
  ai_agent = 'AI_AGENT',
  rename_column = 'RENAME_COLUMN',
  edit_column = 'EDIT_COLUMN',
  edit_description = 'EDIT_DESCRIPTION',
  sort_a_z = 'SORT_A_Z',
  sort_z_a = 'SORT_Z_A',
  pin = 'PIN',
  visible = 'VISIBLE',
  delete = 'DELETE',
  cell_detail = 'CELL_DETAIL',
  header_actions = 'HEADER_ACTIONS',
  insert_column_left = 'INSERT_COLUMN_LEFT',
  insert_column_right = 'INSERT_COLUMN_RIGHT',
}

export interface TableColumnOption {
  label: string;
  value: TableColumnMenuEnum | string; // Allow string for new menu items without enum
  icon: any;
  submenu?: TableColumnOption[];
  parentValue?: TableColumnMenuEnum | string; // Parent menu value for submenu items
}

// Add column menu (p1 - highest priority)
export const getAddColumnMenuActions = (): TableColumnOption[] => [
  {
    label: 'Add enrichment',
    icon: '',
    value: '', // No enum yet
  },
  {
    label: 'Use AI',
    icon: COLUMN_MENU_ICONS.USE_AI,
    value: TableColumnMenuEnum.ai_agent,
  },
  {
    label: '1',
    icon: '',
    value: TableColumnMenuEnum.divider,
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
    value: TableColumnMenuEnum.divider,
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

// Normal column menu (p2)
export const getNormalColumnMenuActions = (
  isPinned: boolean = false,
): TableColumnOption[] => [
  {
    label: 'Rename column',
    icon: COLUMN_MENU_ICONS.RENAME,
    value: TableColumnMenuEnum.rename_column,
  },
  {
    label: 'Edit column',
    icon: COLUMN_MENU_ICONS.EDIT,
    value: TableColumnMenuEnum.edit_column,
  },
  {
    label: '1',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Insert 1 column left',
    icon: '',
    value: TableColumnMenuEnum.insert_column_left,
    submenu: getAddColumnMenuActions(),
  },
  {
    label: 'Insert 1 column right',
    icon: '',
    value: TableColumnMenuEnum.insert_column_right,
    submenu: getAddColumnMenuActions(),
  },
  {
    label: '2',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Edit description',
    icon: COLUMN_MENU_ICONS.DESCRIPTION,
    value: TableColumnMenuEnum.edit_description,
  },
  {
    label: '3',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Change color',
    icon: '',
    value: '', // No enum yet
    submenu: [], // Color options
  },
  {
    label: 'URL',
    icon: '',
    value: '', // No enum yet
    submenu: [], // Column type options
  },
  {
    label: '4',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Duplicate',
    icon: '',
    value: '', // No enum yet
  },
  {
    label: '5',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Sort A → Z',
    icon: '',
    value: TableColumnMenuEnum.sort_a_z,
  },
  {
    label: 'Sort Z → A',
    icon: '',
    value: TableColumnMenuEnum.sort_z_a,
  },
  {
    label: '6',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Dedupe',
    icon: '',
    value: '', // No enum yet
  },
  {
    label: 'Filter on this column',
    icon: '',
    value: '', // No enum yet
  },
  {
    label: '7',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: isPinned ? 'Unpin' : 'Pin',
    icon: isPinned ? COLUMN_MENU_ICONS.UNPIN : COLUMN_MENU_ICONS.PIN,
    value: TableColumnMenuEnum.pin,
  },
  {
    label: 'Hide',
    icon: COLUMN_MENU_ICONS.HIDE,
    value: TableColumnMenuEnum.visible,
  },
  {
    label: 'Delete',
    icon: COLUMN_MENU_ICONS.DELETE,
    value: TableColumnMenuEnum.delete,
  },
];

// AI column menu (p3)
export const getAiColumnMenuActions = (
  isPinned: boolean = false,
): TableColumnOption[] => [
  {
    label: 'Rename column',
    icon: COLUMN_MENU_ICONS.RENAME,
    value: TableColumnMenuEnum.rename_column,
  },
  {
    label: 'Edit column',
    icon: COLUMN_MENU_ICONS.EDIT,
    value: TableColumnMenuEnum.edit_column,
  },
  {
    label: '1',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Insert 1 column left',
    icon: '',
    value: TableColumnMenuEnum.insert_column_left,
    submenu: getAddColumnMenuActions(),
  },
  {
    label: 'Insert 1 column right',
    icon: '',
    value: TableColumnMenuEnum.insert_column_right,
    submenu: getAddColumnMenuActions(),
  },
  {
    label: '2',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Edit description',
    icon: COLUMN_MENU_ICONS.DESCRIPTION,
    value: TableColumnMenuEnum.edit_description,
  },
  {
    label: '3',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Change color',
    icon: '',
    value: '', // No enum yet
    submenu: [], // Color options
  },
  {
    label: 'Run info',
    icon: '',
    value: '', // No enum yet
  },
  {
    label: 'Run column',
    icon: '',
    value: '', // No enum yet
    submenu: [], // Run options
  },
  {
    label: '4',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Duplicate',
    icon: '',
    value: '', // No enum yet
  },
  {
    label: '5',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Filter on this column',
    icon: '',
    value: '', // No enum yet
  },
  {
    label: '6',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: isPinned ? 'Unpin' : 'Pin',
    icon: isPinned ? COLUMN_MENU_ICONS.UNPIN : COLUMN_MENU_ICONS.PIN,
    value: TableColumnMenuEnum.pin,
  },
  {
    label: 'Hide',
    icon: COLUMN_MENU_ICONS.HIDE,
    value: TableColumnMenuEnum.visible,
  },
  {
    label: 'Delete',
    icon: COLUMN_MENU_ICONS.DELETE,
    value: TableColumnMenuEnum.delete,
  },
];

export const ROW_HEIGHT = 36;
export const MIN_BATCH_SIZE = 50;
