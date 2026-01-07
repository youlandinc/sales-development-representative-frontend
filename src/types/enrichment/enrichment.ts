export enum EnrichmentTableEnum {
  find_people = 'FIND_PEOPLE',
  find_companies = 'FIND_COMPANIES',
  from_csv = 'FROM_CSV',
  blank_table = 'BLANK_TABLE',
  crm_list = 'CRM_LIST',
  agent = 'AGENT',
}

/**
 * Enrichment table item in list
 */
export interface EnrichmentTableItem {
  tableId: string;
  tableName: string;
  createdAt: string | null;
  updatedAt: string | null;
  contacts: number;
  source: EnrichmentTableEnum;
  children: EnrichmentTableItem[] | null;
}

/**
 * Response for fetching all enrichment tables
 * API: /sdr/table/all
 */
export type EnrichmentTableAllResponse = EnrichmentTableItem[];

/**
 * Response for paginated enrichment table list
 * API: /sdr/table/list
 */
export interface EnrichmentTableListResponse {
  content: EnrichmentTableItem[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
