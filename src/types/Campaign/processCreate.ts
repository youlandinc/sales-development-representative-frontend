import { CampaignStatusEnum } from '@/types';

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

export interface ResponseCampaignMessagingStep {
  stepId: number | string;
  numericalOrder: number;
  afterDays: number | null;
  bodyWordCount: number | null;
  subjectInstructions: string | null;
  subjectExamples: string[];
  bodyInstructions: string | null;
  bodyCallToAction: string | null;
  bodyExamples: string[];
}

export interface ResponseCampaignLaunchInfo {
  dailyLimit: number | null;
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
}

export interface ResponseCampaignInfo {
  campaignId: string | number;
  campaignName: string | null;
  campaignStatus: CampaignStatusEnum;
  chatId: number | string;
  setupPhase: SetupPhaseEnum;
  data: {
    leadInfo: ResponseCampaignLeadsInfo;
    chatRecord: ResponseCampaignChatRecord[];
    steps: ResponseCampaignMessagingStep[];
    launchInfo: ResponseCampaignLaunchInfo;
  };
}
