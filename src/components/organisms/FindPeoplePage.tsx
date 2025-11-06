import { useEffect, useMemo } from 'react';
import { Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import useSWR from 'swr';

import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';

import { useDebounce } from '@/hooks';
import { handleParam } from '@/utils';

import {
  FindPeopleFilterPanel,
  FindPeopleGrid,
  FindPeopleHeader,
} from '@/components/molecules';

import { _fetchFindPeopleCompanyGridHeader, _fetchGridDate } from '@/request';
import { FindType } from '@/types';

export const FindPeoplePage = () => {
  const {
    checkedSource,
    queryConditions,
    findType,
    fetchFiltersByTypeLoading,
    setGridDataLoading,
  } = useFindPeopleCompanyStore((state) => state);

  const params = useDebounce(queryConditions, 400);

  // Step 1: Fetch grid header (depends on bizId)
  const gridHeaderKey = useMemo(
    () => (checkedSource.bizId ? ['gridHeader', checkedSource.bizId] : null),
    [checkedSource.bizId],
  );

  const { data: gridHeaderData, isLoading: gridHeaderLoading } = useSWR(
    gridHeaderKey,
    () => _fetchFindPeopleCompanyGridHeader(checkedSource.bizId),
  );

  // Step 2: Fetch grid data (depends on params, bizId, and gridHeader loaded)
  const hasValidParams = useMemo(
    () => Object.keys(params).length > 0,
    [params],
  );

  const gridDataKey = useMemo(
    () =>
      hasValidParams &&
      !fetchFiltersByTypeLoading &&
      checkedSource.bizId &&
      !gridHeaderLoading
        ? ['gridData', checkedSource.bizId, JSON.stringify(params)]
        : null,
    [
      hasValidParams,
      fetchFiltersByTypeLoading,
      checkedSource.bizId,
      gridHeaderLoading,
      params,
    ],
  );

  const {
    data: gridData,
    isLoading: gridDataLoading,
    isValidating,
  } = useSWR(gridDataKey, () =>
    _fetchGridDate({
      ...handleParam(params),
      searchType: checkedSource.bizId,
    }),
  );

  // Sync gridDataLoading to store (use isValidating for refetch loading state)
  useEffect(() => {
    setGridDataLoading(gridDataLoading || isValidating);
  }, [gridDataLoading, isValidating, setGridDataLoading]);

  const columns: GridColDef[] = useMemo(
    () =>
      Array.isArray(gridHeaderData?.data)
        ? [
            {
              field: 'id',
              headerName: '',
              width: 70,
              align: 'center',
              minWidth: 60,
            },
            ...(gridHeaderData.data || []).map((item) => ({
              field: item.columnKey,
              headerName: item.columnName,
              flex: 1,
              minWidth: 200,
            })),
          ]
        : [],
    [gridHeaderData],
  );

  const memoGrid = useMemo(
    () => (
      <FindPeopleGrid
        columns={columns}
        count={gridData?.data?.findCount || 0}
        isLoading={gridDataLoading || gridHeaderLoading || isValidating}
        limit={params?.limit}
        limitPerCompany={params?.limitPerCompany}
        list={gridData?.data?.findList}
      />
    ),
    [
      columns,
      gridData,
      gridDataLoading,
      gridHeaderLoading,
      isValidating,
      params,
    ],
  );

  return (
    <Stack height={'100vh'}>
      <FindPeopleHeader
        title={
          findType === FindType.find_people ? 'Find people' : 'Find companies'
        }
      />
      <Stack flex={1} flexDirection={'row'} minHeight={0}>
        <FindPeopleFilterPanel
          disabled={gridDataLoading || gridData?.data?.findList?.length === 0}
        />
        {memoGrid}
      </Stack>
    </Stack>
  );
};
