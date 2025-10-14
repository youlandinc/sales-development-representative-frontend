import { create } from 'zustand';

import { SDRToast } from '@/components/atoms';

import { _fetchFiltersByType, _fetchSearchType } from '@/request';

import {
  CompanyTypeEnum,
  FilterElementInputTypeEnum,
  FilterElementTypeEnum,
  FilterItem,
  FindType,
  HttpError,
  SourceFromOpt,
} from '@/types';

import { useFindPeopleStore } from './useFindPeopleStore';
import { useFindCompaniesStore } from './useFindCompaniesStore';

export const DEFAULT_FILTER = {
  companyDescriptionKeywordsExclude: [],
  companyDescriptionKeywords: [],
  companyIdentifier: [],
  companyIndustriesExclude: [],
  companyIndustriesInclude: [],
  companySizes: [],
  locationCitiesExclude: [],
  locationCitiesInclude: [],
  locationCountriesExclude: [],
  locationCountriesInclude: [],
  locationRegionsExclude: [],
  locationRegionsInclude: [],
  locationStatesExclude: [],
  locationStatesInclude: [],
  locationsExclude: [],
  locations: [],
  name: '',
  names: [],
  resultCount: true,
  limit: void 0,
  limitPerCompany: void 0,
  companyType: CompanyTypeEnum.customer,
  fundingAmount: [],
  fundType: [],
  aum: [],
};
export type CompanyFilterKeysType =
  | 'companyDescriptionKeywordsExclude'
  | 'companyDescriptionKeywords'
  | 'companyIndustriesExclude'
  | 'companyIndustriesInclude'
  | 'companySizes'
  | 'locationCitiesExclude'
  | 'locationCitiesInclude'
  | 'locationCountriesExclude'
  | 'locationCountriesInclude'
  | 'locationRegionsExclude'
  | 'locationRegionsInclude'
  | 'locationStatesExclude'
  | 'locationStatesInclude'
  | 'locationsExclude'
  | 'locations'
  | 'name'
  | 'names'
  | 'resultCount'
  | 'limit'
  | 'limitPerCompany'
  | 'companyType'
  | 'fundingAmount'
  | 'aum'
  | 'fundType';

type FindPeopleCompanyStoreState = {
  findType: FindType;
  dialogSourceFromOpen: boolean;
  checkedSource: SourceFromOpt;
  sourceFromOpts: SourceFromOpt[];
  filters: Record<string, FilterItem[]>;
  queryConditions: Record<string, any>;
  fetchSourceLoading: boolean;
  fetchFiltersByTypeLoading: boolean;
};

type FindPeopleCompanyStoreActions = {
  setFindType: (type: FindType) => void;
  setFilters: (filters: Record<string, FilterItem[]>) => void;
  setDialogSourceFromOpen: (open: boolean) => void;
  setCheckedSource: (source: SourceFromOpt) => void;
  setQueryConditions: (conditions: Record<string, any>) => void;
  fetchSource: () => Promise<void>;
  fetchFiltersByType: () => Promise<void>;
};

type FindPeopleCompanyStoreProps = FindPeopleCompanyStoreState &
  FindPeopleCompanyStoreActions;

const queryConditionDefault = (
  type: FilterElementTypeEnum,
  inputType?: FilterElementInputTypeEnum,
) => {
  if (type === FilterElementTypeEnum.select) {
    return [];
  }
  if (type === FilterElementTypeEnum.checkbox) {
    return [];
  }
  if (type === FilterElementTypeEnum.radio) {
    return '';
  }
  if (
    type === FilterElementTypeEnum.input &&
    inputType === FilterElementInputTypeEnum.number
  ) {
    return '';
  }
  if (
    type === FilterElementTypeEnum.input &&
    inputType === FilterElementInputTypeEnum.text
  ) {
    return [];
  }
  if (type === FilterElementTypeEnum.between) {
    return '';
  }
  return '';
};

export const useFindPeopleCompanyStore = create<FindPeopleCompanyStoreProps>()(
  (set, get) => ({
    filters: {},
    queryConditions: {},
    fetchSourceLoading: false,
    fetchFiltersByTypeLoading: false,
    findType: FindType.find_people,
    sourceFromOpts: [],
    dialogSourceFromOpen: false,
    checkedSource: {
      bizId: '',
      title: '',
      logo: '',
      description: '',
      headers: [],
    },
    setFindType: (type: FindType) => {
      set({ findType: type });
    },
    setDialogSourceFromOpen: (open: boolean) =>
      set({ dialogSourceFromOpen: open }),
    fetchSource: async () => {
      try {
        set({ fetchSourceLoading: true });
        const res = await _fetchSearchType(get().findType);
        if (res?.data && Array.isArray(res?.data)) {
          set({
            sourceFromOpts: res.data,
          });
        }
        set({ fetchSourceLoading: false });
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        set({ fetchSourceLoading: false });
      }
    },
    setCheckedSource: (source: SourceFromOpt) => set({ checkedSource: source }),
    setFilters: (filters: Record<string, FilterItem[]>) => set({ filters }),
    setQueryConditions: (conditions: Record<string, any>) =>
      set({ queryConditions: conditions }),
    fetchFiltersByType: async () => {
      try {
        set({ fetchFiltersByTypeLoading: true });
        const res = await _fetchFiltersByType(get().checkedSource.bizId);
        if (res?.data) {
          set({
            filters: res.data,
            queryConditions: Object.fromEntries(
              Object.values(res.data)
                .flat()
                .map((item) => [
                  item.formKey,
                  queryConditionDefault(item.formType, item?.inputType),
                ]),
            ),
          });
        }
        set({ fetchFiltersByTypeLoading: false });
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        set({ fetchFiltersByTypeLoading: false });
      }
    },
  }),
);

/* 1. 接口拆分开
2. header放在gird里面
3. id */
