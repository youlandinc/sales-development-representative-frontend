export enum CampaignStatusEnum {
  draft = 'DRAFT',
  active = 'ACTIVE',
  done = 'DONE',
  suspended = 'SUSPENDED',
}

export interface CampaignTableItem {
  campaignId: string | number;
  campaignName: string | null;
  campaignStatus: CampaignStatusEnum;
  createdAt: string | null;
  sourced: number | null;
  activeLeads: number | null;
  sent: number | null;
  uniqueOpens: number | null;
  uniqueOpenRate: number | null;
  uniqueClicks: number | null;
  uniqueClickRate: number | null;
  replied: number | null;
  repliedRate: number | null;
}

export interface ResponseCampaignTable {
  content: CampaignTableItem[];
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface ResponseCampaignStatistics {
  leadsSourced: number;
  activeLeads: number;
  openRate: number;
  replyRate: number;
  meetingsBooked: number;
}
