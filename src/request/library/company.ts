import { post } from '@/request/request';

export const _generateSellingInfo = () => {
  return post(
    '/sdr/ai/generate',
    {
      module: 'PRODUCT_INTRODUCTION',
      params: {
        companyName: 'Youland',
        companyPage: 'https://youland.com/',
      },
    },
    { responseType: 'text' },
  );
};
