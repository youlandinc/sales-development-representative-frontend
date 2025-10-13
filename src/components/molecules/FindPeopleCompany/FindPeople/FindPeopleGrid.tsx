import { FC, useMemo } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Skeleton, Stack, Tooltip, Typography } from '@mui/material';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type FindPeopleGridProps = {
  list?: Record<string, any>[];
  isLoading?: boolean;
  count?: number;
  limit?: number;
  limitPerCompany?: number;
  columns: GridColDef[];
  title?: string;
};

export const FindPeopleGrid: FC<FindPeopleGridProps> = ({
  list,
  isLoading,
  count,
  limit,
  limitPerCompany,
  columns,
  title,
}) => {
  return (
    <Stack flex={1} gap={1.5} minWidth={0} pb={6} pr={3} pt={3}>
      {/*header*/}
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Typography fontWeight={600} lineHeight={1.2} pl={3}>
          {title || 'Preview leads'}
        </Typography>
        <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
          {limitPerCompany ? (
            <Typography
              alignItems={'center'}
              color={'text.secondary'}
              flexDirection={'row'}
              lineHeight={1.2}
              variant={'body2'}
            >
              Previewing {list?.length || 0} people
            </Typography>
          ) : (
            <Typography
              alignItems={'center'}
              color={'text.secondary'}
              flexDirection={'row'}
              lineHeight={1.2}
              variant={'body2'}
            >
              Previewing <strong>{list?.length || 0}</strong> of{' '}
              <strong>{(count || 0).toLocaleString()}</strong> results.{' '}
              <strong>
                {(count || 0) < (limit || 1000)
                  ? count?.toLocaleString()
                  : (limit || 1000).toLocaleString()}
              </strong>{' '}
              will be imported.
            </Typography>
          )}
          <Tooltip
            placement={'top'}
            title={
              limitPerCompany
                ? `A max of ${limitPerCompany} per company will be imported`
                : 'You can adjust your setting under "Limit Results"'
            }
          >
            <ErrorOutlineIcon sx={{ fontSize: 16 }} />
          </Tooltip>
        </Stack>
      </Stack>
      {/*grid*/}
      {list?.length === 0 ? (
        <Typography margin={'auto'} textAlign={'center'} variant={'body2'}>
          No results found. Try simplifying your search or using fewer filters.
        </Typography>
      ) : (
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
            {isLoading
              ? Array.from({ length: 10 }, (_, j) => (
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
                ))
              : list?.map((row, i) => (
                  <Stack flexDirection={'row'} key={i} width={'100%'}>
                    {columns.map((col, j) => {
                      return (
                        <Typography
                          borderBottom={'1px solid #D0CEDA'}
                          borderRight={'1px solid #D0CEDA'}
                          color={
                            col.field === 'id'
                              ? 'text.secondary'
                              : 'text.primary'
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
      )}
    </Stack>
  );
};
