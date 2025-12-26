import {
  DialogAllEnrichmentsResponse,
  EnrichmentItem,
} from '@/types/enrichment/drawerActions';
import { IntegrationActionMenu } from '@/types/enrichment/integrations';
import { FetchWebResearchModelListResponse } from '@/types/enrichment/webResearch';
import { get } from '../request';

export const _fetchActionCategory = () => {
  return get<EnrichmentItem[]>('/sdr/action/category');
};

export const _fetchActionSuggestions = (tableId: string) => {
  return get<IntegrationActionMenu[]>(`/sdr/action/suggestions/${tableId}`);
};

export const _fetchWebResearchModelList = () => {
  return get<FetchWebResearchModelListResponse>('/aiResearch/model/list');
};

export const _fetchAllEnrichmentsData = () => {
  return get<DialogAllEnrichmentsResponse[]>('/sdr/action/enrichment');
};
