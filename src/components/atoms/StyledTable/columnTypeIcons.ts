import { TableColumnTypeEnum } from '@/types/Prospect/table';

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

export const COLUMN_TYPE_ICONS: {
  [key in TableColumnTypeEnum]: any;
} = {
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
};

export { default as ICON_RUN_AI } from './assets/icon-run-ai.svg';
