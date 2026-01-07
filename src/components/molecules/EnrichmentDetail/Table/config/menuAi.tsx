import { MenuIcon } from '../TableIcon';
import { getAddColumnMenuActions } from './menuAdd';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';
import { TableColumnActionOption } from '../types';

// AI column menu (p3)
export const getAiColumnMenuActions = (
  isPinned: boolean = false,
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
    label: 'Run info',
    icon: null,
    value: '', // No enum yet
  },
  {
    label: 'Run column',
    icon: null,
    value: '', // No enum yet
    submenu: [], // Run options
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
    label: 'Filter on this column',
    icon: null,
    value: '', // No enum yet
  },
  {
    label: '6',
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
