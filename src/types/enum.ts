export enum EmailDomainStateEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  ACTIVE = 'ACTIVE',
}

export enum CampaignsPendingTimeLineEnum {
  scheduled = 'SCHEDULED',
  completed = 'COMPLETED',
}

export enum ModuleEnum {
  email_subject = 'SUBJECT_INSTRUCTION',
  email_body = 'CONTENT_INSTRUCTION',
}
