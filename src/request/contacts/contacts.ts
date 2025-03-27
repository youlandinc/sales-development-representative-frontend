import { del, get, post, put } from '../request';
import {
  CampaignSentTypeEnum,
  ContactsTableTypeEnum,
  DirectoryGridQueryCondition,
  DirectoryGridResponse,
  GetColumnsResponse,
  RecordsItem,
  SortColumnParam,
} from '@/types';

const tempUrl = 'https://test-pos-api.youland.com';

export const _getAllColumns = (tableId: ContactsTableTypeEnum) => {
  return get<GetColumnsResponse>(`/sdr/metadata/columns/${tableId}`);
};

export const _getGridListById = (
  tableId: number,
  queryCondition: Partial<DirectoryGridQueryCondition>,
) => {
  return post<DirectoryGridResponse>('/sdr/leads/list', {
    tableId,
    ...queryCondition,
  });
};

// export const _addNewColumn = (data: {
//   tableId: number;
//   columnLabel: string;
//   columnType: ColumnTypeEnum;
// }) => {
//   return post<GetColumnsResponse>('/customer/metadata/columns', data);
// };

// export const _addNewContact = (param: AddContactRequestParam) => {
//   return post('/customer/es/record', param);
// };

export const _sortColumn = (param: SortColumnParam) => {
  return put(`${tempUrl}/customer/metadata/columns`, param);
};

export const _deleteGridRecords = (param: {
  tableId: number;
  ids: string[];
}) => {
  return del('/sdr/leads/info', { data: param });
};

export const _exportGridRecords = (ids: string[], tableId: number) => {
  return post(
    '/sdr/leads/export',
    { ids, tableId },
    {
      responseType: 'blob',
    },
  );
};

// export const _validateColumnData = (param: ValidateColumnData) => {
//   return post<{ errorMessage: string; recordId: string; variant: HttpVariant }>(
//     '/customer/es/record/check',
//     param,
//   );
// };

export const _fetchContactDetail = (tableId: number, recordId: string) => {
  return get<
    Omit<DirectoryGridResponse, 'totalRecords' | 'metadataValues'> & {
      metadataValues: RecordsItem[];
    }
  >(`${tempUrl}/customer/es/record/${tableId}/${recordId}`);
};

// export const _updateContact = (
//   param: AddContactRequestParam & { recordId: string },
// ) => {
//   return put('/customer/es/record', param);
// };

// export const _preUploadExcel = (params: FormData) => {
//   return post<PreUploadExcelResponse>('/customer/task/data/preview', params, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };

// export const _startImportExcel = (params: {
//   taskId: PreUploadExcelResponse['taskId'];
//   columnMappingList: ExcelColumnMappingProps[];
//   mergeStrategy: ExcelMergeStrategyProps;
// }) => {
//   return post('/customer/task/execute', params);
// };

// export const _fetchImportHistories = () => {
//   return get<ExcelUploadHistory[]>('/customer/task/list');
// };
//
// export const _fetchImportHistoriesDetail = (id: string | number) => {
//   return get<ExcelUploadHistoryDetailResponse>(`/customer/task/detail/${id}`);
// };
//
// export const _fetchImportHistoryInvalidExcel = (id: string | number) => {
//   return post(
//     `/customer/task/download/invalid/${id}`,
//     {},
//     {
//       responseType: 'blob',
//     },
//   );
// };

export const _setPageSize = (params: { pageSize: number }) => {
  return post(`${tempUrl}/customer/user/config`, params);
};

export const _getCampaignInfo = (param: {
  contactId: string;
  page: number;
  size: number;
}) => {
  return post<{
    sent: number;
    clicks: number;
    opens: number;
    undelivered: number;
    acquisitionCost: number;
    campaignInfo: {
      records: {
        campaignName: string;
        sent: CampaignSentTypeEnum;
        hasClick: boolean;
        hasOpen: boolean;
      }[];
      total: number;
      size: number;
      current: number;
      pages: number;
    };
  }>(`${tempUrl}/customer/marketing/contact/campaignInfo`, param);
};
