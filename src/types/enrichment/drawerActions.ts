import { IntegrationActionMenu } from './integrations';

export type SuggestionItem = IntegrationActionMenu;

export interface EnrichmentItem {
  categoryName: string;
  categoryKey: string;
  actions: SuggestionItem[];
}

export enum ActionsTypeKeyEnum {
  ai_template = 'ai-template',
  contact_information = 'contact_information',
}

export enum EnrichmentCategoryEnum {
  atlas_task_library = 'atlas_task_library',
  actions = 'actions',
  integrations = 'integrations',
}

export type DialogAllEnrichmentsAction = {
  name: IntegrationActionMenu['name'];
} & {
  [K in Exclude<keyof IntegrationActionMenu, 'name'>]:
    | IntegrationActionMenu[K]
    | null;
};

export interface DialogAllEnrichmentsResponse {
  categoryName: string;
  categoryKey: EnrichmentCategoryEnum;
  actions: DialogAllEnrichmentsAction[];
}

export enum SourceOfOpenEnum {
  dialog = 'dialog',
  drawer = 'drawer',
}
