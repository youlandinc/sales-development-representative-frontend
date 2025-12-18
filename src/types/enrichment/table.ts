// ============================================================================
// Enums
// ============================================================================

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
  actionDefinition: {
    actionKey: string;
    authAccountId: string;
    description: string;
    integrationName: string;
    logoUrl: string;
    name: string;
    score: string;
    skipped: boolean;
    inputParameters:
      | { formulaText: string; name: string; optional: boolean }[]
      | null;
  } | null;
  isExtractedField: boolean | null;
  mappingField: string | null;
}

// Runtime column meta (extends TableColumnProps with computed fields)
export interface TableColumnMeta extends Partial<TableColumnProps> {
  isAiColumn?: boolean;
  canEdit?: boolean;
}

export interface TableColumnActionOption {
  label: string;
  value: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
  icon: any;
  key?: string;
  submenu?: TableColumnActionOption[];
  parentValue?: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
}

export interface UpdateTableColumnConfigParams {
  fieldId: string;
  fieldName: string;
  fieldType: TableColumnTypeEnum;
  visible: boolean;
  description: string;
  color: string;
  pin: boolean;
  width: number;
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
