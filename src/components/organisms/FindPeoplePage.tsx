import { Stack } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { GridColDef } from '@mui/x-data-grid';

import {
  FindPeopleFilterPanel,
  FindPeopleGrid,
  FindPeopleHeader,
} from '@/components/molecules';

import { useAsyncFn, useDebounce } from '@/hooks';
import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';

import { _fetchFindPeopleCompanyGridHeader, _fetchGridDate } from '@/request';
import { handleParam } from '@/utils';
import { FindType } from '@/types';

export const FindPeoplePage = () => {
  const { checkedSource, queryConditions, findType } =
    useFindPeopleCompanyStore((state) => state);
  const params = useDebounce(queryConditions, 400);

  const [state, fetchFindPeople] = useAsyncFn(
    async (param) => {
      return await _fetchGridDate(param);
    },
    [JSON.stringify(params)],
  );

  const [stateGridHeader, fetchGridHeader] = useAsyncFn(
    async (bizId: string) => {
      return await _fetchFindPeopleCompanyGridHeader(bizId);
    },
    [],
  );

  useEffect(() => {
    fetchGridHeader(checkedSource.bizId);
  }, [checkedSource.bizId, fetchGridHeader]);

  useEffect(() => {
    fetchFindPeople({
      ...handleParam(params),
      searchType: checkedSource.bizId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), fetchFindPeople, checkedSource.bizId]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: '', width: 70, align: 'center', minWidth: 60 },
    ...(stateGridHeader?.value?.data || []).map((item) => ({
      field: item.columnKey,
      headerName: item.columnName,
      flex: 1,
      minWidth: 200,
    })),
  ];

  const memoGrid = useMemo(
    () => (
      <FindPeopleGrid
        columns={columns}
        count={state?.value?.data?.findCount || 0}
        isLoading={state.loading}
        limit={params?.limit}
        limitPerCompany={params?.limitPerCompany}
        list={state?.value?.data?.findList}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.loading,
      state?.value?.data?.findCount,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(state?.value?.data?.findList),
      stateGridHeader.loading,
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
          disabled={state.loading || state?.value?.data?.findList?.length === 0}
        />
        {memoGrid}
      </Stack>
    </Stack>
  );
};
