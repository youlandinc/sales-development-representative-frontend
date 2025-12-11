import { IntegrationActionMenu } from './integrations';

export type SuggestionItem = IntegrationActionMenu;

export interface EnrichmentItem {
  categoryName: string;
  categoryKey: string;
  actions: SuggestionItem[];
}

export enum ActionsTypeKeyEnum {
  ai_template = 'ai-template',
}
