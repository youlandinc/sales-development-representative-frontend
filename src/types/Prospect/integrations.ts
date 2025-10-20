export enum IntegrationActionType {
  work_email = 'WORK_EMAIL',
  work_email_with_profile_url = 'WORK_EMAIL_WITH_PROFILE_URL',
  personal_email = 'PERSONAL_EMAIL',
  phone_number = 'PHONE_NUMBER',
  use_ai = 'USE_AI',
}

export interface IntegrationActionInputParams {
  semanticType: string;
  displayName: string;
  columnName: string;
  columnType: string;
  description: string;
  isRequired: boolean;
  selectedOption?: TOption | null;
}

export interface IntegrationAction {
  actionKey: string;
  name: string;
  integrationName: string;
  description: string;
  logoUrl: string;
  authAccountId: string;
  score: string;
  isDefault: boolean;
  inputParams: IntegrationActionInputParams[];
  skipped: boolean;
}

export enum WaterfallConfigTypeEnum {
  setup = 'setup',
  configure = 'configure',
}

export enum DisplayTypeEnum {
  main = 'main',
  integration = 'integration',
}

export enum MathIntegrationTypeEnum {
  work_email = 'find-work-email',
  personal_email = 'find-personal-email',
  phone_number = 'find-phone-number',
}

export interface WaterfallConfigsRequestParam
  extends Omit<IntegrationAction, 'inputParams'> {
  inputParameters: { name: string; formulaText: string }[];
}

export interface CreateWaterfallConfigRequestParam {
  waterfallFieldName: string;
  waterfallGroupName: string;
  requiredInputsBinding: { name: string; formulaText: string }[];
  waterfallConfigs: WaterfallConfigsRequestParam[];
}

export enum ActionsChildrenTypeEnum {
  integration = 'integration',
}
