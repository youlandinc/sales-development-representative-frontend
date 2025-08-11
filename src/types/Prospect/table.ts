export enum TableHeaderTypeEnum {
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
