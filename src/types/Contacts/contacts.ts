import { FilterOperationEnum } from '@/types';

export enum ContactsPageMode {
  default = 'DEFAULT',
  import = 'IMPORT',
}

export enum ColumnTypeEnum {
  text = 'TEXT',
  number = 'NUMBER',
  address = 'ADDRESS',
  uuid = 'UUID',
  email = 'EMAIL',
  phone = 'PHONE',
}

export type ColumnItem = {
  columnId: number | string;
  tenantId: string;
  tableId: number;
  columnLabel: string;
  columnName: string;
  columnType: ColumnTypeEnum;
  custom: string;
  active: boolean;
  unique: boolean;
  notNull: boolean;
  description: string;
  csn: number;
};

export interface FilterProps {
  filterId: string | number;
  columnName?: string | number;
  operation?: FilterOperationEnum | string;
  operationText?: string;
}

export interface SegmentOption extends Option {
  isSelect: boolean;
}

export type GetColumnsResponse = {
  tableId: number;
  tableLabel: string;
  tableName: string;
  metadataColumns: ColumnItem[];
  pageSize: number | null;
};

export enum SortDirection {
  asc = 'ASC',
  desc = 'DESC',
}

export type DirectoryGridQueryCondition = {
  page: number;
  size: number;
  searchFilter: Partial<{
    segmentId: number | string;
    segmentsFilters: {
      [key: string]: FilterProps[];
    };
    keyword: string;
  }>;
  sort: [
    {
      field: string;
      direction: SortDirection;
    },
  ];
};

export type RecordsItem = {
  columnId: ColumnItem['columnId'];
  columnLabel: ColumnItem['columnLabel'];
  columnName: ColumnItem['columnName'];
  columnType: ColumnItem['columnType'];
  columnValue: string;
};

export type DirectoryGridResponse = {
  data: PaginationResponse<Record<string, any>[]>;
  dataTotal: number;
}; /* {
  tableId: number;
  tableLabel: string;
  tableName: string;
  metadataColumns: ColumnItem[];
  metadataValues: {
    total: number;
    size: number;
    current: number;
    pages: number;
    records: RecordsItem[][];
  };
  totalRecords: number;
};*/

export type GridColumnItem = {
  id: ColumnItem['columnId'];
  field: string;
  label: string;
  sort: number;
  visibility: boolean;
  disabled?: boolean;
};

export type RecordItem = {
  columnId: number;
  columnName: string;
  columnValue: unknown;
};

export type AddContactRequestParam = {
  tableId: number;
  record: RecordItem[];
};

export type SortColumnItem = {
  columnId: ColumnItem['columnId'];
  columnName: ColumnItem['columnName'];
  active: boolean;
};

export type SortColumnParam = {
  tableId: number;
  columns: SortColumnItem[];
};

export type ValidateColumnData = {
  columnId: ColumnItem['columnId'];
  columnName: ColumnItem['columnName'];
  columnValue: unknown;
  tableId: number;
};

export enum DirectoryPageMode {
  default = 'DEFAULT',
  import = 'IMPORT',
}

export interface FilterProps {
  filterId: string | number;
  columnName?: string | number;
  operation?: FilterOperationEnum | string;
  operationText?: string;
}

export interface SegmentOptionResponseData {
  selected: boolean;
  id: number;
  name: string;
}

export type SegmentOptionResponseList = SegmentOptionResponseData[];

export interface SegmentOption extends Option {
  isSelect: boolean;
}

export enum CampaignSentTypeEnum {
  delivered = 'DELIVERED',
  undelivered = 'UNDELIVERED',
}

export enum ContactsTableTypeEnum {
  people = 1,
  companies,
}
