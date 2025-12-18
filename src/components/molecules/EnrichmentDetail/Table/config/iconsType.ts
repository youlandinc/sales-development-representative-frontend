import { TableColumnTypeEnum } from '@/types/enrichment/table';

import ICON_TYPE_TEXT from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-text.svg';
import ICON_TYPE_NUMBER from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-number.svg';
import ICON_TYPE_EMAIL from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-email.svg';
import ICON_TYPE_PHONE from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-phone.svg';
import ICON_TYPE_CURRENCY from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-currency.svg';
import ICON_TYPE_DATE from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-date.svg';
import ICON_TYPE_URL from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-url.svg';
import ICON_TYPE_IMG_URL from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-img-url.svg';
import ICON_TYPE_CHECKBOX from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-checkbox.svg';
import ICON_TYPE_SELECT from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-select.svg';
import ICON_TYPE_ASSIGNED_TO from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-assigned-to.svg';
import ICON_TYPE_PARAGRAPH from '@/components/molecules/EnrichmentDetail/Table/assets/icon-type-paragraph.svg';

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
  [TableColumnTypeEnum.assigned_to]: ICON_TYPE_ASSIGNED_TO,
  [TableColumnTypeEnum.paragraph]: ICON_TYPE_PARAGRAPH,
};

export { default as ICON_RUN_AI } from '@/components/molecules/EnrichmentDetail/Table/assets/icon-run-ai.svg';
export { default as ICON_CELL_WARNING } from '@/components/molecules/EnrichmentDetail/Table/assets/icon-cell-warning.svg';
