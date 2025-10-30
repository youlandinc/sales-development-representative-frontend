import { IntegrationActionType } from '@/types';

export const IntegrationSaveTypeParam: Record<IntegrationActionType, string> = {
  [IntegrationActionType.work_email]: 'Work Email',
  [IntegrationActionType.phone_number]: 'Phone Number',
  [IntegrationActionType.personal_email]: 'Personal Email',
  [IntegrationActionType.linkedin_profile]: 'LinkedIn Profile',
};

export const WATERFALL_DESCRIPTION: Record<IntegrationActionType, string> = {
  [IntegrationActionType.work_email]:
    "Find a person's work email, this waterfall is optimized for companies below 500 employees.",
  [IntegrationActionType.personal_email]:
    "Find a person's personal email, this waterfall is optimized for individual contacts.",
  [IntegrationActionType.phone_number]:
    "Need a person's mobile phone number? This system automatically searches through multiple sources to find it for you, ensuring you get the information you need without any extra effort.",
  [IntegrationActionType.linkedin_profile]:
    "Find a person's LinkedIn profile, this waterfall is optimized for companies below 500 employees.",
};

export const HEADER_NAME: Record<IntegrationActionType, string> = {
  [IntegrationActionType.work_email]: 'Work Email',
  [IntegrationActionType.phone_number]: 'Phone Number',
  [IntegrationActionType.personal_email]: 'Personal Email',
  [IntegrationActionType.linkedin_profile]: 'LinkedIn Profile',
};
