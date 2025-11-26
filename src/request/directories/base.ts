import { get, post } from '@/request/request';
import {
  DirectoriesImportApiResponse,
  DirectoryApiResponse,
} from '@/types/directories';

export const _fetchDirectoriesInfo = () => {
  return get<DirectoryApiResponse[]>('/sdr/search/type');
};

export const _importDirectoriesDataToTable = (param: Record<string, any>) => {
  return post<DirectoriesImportApiResponse>('/sdr/table/import', param);
};
