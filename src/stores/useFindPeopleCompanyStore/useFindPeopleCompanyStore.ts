import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { SDRToast } from '@/components/atoms';

import { _fetchFiltersByType, _fetchSearchType } from '@/request';

import {
  FilterElementInputTypeEnum,
  FilterElementTypeEnum,
  FilterItem,
  FindType,
  HttpError,
  SourceFromOpt,
} from '@/types';

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
  setSourceFromOpts: (opts: SourceFromOpt[]) => void;
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
  if (type === FilterElementTypeEnum.switch) {
    return false;
  }
  return '';
};

// 用递归提取所有 formKey
const extractFormKeys = (obj: Record<string, FilterItem[]>) => {
  const result: Record<string, any> = {};

  function traverse(value: any) {
    if (Array.isArray(value)) {
      value.forEach(traverse);
    } else if (value && typeof value === 'object') {
      if ((value as FilterItem).formKey) {
        result[(value as FilterItem).formKey] = queryConditionDefault(
          (value as FilterItem).formType,
          (value as FilterItem).inputType,
        );
      }
      // 如果有 groups，也要递归处理
      if ((value as FilterItem).groups) {
        traverse((value as FilterItem).groups);
      }
      // 遍历对象的所有字段
      Object.values(value).forEach(traverse);
    }
  }

  traverse(obj);

  // Initialize special fields for COMPANIES and EXCLUDE_PEOPLE filter types
  if (result) {
    // Check if there's a COMPANIES or EXCLUDE_PEOPLE filter type
    Object.values(obj).forEach((items) => {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (item.formType === FilterElementTypeEnum.include_table) {
            result.tableInclude = {
              tableId: '',
              tableFieldId: '',
              tableViewId: '',
              keywords: [],
            };
          }
          if (item.formType === FilterElementTypeEnum.exclude_table) {
            result.tableExclude = {
              tableId: '',
              tableFieldId: '',
              tableViewId: '',
              keywords: [],
            };
          }
        });
      }
    });
  }

  return result;
};

export const useFindPeopleCompanyStore = create<FindPeopleCompanyStoreProps>()(
  devtools(
    persist(
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
          // headers: [],
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
        setCheckedSource: (source: SourceFromOpt) =>
          set({ checkedSource: source }),
        setFilters: (filters: Record<string, FilterItem[]>) => set({ filters }),
        setQueryConditions: (conditions: Record<string, any>) =>
          set({ queryConditions: conditions }),
        setSourceFromOpts: (opts: SourceFromOpt[]) =>
          set({ sourceFromOpts: opts }),
        fetchFiltersByType: async () => {
          try {
            set({ fetchFiltersByTypeLoading: true });
            const res = await _fetchFiltersByType(get().checkedSource.bizId);
            if (res?.data) {
              set({
                filters: res.data,
                queryConditions: extractFormKeys(res.data),
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
      {
        name: 'FIND_PEOPLE_COMPANY_SOURCE',
        partialize: (state) => ({
          findType: state.findType,
          checkedSource: state.checkedSource,
          sourceFromOpts: state.sourceFromOpts,
          filters: state.filters,
        }),
        onRehydrateStorage: () => {
          return (state) => {
            if (state) {
              state.setFindType(state.findType);
              state.setCheckedSource(state.checkedSource);
              state.setSourceFromOpts(state.sourceFromOpts);
              state.setFilters(state.filters);
              state.setQueryConditions(extractFormKeys(state.filters));
            }
          };
        },
      },
    ),
  ),
);
