import {
  COLUMN_MENU_ICONS,
  COLUMN_TYPE_ICONS,
  COLUMN_TYPE_LABELS,
  getAddColumnMenuActions,
  getChangeColumnTypeMenuActions,
} from './index';
import {
  TableColumnActionOption,
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

// Normal column menu (p2)
export const getNormalColumnMenuActions = (
  isPinned: boolean = false,
  currentColumnType?: TableColumnTypeEnum,
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
    label: currentColumnType
      ? COLUMN_TYPE_LABELS[currentColumnType]
      : 'Change type',
    icon: currentColumnType ? COLUMN_TYPE_ICONS[currentColumnType] : '',
    value: TableColumnMenuActionEnum.change_column_type,
    submenu: getChangeColumnTypeMenuActions(),
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
    label: 'Sort A → Z',
    icon: '',
    value: TableColumnMenuActionEnum.sort_a_z,
  },
  {
    label: 'Sort Z → A',
    icon: '',
    value: TableColumnMenuActionEnum.sort_z_a,
  },
  {
    label: '6',
    icon: '',
    value: TableColumnMenuActionEnum.divider,
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
