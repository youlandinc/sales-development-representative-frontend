import { post } from '@/request/request';

import { DirectoriesBizIdEnum } from '@/types/Directories';

export const _fetchDirectoriesConfig = (params: {
  bizId: DirectoriesBizIdEnum;
  institutionType?: string;
}) => {
  return post('/sdr/search/config', params);
};
