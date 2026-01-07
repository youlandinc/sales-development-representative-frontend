import { get, post } from '@/request/request';
import {
  DirectoriesImportResponse,
  DirectoryInfoResponse,
} from '@/types/directories';

export const _fetchDirectoriesInfo = () => {
  return get<DirectoryInfoResponse[]>('/sdr/search/type');
};

export const _importDirectoriesDataToTable = (param: Record<string, any>) => {
  return post<DirectoriesImportResponse>('/sdr/table/import', param);
};
