export enum LeadsTableItemStatusEnum {
  information_request = 'INFORMATION_REQUEST',
  interested = 'INTERESTED',
  meeting_request = 'MEETING_REQUEST',
}

export interface LeadsTableItemData {
  avatar: string;
  name: string;
  email: string;
  id: number | string;
  userId: string;
  tenantId: string;
  leadFirstName: string;
  leadLastName: string;
  company: string;
  jobTitle: string;
  activities: {
    sendEmails: number;
    clickEmails: number;
    replyEmails: number;
  };
  backgroundColor: string | null;
  status: LeadsTableItemStatusEnum | null;
  personalResearch: string;
  companyResearch: string;
}

export interface LeadsInfoCampaignsData {
  content: string;
  sentOn: string;
  subject: string;
}

export interface ResponseLeadsInfo {
  campaigns: LeadsInfoCampaignsData[];
  companyResearch: string | null;
  leadId: string | number;
  previewLeadId: string | number;
}
