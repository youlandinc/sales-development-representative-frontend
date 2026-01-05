import { Icon, SvgIconProps } from '@mui/material';
import { FC } from 'react';

import {
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

// ========== Type Icons ==========
import ICON_TYPE_TEXT from './assets/icon-type-text.svg';
import ICON_TYPE_NUMBER from './assets/icon-type-number.svg';
import ICON_TYPE_EMAIL from './assets/icon-type-email.svg';
import ICON_TYPE_PHONE from './assets/icon-type-phone.svg';
import ICON_TYPE_CURRENCY from './assets/icon-type-currency.svg';
import ICON_TYPE_DATE from './assets/icon-type-date.svg';
import ICON_TYPE_URL from './assets/icon-type-url.svg';
import ICON_TYPE_IMG_URL from './assets/icon-type-img-url.svg';
import ICON_TYPE_CHECKBOX from './assets/icon-type-checkbox.svg';
import ICON_TYPE_SELECT from './assets/icon-type-select.svg';
import ICON_TYPE_ASSIGNED_TO from './assets/icon-type-assigned-to.svg';
import ICON_TYPE_PARAGRAPH from './assets/icon-type-paragraph.svg';
import ICON_TYPE_ADD from './assets/icon-type-add.svg';

// ========== Menu Icons ==========
import ICON_COLUMN_USE_AI from './assets/icon-column-use-ai.svg';
import ICON_COLUMN_EDIT from './assets/icon-column-edit.svg';
import ICON_COLUMN_DESCRIPTION from './assets/icon-column-edit-description.svg';
import ICON_COLUMN_RENAME from './assets/icon-column-rename.svg';
import ICON_COLUMN_HIDE from './assets/icon-column-hide.svg';
import ICON_COLUMN_VISIBLE from './assets/icon-column-visible.svg';
import ICON_COLUMN_DELETE from './assets/icon-column-delete.svg';
import ICON_COLUMN_PIN from './assets/icon-column-pin.svg';
import ICON_COLUMN_UNPIN from './assets/icon-column-unpin.svg';
import ICON_COLUMN_INSERT_LEFT from './assets/icon-column-insert-left.svg';
import ICON_COLUMN_INSERT_RIGHT from './assets/icon-column-insert-right.svg';
import ICON_COLUMN_ENRICHMENT from './assets/icon_enrichment.svg';

// ========== Other Icons ==========
import ICON_RUN_AI from './assets/icon-run-ai.svg';
import ICON_CELL_WARNING from './assets/icon-cell-warning.svg';
import ICON_ARROW from './assets/icon-arrow.svg';
import ICON_ARROW_DOWN from './assets/icon-arrow-down.svg';

type IconSize = 12 | 14 | 16 | 18 | 20;

interface TableIconProps extends SvgIconProps {
  size?: IconSize | number;
}

export const TableIcon = {
  // ========== Type Icons ==========
  TypeText: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_TEXT}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypeNumber: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_NUMBER}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypeEmail: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_EMAIL}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypePhone: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_PHONE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypeCurrency: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_CURRENCY}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypeDate: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_DATE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypeUrl: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_URL}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypeImgUrl: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_IMG_URL}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypeCheckbox: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_CHECKBOX}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypeSelect: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_SELECT}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypeAssignedTo: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_ASSIGNED_TO}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypeParagraph: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_PARAGRAPH}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  TypeAdd: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_TYPE_ADD}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  // ========== Menu Icons ==========
  MenuUseAi: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_USE_AI}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  MenuEdit: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_EDIT}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  MenuDescription: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_DESCRIPTION}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  MenuRename: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_RENAME}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  MenuHide: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_HIDE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  MenuVisible: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_VISIBLE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  MenuDelete: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_DELETE}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  MenuPin: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_PIN}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  MenuUnpin: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_UNPIN}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  MenuInsertLeft: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_INSERT_LEFT}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  MenuInsertRight: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_INSERT_RIGHT}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  MenuEnrichment: ({ size = 20, ...props }: TableIconProps) => (
    <Icon
      component={ICON_COLUMN_ENRICHMENT}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  // ========== Other Icons ==========
  RunAi: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_RUN_AI}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  CellWarning: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_CELL_WARNING}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  Arrow: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_ARROW}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  ArrowDown: ({ size = 16, ...props }: TableIconProps) => (
    <Icon
      component={ICON_ARROW_DOWN}
      {...props}
      sx={{ width: size, height: size, ...props.sx }}
    />
  ),

  // ========== Raw SVG exports (for Icon component prop) ==========
  TypeTextRaw: ICON_TYPE_TEXT,
  TypeNumberRaw: ICON_TYPE_NUMBER,
  TypeEmailRaw: ICON_TYPE_EMAIL,
  TypePhoneRaw: ICON_TYPE_PHONE,
  TypeCurrencyRaw: ICON_TYPE_CURRENCY,
  TypeDateRaw: ICON_TYPE_DATE,
  TypeUrlRaw: ICON_TYPE_URL,
  TypeImgUrlRaw: ICON_TYPE_IMG_URL,
  TypeCheckboxRaw: ICON_TYPE_CHECKBOX,
  TypeSelectRaw: ICON_TYPE_SELECT,
  TypeAssignedToRaw: ICON_TYPE_ASSIGNED_TO,
  TypeParagraphRaw: ICON_TYPE_PARAGRAPH,
  TypeAddRaw: ICON_TYPE_ADD,
  MenuHideRaw: ICON_COLUMN_HIDE,
  MenuVisibleRaw: ICON_COLUMN_VISIBLE,
  MenuUseAiRaw: ICON_COLUMN_USE_AI,
  MenuEditRaw: ICON_COLUMN_EDIT,
  MenuDescriptionRaw: ICON_COLUMN_DESCRIPTION,
  MenuRenameRaw: ICON_COLUMN_RENAME,
  MenuDeleteRaw: ICON_COLUMN_DELETE,
  MenuPinRaw: ICON_COLUMN_PIN,
  MenuUnpinRaw: ICON_COLUMN_UNPIN,
  MenuInsertLeftRaw: ICON_COLUMN_INSERT_LEFT,
  MenuInsertRightRaw: ICON_COLUMN_INSERT_RIGHT,
  MenuEnrichmentRaw: ICON_COLUMN_ENRICHMENT,
  RunAiRaw: ICON_RUN_AI,
  CellWarningRaw: ICON_CELL_WARNING,
};

