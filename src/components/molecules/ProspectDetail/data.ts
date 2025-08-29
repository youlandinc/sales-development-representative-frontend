import ICON_COLUMN_USE_AI from './assets/table/icon-column-use-ai.svg';
import ICON_COLUMN_EDIT from './assets/table/icon-column-edit.svg';
import ICON_COLUMN_DESCRIPTION from './assets/table/icon-column-edit-description.svg';
import ICON_COLUMN_RENAME from './assets/table/icon-column-rename.svg';
import ICON_COLUMN_HIDE from './assets/table/icon-column-hide.svg';
import ICON_COLUMN_DELETE from './assets/table/icon-column-delete.svg';

import ICON_COLUMN_PIN from './assets/table/icon-column-pin.svg';
import ICON_COLUMN_UNPIN from './assets/table/icon-column-unpin.svg';

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
}

export interface TableColumnOption {
  label: string;
  value: TableColumnMenuEnum;
  icon: any;
}

export const getColumnMenuActions = (
  isPinned: boolean = false,
): TableColumnOption[] => [
  {
    label: 'Use AI agent',
    icon: ICON_COLUMN_USE_AI,
    value: TableColumnMenuEnum.ai_agent,
  },
  {
    label: '1',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Rename column',
    icon: ICON_COLUMN_RENAME,
    value: TableColumnMenuEnum.rename_column,
  },
  {
    label: 'Edit column',
    icon: ICON_COLUMN_EDIT,
    value: TableColumnMenuEnum.edit_column,
  },
  {
    label: '2',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: 'Edit description',
    icon: ICON_COLUMN_DESCRIPTION,
    value: TableColumnMenuEnum.edit_description,
  },
  {
    label: '3',
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
    label: '4',
    icon: '',
    value: TableColumnMenuEnum.divider,
  },
  {
    label: isPinned ? 'Unpin' : 'Pin',
    icon: isPinned ? ICON_COLUMN_UNPIN : ICON_COLUMN_PIN,
    value: TableColumnMenuEnum.pin,
  },
  {
    label: 'Hide',
    icon: ICON_COLUMN_HIDE,
    value: TableColumnMenuEnum.visible,
  },
  {
    label: 'Delete',
    icon: ICON_COLUMN_DELETE,
    value: TableColumnMenuEnum.delete,
  },
];
