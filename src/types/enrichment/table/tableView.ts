// ============================================================================
// Table View Types (views - each view has independent config)
// ============================================================================

import { TableFilterGroupItem, TableViewTypeEnum } from './index';

// View column config (fieldProps - per view)
export interface TableViewColumnProps {
  fieldId: string;
  sort: number;
  pin: boolean;
  visible: boolean;
  width: number | null;
  color: string;
}

// View data
export interface TableViewData {
  tableId: string;

  viewId: string;
  viewName: string;
  viewDescription: string | null;
  viewType: TableViewTypeEnum;

  filters: TableFilterGroupItem[] | null;
  fieldProps: TableViewColumnProps[];

  isDefaultOpen: boolean;
  isPreconfigured: boolean;
  sort: number;
  fieldDirections: unknown[];
}

// API Params
export interface ViewColumnUpdateParams {
  viewId: string;
  fieldId: string;
  sort?: number;
  pin?: boolean;
  visible?: boolean;
  width?: number;
  color?: string;
}

export interface ViewColumnsUpdateParams {
  tableId: string;
  viewId: string;
  fields: Partial<TableViewColumnProps>[];
}
