import { del, get, post, put } from '@/request/request';
import {
  ResponseCampaignEmail,
  ResponseCampaignInfo,
  ResponseCampaignLeadsInfo,
  ResponseCampaignMessagingStep,
  SetupPhaseEnum,
} from '@/types';
import { ModuleEnum } from '@/types/enum';

// common
export const _sendChatMessage = (params: {
  chatId?: number;
  message: string;
}) => {
  return post<{ chatId: number | string }>('/sdr/ai/chat', params);
};

export const _fetchChatLeads = (chatId: string | number) => {
  return get<ResponseCampaignLeadsInfo>(`/sdr/ai/leads/${chatId}`);
};

export const _fetchCampaignInfo = (campaignId: string | number) => {
  return get<ResponseCampaignInfo>(`/sdr/campaign/info/${campaignId}`);
};

export const _updateCampaignProcessSnapshot = (params: {
  campaignId: string | number;
  setupPhase: SetupPhaseEnum;
}) => {
  return put('/sdr/campaign/redirect', params);
};

export const _closeSSE = (chatId: string | number) => {
  return del(`/sdr/ai/chat/subscriber/${chatId}`);
};

// first step
export const _createCampaign = (params: { chatId: number | string }) => {
  return post<ResponseCampaignInfo>('/sdr/campaign/info', params);
};

// second step
export const _fetchEmailByLead = (params: {
  campaignId: number | string;
  previewLeadId: number | string;
}) => {
  return get<ResponseCampaignEmail[]>(
    `/sdr/campaign/lead/preview/email/${params.campaignId}/${params.previewLeadId}`,
  );
};

export const _addStepEmail = (params: {
  campaignId: number | string;
  previewLeadId: number | string;
}) => {
  return post<ResponseCampaignMessagingStep>(
    `/sdr/campaign/step/${params.campaignId}`,
  );
};

export const _updateStepEmailSendDays = (params: {
  stepId: string | number;
  sendAfterDays: number;
}) => {
  return put('/sdr/campaign/step', params);
};

export const _deleteStepEmail = (stepId: string | number) => {
  return del(`/sdr/campaign/step/${stepId}`);
};

export const _fetchStepEmail = (params: {
  stepId: string | number;
  previewLeadId: number | string;
}) => {
  return get<ResponseCampaignEmail>(
    `/sdr/campaign/step/email/${params.previewLeadId}/${params.stepId}`,
  );
};

export const _fetchLeadPersonalResearch = (leadId: string | number) => {
  return post('/sdr/ai/normal/generate', {
    module: ModuleEnum.personal_research,
    params: {
      leadId,
    },
  });
};

// secondary step drawer

export const _updateStepEmailSubjectInstructions = (params: {
  subjectExamples: string[];
}) => {
  return post('/sdr/ai/normal/generate', {
    tenantId: '1000052022092800000102',
    module: ModuleEnum.email_subject,
    params: {
      ...params,
    },
  });
};

export const _updateStepEmailSubject = (params: {
  stepId: string | number;
  instructions: string;
  examples: string[];
  previewLeadId: string | number;
}) => {
  return put('/sdr/campaign/step/subject', params);
};

export const _updateStepEmailBodyInstructions = (params: {
  contentExamples: string[];
  suggestedWordCount: number;
}) => {
  return post('/sdr/ai/normal/generate', {
    tenantId: '1000052022092800000102',
    module: ModuleEnum.email_body,
    params: {
      ...params,
    },
  });
};

export const _updateStepEmailBody = (params: {
  stepId: string | number;
  instructions: string;
  examples: string[];
  previewLeadId: string | number;
  wordCount: number;
  callToAction: string;
}) => {
  return put('/sdr/campaign/step/body', params);
};

export const _fetchLibraryOfferOptions = () => {
  return get('/sdr/library/offer/options');
};

export const _updateSelectedLibraryOffer = (params: {
  campaignId: string | number;
  offerIds: Array<number | string>;
}) => {
  return put('/sdr/campaign/offers/select', params);
};

// third step
export const _saveAndLunchCampaign = (params: {
  campaignId: string | number;
  dailyLimit: number;
  autopilot: boolean;
  sendNow: boolean;
  scheduleTime: string | null;
  sender: string;
  replyTo: string;
  senderName: string;
}) => {
  return put('/sdr/campaign/info', params);
};
