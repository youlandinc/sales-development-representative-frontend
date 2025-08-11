export interface ProspectTableItem {
  tableId: string | number;
  tableName: string;
  createdAt: string | null;
  updatedAt: string | null;
  contacts: number;
}

export interface ResponseProspectTable {
  content: ProspectTableItem[];
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
