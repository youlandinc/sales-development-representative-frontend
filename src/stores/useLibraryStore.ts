import { create } from 'zustand';
import { _fetCampaignPendingEmails } from '@/request';
import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import { _fetchOffersInfo } from '@/request/library/offers';

export enum LibraryContainerTypeEnum {
  company = 'company',
  offers = 'offers',
}

export type ITag = {
  id: number;
  name: string;
  description: string;
};

export type IOfferListItem = {
  id: number;
  productName: string;
  productUrl: string;
  productDescription: string;
  painPoints: ITag[];
  solutions: ITag[];
  proofPoints: ITag[];
};

export type IOfferList = IOfferListItem[];

export type LibraryState = {
  companyName: string;
  companyPage: string;
  sellIntroduction: string;
  libraryContainerType: LibraryContainerTypeEnum;
  offerList: IOfferList;
  isAdd: boolean;
  editId: number;
};

export type LibraryStateStoreActions = {
  setLibraryContainerType: (type: LibraryContainerTypeEnum) => void;
  setOfferList: (offerList: IOfferList) => void;
  addOffer: (offerId: number) => void;
  setIsAdd: (isAdd: boolean) => void;
  setEditId: (id: number) => void;
  fetchOffersInfo: () => Promise<void>;
  deleteTag: (tagId: number) => void;
  deleteOffer: (offerId: number) => void;
  updateCompanyInfo: (
    key: 'companyName' | 'companyPage' | 'sellIntroduction',
    value: string,
  ) => void;
};

export type InboxStoreProps = LibraryState & LibraryStateStoreActions;

export const useLibraryStore = create<InboxStoreProps>()((set) => ({
  companyName: '',
  companyPage: '',
  sellIntroduction: '',
  libraryContainerType: LibraryContainerTypeEnum.company,
  isAdd: false,
  editId: Infinity,
  offerList: [],
  setLibraryContainerType: (libraryContainerType) =>
    set({ libraryContainerType }),
  setOfferList: (offerList) => set({ offerList }),
  addOffer: (offerId) =>
    set((state) => ({
      offerList: [
        {
          id: offerId,
          productName: '',
          productUrl: '',
          productDescription: '',
          painPoints: [],
          solutions: [],
          proofPoints: [],
        },
        ...state.offerList,
      ],
      isAdd: true,
      editId: offerId,
    })),
  setIsAdd: (isAdd) => set({ isAdd }),
  setEditId: (id) => set({ editId: id }),
  fetchOffersInfo: async () => {
    try {
      const { data } = await _fetchOffersInfo();
      set({ offerList: data });
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  },
  deleteTag: (tagId) =>
    set((state) => ({
      offerList: state.offerList.map((offer) => ({
        ...offer,
        painPoints: offer.painPoints.filter((tag) => tag.id !== tagId),
        solutions: offer.solutions.filter((tag) => tag.id !== tagId),
        proofPoints: offer.proofPoints.filter((tag) => tag.id !== tagId),
      })),
    })),
  deleteOffer: (offerId) =>
    set((state) => ({
      offerList: state.offerList.filter((offer) => offer.id !== offerId),
    })),
  updateCompanyInfo: (key, value) => set({ [key]: value }),
}));
