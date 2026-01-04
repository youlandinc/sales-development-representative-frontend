import { TableColumnTypeEnum } from '@/types/enrichment/table';
import { COLUMN_TYPE_ICONS } from '@/components/molecules/EnrichmentDetail/Table/config/iconsType';

export const getColumnTypeIcon = (fieldType: TableColumnTypeEnum) => {
  return (
    COLUMN_TYPE_ICONS[fieldType] || COLUMN_TYPE_ICONS[TableColumnTypeEnum.text]
  );
};
