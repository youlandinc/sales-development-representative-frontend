import { CampaignsPendingTimeLineEnum } from '@/types/enum';
import { CampaignStatusEnum } from '@/types';

export interface ICampaignsPendingBaseInfo {
  sentOn: string;
  replyTo: string;
  sender: string;
}

export type ICampaignsPendingTimeline = {
  status: CampaignsPendingTimeLineEnum;
  startTime: string | null;
  endTime: string;
  total: number | null;
  dayDone: number | null;
  quantity: number | null;
  sent: number | null;
  unSent: number | null;
};

export interface CampaignsPendingDeliveryStatistics {
  sentTo: number;
  deliveredTo: number;
  deliveryRate: number;
  softBounces: number;
  hardBounces: number;
}

export interface CampaignsPendingOpenStatistics {
  estimatedOpens: number;
  trackableOpens: number;
  uniqueOpens: number;
  uniqueOpenRate: number;
  totalOpens: number;
  averageTimeToOpen: number;
  unTrackableContacts: number;
}

export interface CampaignsPendingClickStatistics {
  lastClick: string;
  totalClicks: number;
  uniqueClicks: number;
  clickThoughRate: number;
  clickToOpenRate: number;
  averageTimeToClick: number;
}

export interface CampaignsPendingUnsubscribeStatistics {
  unsubscribes: number;
  unsubscribeRate: number;
  spamComplaints: number;
  spamComplaintRate: number;
}

export interface ICampaignsPendingPerformance {
  campaignId: string | number;
  subjectId: string;
  subjectName: string;
  deliveryStatistics: CampaignsPendingDeliveryStatistics;
  openStatistics: CampaignsPendingOpenStatistics;
  clickStatistics: CampaignsPendingClickStatistics;
  unsubscribesStatistics: CampaignsPendingUnsubscribeStatistics;
}

type StringOrNull<T> = {
  [K in keyof T]: string | null;
};

export interface CampaignsPendingResponseData {
  campaignName: string;
  campaignId: number;
  campaignStatus: CampaignStatusEnum;
  data: {
    timeLine: ICampaignsPendingTimeline[];
    performance: ICampaignsPendingPerformance;
    autopilot: boolean;
    hasManySteps: boolean;
  } & StringOrNull<ICampaignsPendingBaseInfo>;
}

export type ICampaignsPendingEmailsItem = {
  emailId: number;
  sentOn: string;
  email: string;
  avatar: string | null;
  subject: string;
  content: string;
  stepSequence: number;
  name: string;
  leadId: number;
};

export type CampaignsPendingEmailsResponseData = {
  content: ICampaignsPendingEmailsItem[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
