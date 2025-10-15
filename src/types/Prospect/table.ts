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

export interface TableColumnProps {
  fieldId: string;
  description: string | null;
  fieldName: string;
  fieldType: TableColumnTypeEnum;
  actionKey: string | null;
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
  };
  semanticType: string;
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
