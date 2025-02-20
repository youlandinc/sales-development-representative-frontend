import { del, get, post, put } from '@/request/request';
import { IOfferList, IOfferListItem, ITag } from '@/stores/useLibraryStore';
import { LibraryTypeOfferTagTypeEnum } from '@/types/enum';

export const _generateOffersInfo = (params: {
  productName: string;
  productPage: string;
}) => {
  return post<{
    painPoint: string;
    valueProposition: string;
    proofPoint: string;
  }>('/sdr/ai/normal/generate', {
    module: 'PRODUCT_PAIN_POINT',
    params,
  });
};

export type SaveOffersInfoParam = {
  id?: number;
  companyName: string;
  companyPage: string;
  propositionProfiles: {
    painPoint: string;
    valueProposition: string;
    proofPoint: string;
  }[];
};

export const _saveOffersInfo = (params: SaveOffersInfoParam) => {
  return post('/sdr/library/offer/save', params);
};

export const _fetchOffersInfo = () => {
  return get<IOfferList>('/sdr/library/offer/list');
};

export const _fetchCompanyInfo = () => {
  return get<{
    companyName: string;
    companyPage: string;
    sellIntroduction: string;
    painPoints: ITag[];
    solutions: ITag[];
    proofPoints: ITag[];
  }>('/sdr/library/info');
};

export const _saveCompanyInfo = (params: {
  companyName: string;
  companyPage: string;
  sellIntroduction: string;
}) => {
  return post('/sdr/library/save', params);
};

export const _addTag = (
  param: {
    offerId: number;
    type: LibraryTypeOfferTagTypeEnum;
  } & Omit<ITag, 'id'>,
) => {
  return post<{ id: number }>('/sdr/library/tag', param);
};

export const _editTag = (param: ITag) => {
  return put('/sdr/library/tag', param);
};

export const _deleteTag = (tagId: number) => {
  return del(`/sdr/library/tag/${tagId}`);
};

export const _createOffer = () => {
  return post<number>('/sdr/library/offer', {});
};

export const _editOffer = (
  param: Pick<
    IOfferListItem,
    'productName' | 'productUrl' | 'id' | 'productDescription'
  >,
) => {
  return post('/sdr/library/offer/save', param);
};

export const _deleteOffer = (offerId: number) => {
  return del(`/sdr/library/offer/${offerId}`);
};
