import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { combine } from 'zustand/middleware';

import { SDRToast } from '@/components/atoms';

import {
  ActionsTypeKeyEnum,
  EnrichmentItem,
  SuggestionItem,
} from '@/types/enrichment/drawerActions';
import { _fetchActionCategory, _fetchActionSuggestions } from '@/request';
import { useWorkEmailStore } from './useWorkEmailStore';

interface ActionsStoreActions {
  fetchSuggestions: (tableId: string) => Promise<void>;
  fetchEnrichments: () => Promise<void>;
}

interface ActionsStoreStates {
  suggestionsLoading: boolean;
  suggestionsList: SuggestionItem[];
  enrichmentsLoading: boolean;
  enrichmentsList: EnrichmentItem[];
}

const initialState: ActionsStoreStates = {
  suggestionsLoading: false,
  suggestionsList: [],
  enrichmentsLoading: false,
  enrichmentsList: [],
};

export const useActionsStore = create<
  ActionsStoreStates & ActionsStoreActions
>()(
  immer(
    combine(initialState, (set) => ({
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
          const filteredData = (res.data || []).filter(
            (item) => item.key !== ActionsTypeKeyEnum.ai_template,
          );
          useWorkEmailStore.getState().setIntegrationMenus(filteredData);
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
        } catch (err) {
          const { message, header, variant } = err as HttpError;
          SDRToast({ message, header, variant });
          set((state) => {
            state.enrichmentsLoading = false;
          });
        }
      },
    })),
  ),
);
