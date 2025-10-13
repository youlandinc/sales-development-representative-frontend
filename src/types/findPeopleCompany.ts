export enum CompanyTypeEnum {
  customer = 'CUSTOMERS',
  venture_capital = 'VENTURE_CAPITAL',
  limited_partners = 'LIMITED_PARTNERS',
}

export enum FilterElementTypeEnum {
  select = 'SELECT',
  text = 'TEXT',
  radio = 'RADIO',
  checkbox = 'CHECKBOX',
  input = 'INPUT',
  between = 'BETWEEN',
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
  headers: {
    columnKey: string;
    columnName: string;
  }[];
};

export type FetchSearchTypeResponse = SourceFromOpt[];

export type FilterItem = {
  formType: FilterElementTypeEnum;
  formKey: string;
  formLabel: string;
  description: string;
  placeholder: string;
  inputType: string;
  defaultValue: string;
  optionApiUrl: string;
  optionMultiple: boolean;
  verifyRule: string;
  optionValues: Option[];
};

export type FetchFiltersByTypeResponse = Record<string, FilterItem[]>;
