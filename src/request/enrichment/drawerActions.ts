import { get } from '../request';
import { IntegrationActionMenu } from '@/types/enrichment/integrations';
import { EnrichmentItem } from '@/types/enrichment/drawerActions';

export const _fetchActionCategory = () => {
  return get<EnrichmentItem[]>('/sdr/action/category');
};

export const _fetchActionSuggestions = (tableId: string) => {
  return get<IntegrationActionMenu[]>(`/sdr/action/suggestions/${tableId}`);
};
