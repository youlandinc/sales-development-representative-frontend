import { COLUMN_MENU_ICONS, getAddColumnMenuActions } from './index';
import {
  TableColumnActionOption,
  TableColumnMenuActionEnum,
} from '@/types/enrichment/table';

// AI column menu (p3)
export const getAiColumnMenuActions = (
  isPinned: boolean = false,
): TableColumnActionOption[] => [
  {
    label: 'Rename column',
    icon: COLUMN_MENU_ICONS.RENAME,
    value: TableColumnMenuActionEnum.rename_column,
  },
  {
    label: 'Edit column',
    icon: COLUMN_MENU_ICONS.EDIT,
    value: TableColumnMenuActionEnum.edit_column,
  },
  {
    label: '1',
    icon: '',
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: 'Insert 1 column left',
    icon: '',
    value: TableColumnMenuActionEnum.insert_column_left,
    submenu: getAddColumnMenuActions(),
  },
  {
    label: 'Insert 1 column right',
    icon: '',
    value: TableColumnMenuActionEnum.insert_column_right,
    submenu: getAddColumnMenuActions(),
  },
  {
    label: '2',
    icon: '',
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: 'Edit description',
    icon: COLUMN_MENU_ICONS.DESCRIPTION,
    value: TableColumnMenuActionEnum.edit_description,
  },
  {
    label: '3',
    icon: '',
    value: TableColumnMenuActionEnum.divider,
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
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: 'Duplicate',
    icon: '',
    value: '', // No enum yet
  },
  {
    label: '5',
    icon: '',
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: 'Filter on this column',
    icon: '',
    value: '', // No enum yet
  },
  {
    label: '6',
    icon: '',
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: isPinned ? 'Unpin' : 'Pin',
    icon: isPinned ? COLUMN_MENU_ICONS.UNPIN : COLUMN_MENU_ICONS.PIN,
    value: TableColumnMenuActionEnum.pin,
  },
  {
    label: 'Hide',
    icon: COLUMN_MENU_ICONS.HIDE,
    value: TableColumnMenuActionEnum.visible,
  },
  {
    label: 'Delete',
    icon: COLUMN_MENU_ICONS.DELETE,
    value: TableColumnMenuActionEnum.delete,
  },
];
