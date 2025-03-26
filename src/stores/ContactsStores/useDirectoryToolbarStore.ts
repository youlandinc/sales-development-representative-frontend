import { create } from 'zustand';
import { FilterOperationEnum, FilterProps } from '@/types';

export enum ToolBarTypeEnum {
  new_filter = 'new_filter',
  edit_segment = 'edit_segment',
  new_segment = 'new_segment',
}

export type useContactsToolbarStoreStates = {
  newGridData: Record<string, any>;
  segmentsFilters: {
    [key: string | number]: FilterProps[];
  };
  originalSegmentsFilters: {
    [key: string | number]: FilterProps[];
  };
  fromOther: boolean;
  toolBarType: ToolBarTypeEnum;
};

export type useContactsToolbarStoreActions = {
  setFromOther: (value: boolean) => void;
  setNewGridData: (newGridData: Record<string, any>) => void;
  addSegmentsFiltersGroup: () => void;
  createSegmentsFiltersGroup: () => void;
  clearSegmentsFiltersGroup: () => void;
  addSegmentsFilters: (index: number, data: FilterProps) => void;
  deleteSegmentsFilters: (
    index: number,
    filterIndex: number,
  ) => {
    [key: string | number]: FilterProps[];
  };
  onChangeSegmentsFilters: (
    index: number,
    filterIndex: number,
    key: string,
    value: string | number | FilterOperationEnum,
  ) => void;
  setSegmentsFilters: (value: {
    [key: string]: Array<FilterProps & any>;
  }) => void;
  setOriginalSegmentsFilters: (value: {
    [key: string]: Array<FilterProps & any>;
  }) => void;
  resetToolbarData: () => void;
  computedCanSaved: () => boolean;
  setToolBarType: (type: ToolBarTypeEnum) => void;
};

export const useContactsToolbarStore = create<
  useContactsToolbarStoreStates & useContactsToolbarStoreActions
>((set, get) => ({
  fromOther: false,
  setFromOther: (value) => set({ fromOther: value }),

  newGridData: {},
  setNewGridData: (newGridData) => set({ newGridData }),

  segmentsFilters: {},
  originalSegmentsFilters: {},
  toolBarType: ToolBarTypeEnum.new_filter,

  setSegmentsFilters: (value) => {
    set({ segmentsFilters: value });
  },
  setOriginalSegmentsFilters: (value) => {
    set({ originalSegmentsFilters: value, segmentsFilters: value });
  },
  createSegmentsFiltersGroup: () => {
    set({
      segmentsFilters: {
        0: [
          {
            filterId: '',
            columnName: '',
            operation: '',
            operationText: '',
          },
        ],
      },
    });
  },
  addSegmentsFiltersGroup: () => {
    const index = Object.keys(get().segmentsFilters!).length;
    set({
      segmentsFilters: {
        ...get().segmentsFilters,
        [index]: [
          {
            filterId: '',
            columnName: '',
            operation: '',
            operationText: '',
          },
        ],
      },
    });
  },
  clearSegmentsFiltersGroup: () => {
    set({ segmentsFilters: {}, originalSegmentsFilters: {} });
  },
  addSegmentsFilters: (index, data) => {
    set({
      segmentsFilters: {
        ...get().segmentsFilters,
        [index]: [...get().segmentsFilters![index], data],
      },
    });
  },
  deleteSegmentsFilters: (index, filterIndex) => {
    const temp = {
      ...get().segmentsFilters,
      [index]: get().segmentsFilters![index].filter(
        (_, i) => i !== filterIndex,
      ),
    };

    if (temp[index].length === 0) {
      delete temp[index];
    }

    const result = Object.keys(temp).reduce(
      (acc, cur, i) => {
        acc[i] = temp[parseInt(cur)];
        return acc;
      },
      {} as { [key: string | number]: FilterProps[] },
    );

    set({
      segmentsFilters: result,
    });

    return result;
  },
  onChangeSegmentsFilters: (index, filterIndex, key, value) => {
    set({
      segmentsFilters: {
        ...get().segmentsFilters,
        [index]: get().segmentsFilters![index].map((item, i) =>
          i === filterIndex ? { ...item, [key]: value } : item,
        ),
      },
    });
  },

  resetToolbarData: () => {
    set({
      newGridData: {},
      segmentsFilters: {},
      originalSegmentsFilters: {},
    });
  },
  computedCanSaved: () => {
    if (Object.keys(get().segmentsFilters).length === 0) {
      return false;
    }

    const hasValidSegments = Object.values(get().segmentsFilters).every(
      (segment) =>
        segment.length > 0 &&
        segment.every(
          (item) => item.columnName && item.operation && item.operationText,
        ),
    );

    if (!hasValidSegments) {
      return false;
    }

    return get().originalSegmentsFilters !== get().segmentsFilters;
  },
  setToolBarType: (type) => {
    set({ toolBarType: type });
  },
}));