// ========== Type Icon Map (internal) ==========
const TYPE_ICON_MAP: Record<TableColumnTypeEnum, any> = {
  [TableColumnTypeEnum.text]: ICON_TYPE_TEXT,
  [TableColumnTypeEnum.number]: ICON_TYPE_NUMBER,
  [TableColumnTypeEnum.email]: ICON_TYPE_EMAIL,
  [TableColumnTypeEnum.phone]: ICON_TYPE_PHONE,
  [TableColumnTypeEnum.currency]: ICON_TYPE_CURRENCY,
  [TableColumnTypeEnum.date]: ICON_TYPE_DATE,
  [TableColumnTypeEnum.url]: ICON_TYPE_URL,
  [TableColumnTypeEnum.img_url]: ICON_TYPE_IMG_URL,
  [TableColumnTypeEnum.checkbox]: ICON_TYPE_CHECKBOX,
  [TableColumnTypeEnum.select]: ICON_TYPE_SELECT,
  [TableColumnTypeEnum.assigned_to]: ICON_TYPE_ASSIGNED_TO,
  [TableColumnTypeEnum.paragraph]: ICON_TYPE_PARAGRAPH,
};

/**
 * Dynamic Type Icon Component
 * @example <TypeIcon type={TableColumnTypeEnum.text} size={16} />
 */
interface TypeIconProps extends SvgIconProps {
  type: TableColumnTypeEnum;
  size?: number;
}

export const TypeIcon: FC<TypeIconProps> = ({ type, size = 16, ...props }) => (
  <Icon
    component={TYPE_ICON_MAP[type] || ICON_TYPE_TEXT}
    {...props}
    sx={{ width: size, height: size, ...props.sx }}
  />
);

// ========== Menu Icon Map (internal) ==========
const MENU_ICON_MAP: Partial<Record<TableColumnMenuActionEnum, any>> = {
  [TableColumnMenuActionEnum.ai_agent]: ICON_COLUMN_USE_AI,
  [TableColumnMenuActionEnum.edit_column]: ICON_COLUMN_EDIT,
  [TableColumnMenuActionEnum.edit_description]: ICON_COLUMN_DESCRIPTION,
  [TableColumnMenuActionEnum.rename_column]: ICON_COLUMN_RENAME,
  [TableColumnMenuActionEnum.visible]: ICON_COLUMN_HIDE,
  [TableColumnMenuActionEnum.delete]: ICON_COLUMN_DELETE,
  [TableColumnMenuActionEnum.pin]: ICON_COLUMN_PIN,
  [TableColumnMenuActionEnum.unpin]: ICON_COLUMN_UNPIN,
  [TableColumnMenuActionEnum.insert_column_left]: ICON_COLUMN_INSERT_LEFT,
  [TableColumnMenuActionEnum.insert_column_right]: ICON_COLUMN_INSERT_RIGHT,
  [TableColumnMenuActionEnum.work_email]: ICON_COLUMN_ENRICHMENT,
};

/**
 * Dynamic Menu Icon Component
 * @example <MenuIcon action={TableColumnMenuActionEnum.pin} size={20} />
 */
interface MenuIconProps extends SvgIconProps {
  action: TableColumnMenuActionEnum;
  size?: number;
}

export const MenuIcon: FC<MenuIconProps> = ({
  action,
  size = 20,
  ...props
}) => (
  <Icon
    component={MENU_ICON_MAP[action] || ICON_COLUMN_EDIT}
    {...props}
    sx={{ width: size, height: size, ...props.sx }}
  />
);
