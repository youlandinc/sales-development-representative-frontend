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
}

export interface TableColumnActionOption {
  label: string;
  value: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
  icon: any;
  key?: string;
  submenu?: TableColumnActionOption[];
  parentValue?: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
}

export interface TableColumnProps {
  fieldId: string;
  description: string | null;
  fieldName: string;
  fieldType: TableColumnTypeEnum;
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
  actionDefinition: any | null;
  isExtractedField: boolean | null;
  mappingField: string | null;
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

export enum TableCellConfidenceEnum {
  low = 'LOW',
  medium = 'MEDIUM',
  high = 'HIGH',
}

export interface TableCellBusinessData {
  // fieldId
  [key: string]: {
    value: any;
    isFinished?: boolean;
    externalContent?: {
      confidence: TableCellConfidenceEnum;
      stepsTaken: [];
      reasoning: '';
      [key: string]: any;
    };
  };
}

export interface TableCellBaseData {
  deleted: boolean;
  id: string;
}

export type TableCellProps = TableCellBaseData & TableCellBusinessData;
