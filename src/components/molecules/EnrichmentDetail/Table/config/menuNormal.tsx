import { MenuIcon, TypeIcon } from '../TableIcon';
import { getAddColumnMenuActions } from './menuAdd';
import {
  COLUMN_TYPE_LABELS,
  getChangeColumnTypeMenuActions,
} from './menuChangeType';
import {
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';
import { TableColumnActionOption } from '../types';

// Normal column menu (p2)
export const getNormalColumnMenuActions = (
  isPinned: boolean = false,
  currentColumnType?: TableColumnTypeEnum,
): TableColumnActionOption[] => [
  {
    label: 'Rename column',
    icon: <MenuIcon action={TableColumnMenuActionEnum.rename_column} />,
    value: TableColumnMenuActionEnum.rename_column,
  },
  {
    label: 'Edit column',
    icon: <MenuIcon action={TableColumnMenuActionEnum.edit_column} />,
    value: TableColumnMenuActionEnum.edit_column,
  },
  {
    label: '1',
    icon: null,
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: 'Insert 1 column left',
    icon: <MenuIcon action={TableColumnMenuActionEnum.insert_column_left} />,
    value: TableColumnMenuActionEnum.insert_column_left,
    submenu: getAddColumnMenuActions(),
  },
  {
    label: 'Insert 1 column right',
    icon: <MenuIcon action={TableColumnMenuActionEnum.insert_column_right} />,
    value: TableColumnMenuActionEnum.insert_column_right,
    submenu: getAddColumnMenuActions(),
  },
  {
    label: '2',
    icon: null,
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: 'Edit description',
    icon: <MenuIcon action={TableColumnMenuActionEnum.edit_description} />,
    value: TableColumnMenuActionEnum.edit_description,
  },
  {
    label: '3',
    icon: null,
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: 'Change color',
    icon: null,
    value: '', // No enum yet
    submenu: [], // Color options
  },
  {
    label: currentColumnType
      ? COLUMN_TYPE_LABELS[currentColumnType]
      : 'Change type',
    icon: currentColumnType ? <TypeIcon type={currentColumnType} /> : null,
    value: TableColumnMenuActionEnum.change_column_type,
    submenu: getChangeColumnTypeMenuActions(),
  },
  {
    label: '4',
    icon: null,
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: 'Duplicate',
    icon: null,
    value: '', // No enum yet
  },
  {
    label: '5',
    icon: null,
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: 'Sort A → Z',
    icon: null,
    value: TableColumnMenuActionEnum.sort_a_z,
  },
  {
    label: 'Sort Z → A',
    icon: null,
    value: TableColumnMenuActionEnum.sort_z_a,
  },
  {
    label: '6',
    icon: null,
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: 'Dedupe',
    icon: null,
    value: '', // No enum yet
  },
  {
    label: 'Filter on this column',
    icon: null,
    value: '', // No enum yet
  },
  {
    label: '7',
    icon: null,
    value: TableColumnMenuActionEnum.divider,
  },
  {
    label: isPinned ? 'Unpin' : 'Pin',
    icon: isPinned ? (
      <MenuIcon action={TableColumnMenuActionEnum.unpin} />
    ) : (
      <MenuIcon action={TableColumnMenuActionEnum.pin} />
    ),
    value: TableColumnMenuActionEnum.pin,
  },
  {
    label: 'Hide',
    icon: <MenuIcon action={TableColumnMenuActionEnum.visible} />,
    value: TableColumnMenuActionEnum.visible,
  },
  {
    label: 'Delete',
    icon: <MenuIcon action={TableColumnMenuActionEnum.delete} />,
    value: TableColumnMenuActionEnum.delete,
  },
];
