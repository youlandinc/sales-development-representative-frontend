import { del, get, post, put } from '@/request/request';
import { ResponseCampaignStatistics, ResponseCampaignTable } from '@/types';

export const _fetchCampaignStatistics = () => {
  return get<ResponseCampaignStatistics>('/sdr/campaign/statistics');
};

export const _fetchCampaignTableData = (params: {
  size: number;
  page: number;
  searchWord?: string;
}) => {
  return post<ResponseCampaignTable>('/sdr/campaign/infos', params);
};

export const _deleteCampaignTableItem = (campaignId: string | number) => {
  return del(`/sdr/campaign/info/${campaignId}`);
};

export const _renameCampaign = (params: {
  campaignName: string;
  campaignId: string | number;
}) => {
  return put('/sdr/campaign/name', params);
};

export const _fetchEnrichmentTableData = () => {
  return post<{
    content: {
      tableId: string;
      tableName: string;
    }[];
  }>('/sdr/prospect/list', {
    size: 1000,
    page: 0,
  });
};

export const _fetchEnrichmentTableOptions = (tableId: string) => {
  return get<{ fieldName: string; fieldId: string }[]>(
    `/sdr/prospect/table/${tableId}/fields`,
  );
};

export const _fetchEnrichmentTableMapping = (tableId: string) => {
  return get<{
    mappings: {
      fieldId: string | null;
      fieldName: string;
      campaignRequiredColumnEnum: string;
    }[];
  }>(`/sdr/prospect/table/field/mapping/${tableId}`);
};

export const _updateMappingField = (param: {
  fieldId: string;
  requiredColumn: string;
}) => {
  return post('/sdr/prospect/table/field/mapping', param);
};
