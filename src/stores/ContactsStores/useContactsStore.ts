import { create } from 'zustand';
import {
  ContactsPageMode,
  ContactsTableTypeEnum,
  FilterProps,
  HttpError,
  SegmentOption,
} from '@/types';
import {
  _fetchSegmentDetailsBySegmentId,
  _fetchSegmentOptions,
  _updateSelectedSegment,
} from '@/request/contacts/segments';
import { SDRToast } from '@/components/atoms';

type DirectoryStoresStates = {
  pageMode: ContactsPageMode;
  segmentOptions: SegmentOption[];
  selectedSegmentId: number | string;
};

type DirectoryStoresActions = {
  setPageMode: (mode: ContactsPageMode) => void;
  setSelectedSegmentId: (value: number | string) => void;
  clearSegmentSelectState: () => void;
  fetchSegmentsOptions: (
    tableId: ContactsTableTypeEnum,
  ) => Promise<SegmentOption[]>;
  fetchSegmentDetails: (id: string | number) => Promise<{
    [key: string]: Array<FilterProps & any>;
  }>;
  updateSelectedSegment: (id: string | number) => Promise<void>;
};

export const useContactsStore = create<
  DirectoryStoresStates & DirectoryStoresActions
>()((set, get) => ({
  pageMode: ContactsPageMode.default,
  setPageMode: (mode) => set({ pageMode: mode }),

  selectedSegmentId: '',
  setSelectedSegmentId: (value) => set({ selectedSegmentId: value }),

  segmentOptions: [],
  clearSegmentSelectState: () => {
    const target = get().segmentOptions;
    target.forEach((item) => {
      item.isSelect = false;
    });
    set({ segmentOptions: target });
  },
  fetchSegmentsOptions: async (tableId: ContactsTableTypeEnum) => {
    try {
      const { data } = await _fetchSegmentOptions(tableId);
      const options = data.reduce((acc, cur) => {
        if (cur) {
          acc.push({
            label: cur.name,
            key: cur.id,
            value: cur.id,
            isSelect: cur.selected,
          });
        }
        return acc;
      }, [] as SegmentOption[]);
      set({ segmentOptions: options });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
    return get().segmentOptions;
  },
  fetchSegmentDetails: async (id) => {
    const groupBy = (input: any[], key: string) => {
      return input.reduce((acc, currentValue) => {
        const groupKey = currentValue[key];
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(currentValue);
        return acc;
      }, {});
    };

    const { data } = await _fetchSegmentDetailsBySegmentId(id);
    set({ selectedSegmentId: id });
    return groupBy(data, 'group');
  },
  updateSelectedSegment: async (id) => {
    if (get().selectedSegmentId != id) {
      set({ selectedSegmentId: id });
    }
    const postData = {
      segmentId: id,
    };
    try {
      await _updateSelectedSegment(postData);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
}));
