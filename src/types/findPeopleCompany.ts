export enum CompanyTypeEnum {
  customer = 'CUSTOMERS',
  venture_capital = 'VENTURE_CAPITAL',
  limited_partners = 'LIMITED_PARTNERS',
}

export enum FilterElementTypeEnum {
  select = 'SELECT',
  radio = 'RADIO',
  checkbox = 'CHECKBOX',
  input = 'INPUT',
  switch = 'SWITCH',
}

export enum FilterElementInputTypeEnum {
  text = 'TEXT',
  number = 'NUMBER',
}

export enum FindType {
  find_people = 'FIND_PEOPLE',
  find_company = 'FIND_COMPANIES',
}

export type SourceFromOpt = {
  bizId: string;
  title: string;
  logo: string;
  description: string;
  // headers: {
  //   columnKey: string;
  //   columnName: string;
  // }[];
};

export type FetchSearchTypeResponse = SourceFromOpt[];

type FilterOptionalItem = {
  optionMultiple?: boolean;
  optionValues?: Option[];
  groups?: FilterItem[];
};

export type FilterItem = {
  formType: FilterElementTypeEnum;
  formKey: string;
  formLabel: string;
  description: string;
  placeholder: string;
  inputType: FilterElementInputTypeEnum;
  defaultValue: string;
  verifyRule: string;
} & FilterOptionalItem;

export type FetchFiltersByTypeResponse = Record<string, FilterItem[]>;
