import { get, post } from '@/request/request';
import {
  InboxContentItem,
  InboxSideItem,
  ReceiptTypeEnum,
} from '@/stores/useInboxStore';

export const _fetchEmails = (
  param: PaginationParam & {
    searchContact?: string;
    emailType: ReceiptTypeEnum;
  },
) => {
  return post<PaginationResponse<InboxSideItem>>('/sdr/inbox/emails', param);
};

export type ForwardEmailsParam = {
  emailId: number;
  recipient: string;
  cc: string[];
  subject: string;
  content: string;
};

export const _replyEmails = (param: ForwardEmailsParam) => {
  return post('/sdr/inbox/email/reply', param);
};

export const _forwardEmails = (param: ForwardEmailsParam) => {
  return post('/sdr/inbox/email/forward', param);
};

export const _fetchEmailsDetails = (emailId: number) => {
  return get<{ emailInfos: InboxContentItem[] }>(`/sdr/inbox/email/${emailId}`);
};
