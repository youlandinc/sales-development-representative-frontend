import { MarketingReportProcessStatusEnum } from '@/types/enum';

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

export interface CampaignLeadItem {
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  company: string | null;
  backgroundColor: string | null;
}

export type IMarketingReportTimeline = {
  status: MarketingReportProcessStatusEnum;
  startTime: string | null;
  endTime: string;
  total: number | null;
  dayDone: number | null;
  quantity: number | null;
  sent: number | null;
  unSent: number | null;
};

export interface MarketingReportDeliveryStatistics {
  sentTo: number;
  deliveredTo: number;
  deliveryRate: number;
  softBounces: number;
  hardBounces: number;
}

export interface MarketingReportOpenStatistics {
  estimatedOpens: number;
  trackableOpens: number;
  uniqueOpens: number;
  uniqueOpenRate: number;
  totalOpens: number;
  averageTimeToOpen: number;
  unTrackableContacts: number;
}

export interface MarketingReportClickStatistics {
  lastClick: string;
  totalClicks: number;
  uniqueClicks: number;
  clickThoughRate: number;
  clickToOpenRate: number;
  averageTimeToClick: number;
}

export interface MarketingReportUnsubscribeStatistics {
  unsubscribes: number;
  unsubscribeRate: number;
  spamComplaints: number;
  spamComplaintRate: number;
}

export interface MarketingReportPerformance {
  campaignId: string | number;
  subjectId: string;
  subjectName: string;
  deliveryStatistics: MarketingReportDeliveryStatistics;
  openStatistics: MarketingReportOpenStatistics;
  clickStatistics: MarketingReportClickStatistics;
  unsubscribesStatistics: MarketingReportUnsubscribeStatistics;
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
