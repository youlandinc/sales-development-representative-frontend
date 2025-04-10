import { CampaignStatusEnum, UserIntegrationEnum } from '@/types';

export enum SelectWithFlagTypeEnum {
  select = 'SELECT',
  input = 'INPUT',
}

export interface SearchWithFlagData {
  value: string;
  isIncludes?: boolean;
  type: SelectWithFlagTypeEnum;
}

export interface SelectWithCustomProps {
  inputValue: string;
  selectValue: string;
}

export enum ProcessCreateTypeEnum {
  filter = 'FILTER',
  csv = 'CSV',
  crm = 'CRM',
  agent = 'AGENT',
}

export enum ProcessCreateChatEnum {
  thinking = 'THINKING',
  create_plan = 'CREATE_PLAN',
  job_role = 'JOB_ROLE',
  job_title = 'JOB_TITLE',
  company_industry = 'COMPANY_INDUSTRY',
  search = 'SEARCH',
  completed = 'COMPLETED',
}

export enum SourceEnum {
  user = 'USER',
  server = 'SERVER',
}

export interface CampaignLeadItem {
  avatar: string | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  company: string | null;
  backgroundColor: string | null;
  leadId?: string | number;
  previewLeadId?: string | number;
  companyResearch: string | null;
  personalResearch: string | null;
}

export interface ResponseCampaignLeadsInfo {
  counts: number;
  leads: CampaignLeadItem[];
}

export enum SetupPhaseEnum {
  messaging = 'MESSAGING',
  audience = 'AUDIENCE',
  launch = 'LAUNCH',
}

export interface ResponseCampaignProcessChatServer {
  id: string;
  title: string;
  step: ProcessCreateChatEnum;
  sort: number;
  content?: string | null;
  labels?: string[] | null;
}

export interface ResponseCampaignChatRecord {
  id: string | null;
  data: ResponseCampaignProcessChatServer[];
  message: string | null;
  source: SourceEnum;
  isFake?: boolean;
}

export interface ResponseCampaignMessagingStepFormBody {
  stepId: number | string;
  bodyWordCount: number | null;
  bodyInstructions: string | null;
  bodyCallToAction: string | null;
  bodyExamples: string[];
}

export interface ResponseCampaignMessagingStepFormSubject {
  stepId: number | string;
  subjectInstructions: string | null;
  subjectExamples: string[];
}

export interface ResponseCampaignMessagingStep
  extends ResponseCampaignMessagingStepFormBody,
    ResponseCampaignMessagingStepFormSubject {
  numericalOrder: number;
  afterDays: number | null;
}

export interface ResponseCampaignLaunchInfo {
  dailyLimit: number;
  autopilot: boolean;
  sendNow: boolean;
  scheduleTime: string | null;
  sender: string | null;
  replyTo: string | null;
  senderName: string | null;
}

export interface ResponseCampaignEmail {
  stepId: string | number;
  content: string;
  subject: string;
  bodyInstructions: string;
  subjectInstructions: string;
}

export interface ResponseOfferOption {
  id: string | number;
  name: string;
  selected: boolean;
}

export interface ResponseCampaignFilterFormData {
  [key: string]: SearchWithFlagData[] | SelectWithCustomProps;
}

export interface ResponseCampaignInfo {
  campaignId: string | number;
  campaignName: string | null;
  campaignStatus: CampaignStatusEnum;
  chatId: number | string;
  setupPhase: SetupPhaseEnum;
  startingPoint: ProcessCreateTypeEnum;
  data: {
    // common
    leadInfo: ResponseCampaignLeadsInfo;
    steps: ResponseCampaignMessagingStep[];
    launchInfo: ResponseCampaignLaunchInfo;
    offerOptions: ResponseOfferOption[];
    // chat
    chatRecord?: ResponseCampaignChatRecord[];
    // filter
    conditions?: ResponseCampaignFilterFormData;
    // csv
    fileInfo?: FileInfo;
    // crm
    crmInfo?: CRMInfo;
  };
}

export interface FileInfo {
  url: string;
  fileName: string;
  originalFileName: string;
  [key: string]: any;
}

export interface CRMInfo {
  listId: string;
  provider: UserIntegrationEnum | string;
}

export interface ResponseCampaignCRMLeads {
  counts: number;
  leads: CampaignLeadItem[];
  data: { [key: string]: string };
  crmInfo: CRMInfo;
}

export interface ResponseCampaignCSVLeads {
  counts: number;
  leads: CampaignLeadItem[];
  data: { [key: string]: string };
  fileInfo: FileInfo;
}

export interface ResponseCampaignCRMProvider {
  id: number | string;
  crmName: string;
  connected: boolean;
  provider: UserIntegrationEnum;
}

export interface ResponseCampaignCRMList {
  listId: string;
  name: string;
  provider: UserIntegrationEnum;
  createdAt: string;
  updateAt: string;
  filtersUpdatedAt: string;
  processingStatus: string;
  createdById: string;
  updatedById: string;
  processingType: string;
  objectTypeId: string;
  additionalProperties: {
    hsListSize: string;
    hsLastRecordAddedAt: string;
    hsListReferenceCount: string;
  };
}
