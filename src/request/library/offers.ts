import { post } from '@/request/request';

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
