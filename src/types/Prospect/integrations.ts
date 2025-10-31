export enum IntegrationActionType {
  work_email = 'WORK_EMAIL',
  personal_email = 'PERSONAL_EMAIL',
  phone_number = 'PHONE_NUMBER',
  linkedin_profile = 'LINKEDIN_PROFILE',
  // use_ai = 'USE_AI',
}

export enum MathIntegrationTypeEnum {
  work_email = 'find-work-email',
  personal_email = 'find-personal-email',
  phone_number = 'find-phone-number',
  linkedin_profile = 'find-linkedin-profile',
}

// Mapping from MathIntegrationTypeEnum to IntegrationActionType
export const MATH_INTEGRATION_TO_ACTION_TYPE: Record<
  MathIntegrationTypeEnum,
  IntegrationActionType
> = {
  [MathIntegrationTypeEnum.work_email]: IntegrationActionType.work_email,
  [MathIntegrationTypeEnum.personal_email]:
    IntegrationActionType.personal_email,
  [MathIntegrationTypeEnum.phone_number]: IntegrationActionType.phone_number,
  [MathIntegrationTypeEnum.linkedin_profile]:
    IntegrationActionType.linkedin_profile,
};

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

interface IInputParameters {
  name: string;
  formulaText: string;
}

export interface WaterfallConfigsRequestParam
  extends Omit<IntegrationAction, 'inputParams'> {
  inputParameters: IInputParameters[];
}

export interface CreateWaterfallConfigRequestParam {
  waterfallFieldName: string;
  waterfallGroupName: string;
  requiredInputsBinding: IInputParameters[];
  waterfallConfigs: WaterfallConfigsRequestParam[];
}

export enum ActionsChildrenTypeEnum {
  integration = 'integration',
}
