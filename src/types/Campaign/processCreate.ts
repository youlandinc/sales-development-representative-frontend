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
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  company: string | null;
  backgroundColor: string | null;
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

export interface ResponseCampaignInfo {
  campaignId: string | number;
  campaignName: string | null;
  campaignStatus: CampaignStatusEnum;
  chatId: number | string;
  setupPhase: SetupPhaseEnum;
  data: {
    leadInfo: ResponseCampaignLeadsInfo;
    chatRecord: ResponseCampaignChatRecord[];
  };
}
