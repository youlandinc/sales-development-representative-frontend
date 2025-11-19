export enum EmailDomainStateEnum {
  pending = 'PENDING',
  success = 'SUCCESS',
  failed = 'FAILED',
  active = 'ACTIVE',
}

export enum CampaignsPendingTimeLineEnum {
  scheduled = 'SCHEDULED',
  completed = 'COMPLETED',
}

export enum ModuleEnum {
  email_subject = 'SUBJECT_INSTRUCTION',
  email_body = 'CONTENT_INSTRUCTION',
  personal_research = 'PERSONAL_RESEARCH',
}

export enum LibraryTypeOfferTagTypeEnum {
  pain_points = 'PAIN_POINTS',
  solutions = 'SOLUTIONS',
  proof_points = 'PROOF_POINTS',
}

export enum SSE_EVENT_TYPE {
  'new_email' = 'NEW_EMAIL',
  'new_reply' = 'NEW_REPLY',
}

export enum FilterOperationEnum {
  equals = 'EQUALS',
  not = 'NOT',
  contains = 'CONTAINS',
  not_contains = 'NOT_CONTAINS',
  starts_with = 'STARTS_WITH',
  not_starts_with = 'NOT_STARTS_WITH',
  ends_with = 'ENDS_WITH',
  not_ends_with = 'NOT_ENDS_WITH',
}

export enum ProspectDelimiterEnum {
  comma = 'COMMA',
  semicolon = 'SEMICOLON',
  tab = 'TAB',
  pipe = 'PIPE',
}

export enum WebSocketTypeEnum {
  message = 'MESSAGE',
  heartbeat = 'HEARTBEAT',
  ack = 'ACK',
  error = 'ERROR',
  hello = 'HELLO',
  subscribe = 'SUBSCRIBE',
  ping = 'PING',
  pong = 'PONG',
  // csv
  progress = 'PROGRESS',
}

export enum ActiveTypeEnum {
  add = 'add',
  edit = 'edit',
}

export enum DomainSource {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM',
}

export enum EmailDomainState {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  ACTIVE = 'ACTIVE',
}

export interface EmailDomainDetails {
  id: number;
  email: string;
  emailDomain: string;
  validStatus: EmailDomainState;
  source: DomainSource;
  userName: string;
}

export interface EmailDomainData {
  domainType: string;
  recordName: string;
  recordValue: string;
}

export enum BizCodeEnum {
  email_domain = 'EMAIL_DOMAIN',
  signature = 'SIGNATURE',
}

export enum ProspectTableEnum {
  find_people = 'FIND_PEOPLE',
  find_companies = 'FIND_COMPANIES',
  from_csv = 'FROM_CSV',
  black_table = 'BLANK_TABLE',
  crm_list = 'CRM_LIST',
  agent = 'AGENT',
}

export enum PlanTypeEnum {
  // capital
  research = 'RESEARCH',
  intelligence = 'INTELLIGENCE',
  // real estate
  essential = 'ESSENTIAL',
  professional = 'PROFESSIONAL',
  institutional = 'INSTITUTIONAL',
  // corporate
  starter = 'STARTER',
  business = 'BUSINESS',
  enterprise = 'ENTERPRISE',
  // enrichment
  free = 'FREE',
  basic = 'BASIC',
  plus = 'PLUS',
  pro = 'PRO',
}
