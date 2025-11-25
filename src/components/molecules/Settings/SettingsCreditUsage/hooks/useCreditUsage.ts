import { useState } from 'react';
import useSWR from 'swr';

import { SDRToast } from '@/components/atoms';

import {
  _fetchCreditUsageList,
  _fetchUsageType,
} from '@/request/settings/creditUsage';

import {
  DateRangeEnum,
  FetchCreditUsageListRequest,
} from '@/types/Settings/creditUsage';

export const useCreditUsage = () => {
  const [queryConditions, setQueryConditions] = useState<
    Omit<FetchCreditUsageListRequest, 'page' | 'size'>
  >({
    startTime: undefined,
    endTime: undefined,
    dateType: DateRangeEnum.this_month,
    category: undefined,
  });

  const [page, setPage] = useState(0);

  const { data: usageType } = useSWR(
    'usage-type',
    async () => {
      try {
        const res = await _fetchUsageType();
        setQueryConditions({
          ...queryConditions,
          category: res.data[0].children[0].category,
        });
        return res;
      } catch (error) {
        const { message, header, variant } = error as HttpError;
        SDRToast({
          message,
          header,
          variant,
        });
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const { data, isLoading } = useSWR(
    queryConditions.category ? { ...queryConditions, page, size: 10 } : null,
    async (param) => {
      const res = await _fetchCreditUsageList(param);
      return {
        ...res,
        data: {
          ...res.data,
          content: [
            {
              id: 0,
              creditsUsed: 0,
              remainingCredits: 0,
              tableName: 'string',
              directory: 'string',
              searchTime: '2025-11-20T07:58:22.187Z',
              providers: [
                {
                  companyName: 'Wiza',
                  companyUrl: 'https://via.placeholder.com/18',
                  creditsUsed: 0,
                },
                {
                  companyName: 'Forager',
                  companyUrl: 'https://via.placeholder.com/18',
                  creditsUsed: 0,
                },
                {
                  companyName: 'Forager',
                  companyUrl: 'https://via.placeholder.com/18',
                  creditsUsed: 0,
                },
              ],
              date: '2025-11-20T07:58:22.187Z',
              integrationName: 'string',
            },
            {
              id: 0,
              creditsUsed: 0,
              remainingCredits: 0,
              tableName: 'string',
              directory: 'string',
              searchTime: '2025-11-20T07:58:22.187Z',
              providers: [
                {
                  companyName: 'Wiza',
                  companyUrl: 'https://via.placeholder.com/18',
                  creditsUsed: 0,
                },
                {
                  companyName: 'Forager',
                  companyUrl: 'https://via.placeholder.com/18',
                  creditsUsed: 0,
                },
                {
                  companyName: 'Forager',
                  companyUrl: 'https://via.placeholder.com/18',
                  creditsUsed: 0,
                },
              ],
              date: '2025-11-20T07:58:22.187Z',
              integrationName: 'string',
            },
          ],
        },
      };
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    data,
    isLoading,
    setQueryConditions,
    queryConditions,
    setPage,
    page,
    totalPages: data?.data?.page?.totalPages || 0,
    usageType: (usageType?.data || []).reduce((acc, item) => {
      if (item.children) {
        acc.push({
          label: item.parentCategory,
          value: item.parentCategory,
          key: item.parentCategory,
          disabled: true,
        });
        item.children.forEach((child) => {
          acc.push({
            label: child.category,
            value: child.category,
            key: child.category,
          });
        });
      }
      return acc;
    }, [] as TOption[]),
  };
};
