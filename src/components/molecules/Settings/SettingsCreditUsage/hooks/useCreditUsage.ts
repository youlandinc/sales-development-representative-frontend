import { useState } from 'react';
import useSWR from 'swr';

import { _fetchCreditUsageList } from '@/request/settings/creditUsage';

import { FetchCreditUsageListRequest } from '@/types/Settings/creditUsage';
import { PlanTypeEnum } from '@/types';

export const useCreditUsage = () => {
  const [queryConditions, setQueryConditions] = useState<
    Omit<FetchCreditUsageListRequest, 'page' | 'size'>
  >({
    startTime: undefined,
    endTime: undefined,
    dateType: 'THIS_MONTH',
    category: 'BUSINESS_CORPORATE' as PlanTypeEnum,
  });

  const [page, setPage] = useState(0);

  const { data, isLoading } = useSWR(
    { ...queryConditions, page, size: 10 },
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
  );

  return {
    data,
    isLoading,
    setQueryConditions,
    queryConditions,
    setPage,
    page,
    totalPages: data?.data?.page?.totalPages || 0,
  };
};
