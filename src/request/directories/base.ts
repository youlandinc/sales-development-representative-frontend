import { get } from '@/request/request';
import { DirectoryApiResponse } from '@/types/directories';

export const _fetchDirectoriesInfo = () => {
  return get<DirectoryApiResponse[]>('/sdr/search/type');
};
