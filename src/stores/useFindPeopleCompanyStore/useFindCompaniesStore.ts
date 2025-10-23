import { create } from 'zustand';
import { CompanyTypeEnum, HttpError } from '@/types';
import { _fetchFundType, _fetchIndustries } from '@/request';
import { SDRToast } from '@/components/atoms';

// export const DEFAULT_FILTER = {
//   companyDescriptionKeywordsExclude: [],
//   companyDescriptionKeywords: [],
//   companyIdentifier: [],
//   companyIndustriesExclude: [],
//   companyIndustriesInclude: [],
//   companySizes: [],
//   locationCitiesExclude: [],
//   locationCitiesInclude: [],
//   locationCountriesExclude: [],
//   locationCountriesInclude: [],
//   locationRegionsExclude: [],
//   locationRegionsInclude: [],
//   locationStatesExclude: [],
//   locationStatesInclude: [],
//   locationsExclude: [],
//   locations: [],
//   name: '',
//   names: [],
//   resultCount: true,
//   limit: void 0,
//   limitPerCompany: void 0,
//   companyType: CompanyTypeEnum.customer,
//   fundingAmount: [],
//   fundType: [],
//   aum: [],
// };
// export type CompanyFilterKeysType =
//   | 'companyDescriptionKeywordsExclude'
//   | 'companyDescriptionKeywords'
//   | 'companyIndustriesExclude'
//   | 'companyIndustriesInclude'
//   | 'companySizes'
//   | 'locationCitiesExclude'
//   | 'locationCitiesInclude'
//   | 'locationCountriesExclude'
//   | 'locationCountriesInclude'
//   | 'locationRegionsExclude'
//   | 'locationRegionsInclude'
//   | 'locationStatesExclude'
//   | 'locationStatesInclude'
//   | 'locationsExclude'
//   | 'locations'
//   | 'name'
//   | 'names'
//   | 'resultCount'
//   | 'limit'
//   | 'limitPerCompany'
//   | 'companyType'
//   | 'fundingAmount'
//   | 'aum'
//   | 'fundType';

type FindCompaniesStoreState = {
  filters: Record<
    string,
    Option[] | boolean | string | number | undefined | CompanyTypeEnum
  >;
  industriesOpts: Option[];
  fundTypeOpts: Option[];
  dialogCompanyTypeOpen: boolean;
};

type FindCompaniesStoreActions = {
  setFilters: (key: string, value: any) => void;
  fetchIndustries: () => Promise<void>;
  fetchFundType: () => Promise<void>;
  resetFilters: () => void;
  setDialogCompanyTypeOpen: (open: boolean) => void;
};

type FindCompaniesStoreProps = FindCompaniesStoreState &
  FindCompaniesStoreActions;

export const useFindCompaniesStore = create<FindCompaniesStoreProps>()(
  (set, get) => ({
    filters: {},
    industriesOpts: [],
    fundTypeOpts: [],
    dialogCompanyTypeOpen: false,
    setFilters: (key: string, value: any) =>
      set({ filters: { ...get().filters, [key]: value } }),
    fetchIndustries: async () => {
      try {
        const res = await _fetchIndustries();
        if (res?.data && Array.isArray(res?.data)) {
          set({
            industriesOpts: res.data,
          });
        }
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    fetchFundType: async () => {
      try {
        const res = await _fetchFundType();
        if (res?.data && Array.isArray(res?.data)) {
          set({
            fundTypeOpts: res.data,
          });
        }
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    resetFilters: () => set({ filters: {} }),
    setDialogCompanyTypeOpen: (open: boolean) =>
      set({ dialogCompanyTypeOpen: open }),
  }),
);
