export interface Mailbox {
  id: string;
  prefixName: string;
  domain: string;
  mailboxName: string;
}

export interface EmailProfile {
  id: number;
  senderName: string;
  signatureContent: string;
  mailboxList: Mailbox[];
  defaultMailbox: Mailbox;
  rotationEnabled: boolean;
}

export type EmailProfileResponse = EmailProfile[];

export interface EmailProfileRequest {
  id: number;
  senderName: string;
  signatureContent: string;
  mailboxIds: string[];
  defaultMailboxId: string;
  rotationEnabled: boolean;
}
