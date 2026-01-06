// ============================================================================
// Enums
// ============================================================================

import {
  ColumnFieldGroupMap,
  IntegrationAction,
  RunRecordItem,
  TableFilterConditionType,
  TableFilterGroupItem,
} from '@/types';

import { ReactNode } from 'react';

export enum TableColumnTypeEnum {
  text = 'TEXT',
  number = 'NUMBER',
  email = 'EMAIL',
  phone = 'PHONE',
  currency = 'CURRENCY',
  date = 'DATE',
  url = 'URL',
  img_url = 'IMG_URL',
  checkbox = 'CHECKBOX',
  select = 'SELECT',
  assigned_to = 'ASSIGNED_TO',
  paragraph = 'PARAGRAPH',
}

export enum TableColumnMenuActionEnum {
  divider = 'DIVIDER',
  ai_agent = 'AI_AGENT',
  rename_column = 'RENAME_COLUMN',
  edit_column = 'EDIT_COLUMN',
  edit_description = 'EDIT_DESCRIPTION',
  sort_a_z = 'SORT_A_Z',
  sort_z_a = 'SORT_Z_A',
  pin = 'PIN',
  unpin = 'UNPIN',
  visible = 'VISIBLE',
  delete = 'DELETE',
  cell_detail = 'CELL_DETAIL',
  header_actions = 'HEADER_ACTIONS',
  insert_column_left = 'INSERT_COLUMN_LEFT',
  insert_column_right = 'INSERT_COLUMN_RIGHT',
  change_column_type = 'CHANGE_COLUMN_TYPE',
  actions_overview = 'ACTIONS_OVERVIEW',
  work_email = 'WORK_EMAIL',
}

export enum TableCellConfidenceEnum {
  low = 'LOW',
  medium = 'MEDIUM',
  high = 'HIGH',
}

export interface TableDataApiResponse {
  runRecords: {
    [key: string]: RunRecordItem;
  } | null;
  fields: TableColumnProps[];
  fieldGroupMap: ColumnFieldGroupMap | null;
  description: null | string;

  tableName: string;
  tableId: string;
  views: TableViewData[];

  source: string;

  updatedAt: string;
  updatedBy: string;
  createdBy: string;
  createdAt: string;
}

export enum TableViewTypeEnum {
  general = 'GENERAL',
  missing_data = 'MISSING_DATA',
  errored = 'ERRORED',
}

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
}

// ============================================================================
// Column Types
// ============================================================================

export interface TableColumnProps {
  fieldId: string;
  fieldName: string;
  fieldType: TableColumnTypeEnum;
  description: string | null;
  actionKey: string | null;
  dependentFieldId: string | null;
  visible: boolean;
  isUnique: boolean;
  nullable: boolean;
  pin: boolean;
  color: string | null;
  csn: number;
  width: number;
  typeSettings: {
    inputBinding: {
      formulaText: string;
      name: string;
    }[];
    optionalPathsInInputs: {
      prompt: string[];
    };
  } | null;
  semanticType: string | null;
  groupId: string | null;
  actionDefinition: IntegrationAction | null;
  isExtractedField: boolean | null;
  mappingField: string | null;

  supportedFilterConditions:
    | {
        conditionType: TableFilterConditionType;
        needsValue: boolean;
      }[]
    | null;
}

// Runtime column meta (extends TableColumnProps with computed fields)
export interface TableColumnMeta extends Partial<TableColumnProps> {
  isAiColumn?: boolean;
  canEdit?: boolean;
}

export interface TableColumnActionOption {
  label: string;
  value: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
  icon: ReactNode;
  key?: string;
  submenu?: TableColumnActionOption[];
  parentValue?: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
}

export interface UpdateTableMetaColumnParams {
  fieldId: string;
  description: string;
  fieldName: string;
  fieldType: TableColumnTypeEnum;
}

export interface TableViewColumnProps {
  fieldId: string;
  sort: number;
  pin: boolean;
  visible: boolean;
  width: number;
  // todo: enum
  color: string;
}

export interface UpdateTableViewColumnsParams {
  tableId: string;
  viewId: string;
  fields: Partial<TableViewColumnProps>[];
}

export interface UpdateTableViewColumnParams {
  viewId: string;
  fieldId: string;
  sort?: number;
  pin?: boolean;
  visible?: boolean;
  width?: number;
  color?: string;
}

// ============================================================================
// Cell Types
// ============================================================================

export type TableCellMetadata =
  | {
      isValidate: boolean;
      status: string;
      imagePreview: string;
      confidence?: never;
    }
  | {
      isValidate: boolean;
      status: string;
      confidence: TableCellConfidenceEnum;
      imagePreview?: never;
    }
  | {
      isValidate: boolean;
      status: string;
      imagePreview?: never;
      confidence?: never;
    };

export interface TableCellFieldData {
  fid: string;
  value: any;
  isFinished?: boolean;
  externalContent?: {
    confidence: TableCellConfidenceEnum;
    stepsTaken: [];
    reasoning: '';
    [key: string]: any;
  };
  metaData?: TableCellMetadata | null;
}

export interface TableCellBusinessData {
  [key: string]: TableCellFieldData;
}

export interface TableCellBaseData {
  deleted: boolean;
  id: string;
}

export type TableCellProps = TableCellBaseData & TableCellBusinessData;

export interface AddColumnApiData {
  field: TableColumnProps;
  view: TableViewData;
}
