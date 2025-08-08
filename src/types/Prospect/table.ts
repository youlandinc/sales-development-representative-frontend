export enum TableHeaderTypeEnum {
  text = 'TEXT',
}

export interface TableHeaderProps {
  fieldId: string;
  description: string | null;
  fieldName: string;
  fieldType: TableHeaderTypeEnum;
  hidden: boolean;
  isUnique: boolean;
  nullable: boolean;
  pin: boolean;
  color: string | null;
  csn: number;
}
