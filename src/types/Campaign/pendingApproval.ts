import { MarketingReportProcessStatusEnum } from '@/types/enum';

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
