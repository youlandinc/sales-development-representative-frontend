import { GridColDef } from '@mui/x-data-grid';
import { Skeleton, Stack, Typography } from '@mui/material';
import useSWR from 'swr';

import { _fetchFindPeople } from '@/request';

import { useFindPeopleStore } from '@/stores/useFindPeopleStore';
import { useDebounce } from '@/hooks';

export const FindPeopleGrid = () => {
  const { filters } = useFindPeopleStore((state) => state);
  const params = useDebounce(filters, 400);
  const columns: GridColDef[] = [
    { field: 'id', headerName: '', width: 70, align: 'center', minWidth: 40 },
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

  const { data, isLoading } = useSWR(
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
    _fetchFindPeople,
    {
      revalidateOnFocus: false,
    },
  );

  return (
    <Stack flex={1} gap={1.5} minWidth={0} pb={6} px={3} py={3}>
      {/*header*/}
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Typography fontWeight={600} lineHeight={1.2}>
          Preview leads
        </Typography>
        <Typography color={'text.secondary'} lineHeight={1.2} variant={'body2'}>
          Previewing <strong>50</strong> of{' '}
          <strong>{data?.data?.peopleCount || 0}</strong> leads
        </Typography>
      </Stack>
      {/*grid*/}
      <Stack overflow={'auto'} width={'100%'}>
        {/*header*/}
        <Stack flexDirection={'row'} width={'100%'}>
          {columns.map((col, i) => (
            <Typography
              borderBottom={'1px solid #D0CEDA'}
              borderRight={'1px solid #D0CEDA'}
              borderTop={'1px solid #D0CEDA'}
              flex={col.flex}
              key={i}
              lineHeight={1.2}
              minWidth={col.minWidth}
              p={1.5}
              variant={'subtitle2'}
              width={col.width}
            >
              {col.headerName}
            </Typography>
          ))}
        </Stack>
        {/*content*/}
        <Stack width={'100%'}>
          {isLoading &&
            Array.from({ length: 10 }, (_, j) => (
              <Stack flexDirection={'row'} key={j} width={'100%'}>
                {columns.map((col, i) => (
                  <Typography
                    borderBottom={'1px solid #D0CEDA'}
                    borderRight={'1px solid #D0CEDA'}
                    color={'text.secondary'}
                    flex={col.flex}
                    fontSize={14}
                    key={i}
                    lineHeight={1.2}
                    minWidth={col.minWidth}
                    p={1.5}
                    textAlign={col.align || 'left'}
                    width={col.width}
                  >
                    {col.field === 'id' ? j + 1 : <Skeleton />}
                  </Typography>
                ))}
              </Stack>
            ))}
          {data?.data?.peopleList?.map((row, i) => (
            <Stack flexDirection={'row'} key={i} width={'100%'}>
              {columns.map((col, j) => {
                return (
                  <Typography
                    borderBottom={'1px solid #D0CEDA'}
                    borderRight={'1px solid #D0CEDA'}
                    color={
                      col.field === 'id' ? 'text.secondary' : 'text.primary'
                    }
                    flex={col.flex}
                    key={j}
                    lineHeight={1.2}
                    minWidth={col.minWidth}
                    p={1.5}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    textAlign={col.align || 'left'}
                    variant={'body2'}
                    width={col.width}
                  >
                    {col.field === 'id'
                      ? i + 1
                      : (row as Record<string, any>)[col.field]}
                  </Typography>
                );
              })}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
