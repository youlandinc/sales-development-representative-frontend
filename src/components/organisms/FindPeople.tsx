import { Stack } from '@mui/material';
import { useEffect, useMemo } from 'react';

import {
  FindPeopleFilterPanel,
  FindPeopleGrid,
  FindPeopleHeader,
} from '@/components/molecules';

import { useFindPeopleStore } from '@/stores/useFindPeopleStore';
import { useAsyncFn, useDebounce } from '@/hooks';

import { _fetchFindPeople } from '@/request';
import { GridColDef } from '@mui/x-data-grid';

export const FindPeople = () => {
  const { filters } = useFindPeopleStore((state) => state);
  const params = useDebounce(filters, 400);

  const [state, fetchFindPeople] = useAsyncFn(
    async (param) => {
      return await _fetchFindPeople(param);
    },
    [JSON.stringify(params)],
  );

  useEffect(() => {
    fetchFindPeople(
      Object.entries(params).reduce(
        (pre, [key, value]) => {
          if (Array.isArray(value)) {
            pre[key] = value.map((item) =>
              typeof item === 'string' ? item : item.value,
            );
            return pre;
          }
          pre[key] = value;
          return pre;
        },
        {} as Record<string, any>,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), fetchFindPeople]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: '', width: 70, align: 'center', minWidth: 60 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 200 },
    {
      field: 'companyName',
      headerName: 'Company name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'jobTitle',
      headerName: 'Job title',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'linkedinUrl',
      headerName: 'Linkedin URL',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      minWidth: 200,
    },
  ];

  const memoGrid = useMemo(
    () => (
      <FindPeopleGrid
        columns={columns}
        count={state?.value?.data?.peopleCount || 0}
        isLoading={state.loading}
        limit={params?.limit}
        limitPerCompany={params?.limitPerCompany}
        list={state?.value?.data?.peopleList}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.loading,
      state?.value?.data?.peopleCount,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(state?.value?.data?.peopleList),
    ],
  );

  return (
    <Stack height={'100vh'}>
      <FindPeopleHeader />
      <Stack flex={1} flexDirection={'row'} minHeight={0}>
        <FindPeopleFilterPanel
          disabled={
            state.loading || state?.value?.data?.peopleList?.length === 0
          }
        />
        {memoGrid}
      </Stack>
    </Stack>
  );
};
