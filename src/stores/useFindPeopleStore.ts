import { create } from 'zustand/index';

export type FilterKeysType =
  | 'aboutKeywords'
  | 'companyDescriptionKeywordsExclude'
  | 'companyDescriptionKeywords'
  | 'companyIdentifier'
  | 'companyIndustriesExclude'
  | 'companyIndustriesInclude'
  | 'companyRecordId'
  | 'companySizes'
  | 'companyTableId'
  | 'connectionCount'
  | 'maxConnectionCount'
  | 'currentRoleMaxMonthsSinceStartDate'
  | 'currentRoleMinMonthsSinceStartDate'
  | 'excludePeopleIdentifiersMixed'
  | 'experienceCount'
  | 'maxExperienceCount'
  | 'followerCount'
  | 'maxFollowerCount'
  | 'headlineKeywords'
  | 'includePastExperiences'
  | 'jobDescriptionKeywords'
  | 'jobFunctions'
  | 'jobTitleExactKeywordMatch'
  | 'jobTitleExcludeKeywords'
  | 'jobTitleKeywords'
  | 'jobTitleSeniorityLevels'
  | 'languages'
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
  | 'profileKeywords'
  | 'schoolNames'
  | 'searchRawLocation'
  // | 'startFromMethod'
  | 'resultCount'
  | 'limit'
  | 'limitPerCompany';

type FindPeopleStoreState = {
  filters: Record<
    FilterKeysType,
    Option[] | boolean | string | number | undefined
  >;
};

type FindPeopleStoreActions = {
  setFilters: (filters: Record<FilterKeysType, any>) => void;
};

type FindPeopleStoreProps = FindPeopleStoreState & FindPeopleStoreActions;

export const useFindPeopleStore = create<FindPeopleStoreProps>()((set) => ({
  filters: {
    aboutKeywords: [],
    companyDescriptionKeywordsExclude: [],
    companyDescriptionKeywords: [],
    companyIdentifier: [],
    companyIndustriesExclude: [],
    companyIndustriesInclude: [],
    companyRecordId: [],
    companySizes: [],
    companyTableId: '',
    connectionCount: void 0,
    maxConnectionCount: void 0,
    currentRoleMaxMonthsSinceStartDate: void 0,
    currentRoleMinMonthsSinceStartDate: void 0,
    excludePeopleIdentifiersMixed: [],
    experienceCount: void 0,
    maxExperienceCount: void 0,
    followerCount: void 0,
    maxFollowerCount: void 0,
    headlineKeywords: [],
    includePastExperiences: false,
    jobDescriptionKeywords: [],
    jobFunctions: [],
    jobTitleExactKeywordMatch: false,
    jobTitleExcludeKeywords: [],
    jobTitleKeywords: [],
    jobTitleSeniorityLevels: [],
    languages: [],
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
    profileKeywords: [],
    schoolNames: [],
    searchRawLocation: false,
    // startFromMethod: 'CsvOfCompanies',
    resultCount: true,
    limit: void 0,
    limitPerCompany: void 0,
  },
  setFilters: (filters) => set({ filters }),
}));
