import { get } from '@/request/request';
import { DirectoryApiResponse } from '@/types/Directories';

export const _fetchDirectoriesInfo = () => {
  return get<DirectoryApiResponse[]>('/sdr/search/type');
};
