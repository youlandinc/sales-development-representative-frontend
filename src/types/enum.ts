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
}

export enum CompanyTypeEnum {
  customer = 'CUSTOMERS',
  venture_capital = 'VENTURE_CAPITAL',
  limited_partners = 'LIMITED_PARTNERS',
}
