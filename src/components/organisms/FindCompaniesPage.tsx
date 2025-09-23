import { useEffect, useMemo } from 'react';
import { Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import {
  FindCompaniesFilterPanel,
  FindPeopleGrid,
  FindPeopleHeader,
} from '@/components/molecules';

import { useAsyncFn, useDebounce } from '@/hooks';
import { _findCompanies } from '@/request';
import { useFindCompaniesStore } from '@/stores/useFindCompiesStore';
import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';

export const FindCompaniesPage = () => {
  const { filters } = useFindCompaniesStore((state) => state);
  const params = useDebounce(filters, 400);

  const [state, fetchFindCompanies] = useAsyncFn(
    async (param) => {
      try {
        return await _findCompanies(param);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    [JSON.stringify(params)],
  );

  useEffect(() => {
    fetchFindCompanies(
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
  }, [JSON.stringify(params), fetchFindCompanies]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: '', width: 70, align: 'center', minWidth: 60 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'primaryIndustry',
      headerName: 'Primary Industry',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'size',
      headerName: 'Size',
      flex: 1,
      minWidth: 200,
    },
    // {
    //   field: 'type',
    //   headerName: 'Type',
    //   flex: 1,
    //   minWidth: 200,
    // },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'linkedUrl',
      headerName: 'LinkedIn URL',
      flex: 1,
      minWidth: 200,
    },
  ];

  const memoGrid = useMemo(
    () => (
      <FindPeopleGrid
        columns={columns}
        count={state?.value?.data?.companyCount || 0}
        isLoading={state.loading}
        limit={params?.limit}
        limitPerCompany={params?.limitPerCompany}
        list={state?.value?.data?.companyList}
        title={'Preview'}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.loading,
      state?.value?.data?.companyCount,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(state?.value?.data?.companyList),
    ],
  );

  return (
    <Stack height={'100vh'}>
      <FindPeopleHeader title={'Find companies'} />
      <Stack flex={1} flexDirection={'row'} minHeight={0}>
        <FindCompaniesFilterPanel
          disabled={
            state.loading || state?.value?.data?.companyList?.length === 0
          }
        />
        {memoGrid}
      </Stack>
    </Stack>
  );
};
