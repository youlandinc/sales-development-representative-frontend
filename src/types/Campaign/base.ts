export enum CampaignStatusEnum {
  draft = 'DRAFT',
  active = 'ACTIVE',
  done = 'DONE',
  suspended = 'SUSPENDED',
}

export interface CampaignTableItem {
  id: string | number;
  name: string | null;
  status: CampaignStatusEnum;
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
