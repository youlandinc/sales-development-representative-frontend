import { put } from '@/request/request';
import {
  TableViewData,
  ViewColumnsUpdateParams,
  ViewColumnUpdateParams,
} from '@/types/enrichment/table';

/**
 * Update single view column properties
 * API: PUT /sdr/table/view/properties
 */
export const _updateTableViewColumn = (
  params: Partial<ViewColumnUpdateParams>,
) => {
  return put<TableViewData>('/sdr/table/view/properties', params);
};

/**
 * Batch update view columns properties
 * API: PUT /sdr/table/view/properties/batch
 */
export const _updateTableViewColumns = (params: ViewColumnsUpdateParams) => {
  return put<TableViewData>('/sdr/table/view/properties/batch', params);
};

/**
 * Reorder view column position
 * API: PUT /sdr/table/view/header/reorder
 */
export const _reorderTableViewColumn = (params: {
  viewId: string;
  tableId: string;
  currentFieldId: string;
  beforeFieldId?: string;
  afterFieldId?: string;
}) => {
  return put<TableViewData>('/sdr/table/view/header/reorder', params);
};
