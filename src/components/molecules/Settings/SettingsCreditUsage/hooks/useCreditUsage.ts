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
  UsageTypeOptions,
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

  const handleSetQueryConditions = (
    newConditions: Omit<FetchCreditUsageListRequest, 'page' | 'size'>,
  ) => {
    setQueryConditions(newConditions);
    setPage(0);
  };

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
      return res;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    data,
    isLoading,
    setQueryConditions: handleSetQueryConditions,
    queryConditions,
    setPage,
    page,
    totalPages: data?.data?.page?.totalPages || 0,
    usageType: (usageType?.data || []).reduce((acc, item) => {
      if (Array.isArray(item?.children)) {
        acc.push({
          label: item.parentCategory,
          value: item.parentCategory,
          key: item.parentCategory,
          disabled: true,
        });
        item.children.forEach((child) => {
          acc.push({
            label: child.categoryName,
            value: child.category,
            key: child.category,
            planType: child.planType,
            planName: child.choosePlanName,
          });
        });
      }
      return acc;
    }, [] as UsageTypeOptions[]),
  };
};
