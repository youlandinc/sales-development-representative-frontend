import { post } from '@/request/request';

import { DirectoriesBizIdEnum } from '@/types/Directories';

export const _fetchDirectoriesConfig = (params: {
  bizId: DirectoriesBizIdEnum;
}) => {
  return post('/sdr/search/config', params);
};

export const _fetchDirectoriesAdditionalConfig = (params: any) => {
  return post('/sdr/search/config/additional', params);
};

const temp = {
  bizId: 'CAPITAL_MARKETS',
  institutionType: 'INVESTORS_FUNDS',
  entityType: 'FIRM',
  excludeFirms: {
    tableId: '',
    tableFieldId: '',
    tableViewId: '',
    keywords: [],
  },
  EXECUTIVE: {
    entityType: null,
    companyType: null,
    companyName: null,
    companyAum: null,
    investmentSector: null,
    contactTitle: null,
    executiveLocation: null,
    firmLocation: null,
    includeFirms: {
      tableId: '',
      tableFieldId: '',
      tableViewId: '',
      keywords: [],
    },
    excludeIndividuals: {
      tableId: '',
      tableFieldId: '',
      tableViewId: '',
      keywords: [],
    },
    limitResults: null,
    limitPerCompany: null,
  },
};
