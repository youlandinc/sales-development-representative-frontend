import { create } from 'zustand';
import {
  DirectoriesBizIdEnum,
  DirectoriesQueryItem,
} from '@/types/Directories';
import { _fetchDirectoriesConfig } from '@/request/directories';
import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import { convertToConfigMap } from '@/components/molecules/DirectoriesIndustry/DirectoriesIndustryQuery/data';

interface DirectoriesStoreState {
  bizId: DirectoriesBizIdEnum | '';
  institutionType: string;
  configMap: Record<string, DirectoriesQueryItem[]>;
  buttonGroupConfig: DirectoriesQueryItem | null;
  queryConfig: DirectoriesQueryItem[];
  formValues: Record<string, any>;
  results: any[];
  resultCount: number;
  loadingConfig: boolean;
  loadingResults: boolean;
}

interface DirectoriesStoreActions {
  fetchDefaultViaBiz: (bizId: DirectoriesBizIdEnum) => Promise<boolean>;
  fetchResults: () => Promise<void>;
  updateInstitutionType: (value: string) => void;
  updateFormValues: (key: string, value: any, groupPath?: string) => void;
  reset: () => void;
}

type DirectoriesStoreProps = DirectoriesStoreState & DirectoriesStoreActions;

const INITIAL_STATE: DirectoriesStoreState = {
  bizId: '',
  institutionType: '',
  configMap: {},
  buttonGroupConfig: null,
  queryConfig: [],
  formValues: {},
  results: [],
  resultCount: 0,
  loadingConfig: false,
  loadingResults: false,
};

export const useDirectoriesStore = create<DirectoriesStoreProps>()(
  (set, get) => ({
    ...INITIAL_STATE,

    fetchDefaultViaBiz: async (bizId: DirectoriesBizIdEnum) => {
      if (!bizId) {
        return false;
      }

      set({ loadingConfig: true, bizId });

      try {
        const response = await _fetchDirectoriesConfig({ bizId });

        const apiData = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const { configMap, buttonGroupConfig, firstInstitutionType } =
          convertToConfigMap(apiData);

        const queryConfig = configMap[firstInstitutionType] || [];

        set({
          configMap,
          buttonGroupConfig,
          queryConfig,
          institutionType: firstInstitutionType,
          formValues: { entityType: 'FIRM' },
          loadingConfig: false,
        });

        return true;
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        set({ loadingConfig: false });
        return false;
      }
    },

    fetchResults: async () => {
      const { bizId, institutionType, formValues } = get();

      if (!bizId || !institutionType) {
        return;
      }

      set({ loadingResults: true });

      try {
        set({ loadingResults: false });
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        set({ loadingResults: false });
      }
    },

    updateInstitutionType: (value: string) => {
      const {
        institutionType: currentInstitutionType,
        configMap,
        formValues,
      } = get();

      if (currentInstitutionType === value || !value) {
        return;
      }

      const queryConfig = configMap[value] || [];

      set({
        institutionType: value,
        queryConfig,
        formValues: { ...formValues, entityType: 'FIRM' },
      });
    },

    updateFormValues: (key: string, value: any, groupPath?: string) => {
      const { formValues } = get();

      let updatedFormValues: Record<string, any>;

      if (key === 'entityType') {
        updatedFormValues = {
          ...formValues,
          [key]: value,
        };
      } else if (groupPath && formValues[groupPath]) {
        updatedFormValues = {
          ...formValues,
          [groupPath]: {
            ...formValues[groupPath],
            [key]: value,
          },
        };
      } else {
        updatedFormValues = {
          ...formValues,
          [key]: value,
        };
      }

      set({ formValues: updatedFormValues });
    },

    reset: () => {
      set(INITIAL_STATE);
    },
  }),
);
