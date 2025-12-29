import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { combine } from 'zustand/middleware';

import { SDRToast } from '@/components/atoms';

import {
  ActionsTypeKeyEnum,
  DialogAllEnrichmentsResponse,
  EnrichmentCategoryEnum,
  EnrichmentItem,
  SourceOfOpenEnum,
  SuggestionItem,
} from '@/types/enrichment/drawerActions';
import {
  _fetchActionCategory,
  _fetchActionSuggestions,
  _fetchAllEnrichmentsData,
} from '@/request';
import { useWorkEmailStore } from './useWorkEmailStore';

interface ActionsStoreStates {
  suggestionsLoading: boolean;
  suggestionsList: SuggestionItem[];
  enrichmentsLoading: boolean;
  enrichmentsList: EnrichmentItem[];
  dialogAllEnrichmentsVisible: boolean;
  dialogAllEnrichmentsData: DialogAllEnrichmentsResponse[];
  dialogAllEnrichmentsTabKey: EnrichmentCategoryEnum;
  sourceOfOpen: SourceOfOpenEnum;
}

const initialState: ActionsStoreStates = {
  dialogAllEnrichmentsVisible: false,
  suggestionsLoading: false,
  suggestionsList: [],
  enrichmentsLoading: false,
  enrichmentsList: [],
  dialogAllEnrichmentsData: [],
  dialogAllEnrichmentsTabKey: EnrichmentCategoryEnum.actions,
  sourceOfOpen: SourceOfOpenEnum.drawer,
};

interface ActionsStoreActions {
  fetchSuggestions: (tableId: string) => Promise<void>;
  fetchEnrichments: () => Promise<void>;
  fetchActionsMenus: (tableId: string) => void;
  setDialogAllEnrichmentsVisible: (visible: boolean) => void;
  fetchDialogAllEnrichments: () => Promise<void>;
  setDialogAllEnrichmentsTabKey: (key: EnrichmentCategoryEnum) => void;
  setSourceOfOpen: (source: SourceOfOpenEnum) => void;
}

type ActionsStore = ActionsStoreStates & ActionsStoreActions;

export const useActionsStore = create<ActionsStore>()(
  immer(
    combine(initialState, (set, _get) => {
      const get = _get as () => ActionsStore;
      return {
        setDialogAllEnrichmentsTabKey: (key: EnrichmentCategoryEnum) => {
          set((state) => {
            state.dialogAllEnrichmentsTabKey = key;
          });
        },

        fetchSuggestions: async (tableId: string) => {
          set((state) => {
            state.suggestionsLoading = true;
          });
          try {
            const res = await _fetchActionSuggestions(tableId);
            set((state) => {
              state.suggestionsLoading = false;
              state.suggestionsList = res.data || [];
            });
          } catch (err) {
            const { message, header, variant } = err as HttpError;
            SDRToast({ message, header, variant });
            set((state) => {
              state.suggestionsLoading = false;
            });
          }
        },
        fetchEnrichments: async () => {
          set((state) => {
            state.enrichmentsLoading = true;
          });
          try {
            const res = await _fetchActionCategory();
            set((state) => {
              state.enrichmentsLoading = false;
              state.enrichmentsList = res.data || [];
            });
            const filteredData =
              (res.data || []).find(
                (item) =>
                  item.categoryKey === ActionsTypeKeyEnum.contact_information,
              )?.actions || [];
            useWorkEmailStore
              .getState()
              .setIntegrationMenus(filteredData || []);
          } catch (err) {
            const { message, header, variant } = err as HttpError;
            SDRToast({ message, header, variant });
            set((state) => {
              state.enrichmentsLoading = false;
            });
          }
        },
        fetchActionsMenus: (tableId: string) => {
          get().fetchEnrichments();
          get().fetchSuggestions(tableId);
        },
        fetchDialogAllEnrichments: async () => {
          try {
            const res = await _fetchAllEnrichmentsData();
            set((state) => {
              state.dialogAllEnrichmentsData = res.data || [];
            });
          } catch (err) {
            const { message, header, variant } = err as HttpError;
            SDRToast({ message, header, variant });
          }
        },
        setDialogAllEnrichmentsVisible: (visible: boolean) => {
          set((state) => {
            state.dialogAllEnrichmentsVisible = visible;
          });
        },

        setSourceOfOpen: (source: SourceOfOpenEnum) => {
          set((state) => {
            state.sourceOfOpen = source;
          });
        },
      };
    }),
  ),
);
