import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { FC, useState } from 'react';

import { CreditUsageGrid } from './CreditUsageGrid';

import { StyledButton } from '@/components/atoms';
import { GridColDef } from '@mui/x-data-grid';
import { CreditUsageToolbar } from './CreditUsageToolbar';
import { useCreditUsage } from './hooks';

interface Provider {
  companyName: string;
  companyUrl: string;
  creditsUsed: number;
}

export const CreditUsage: FC = () => {
  // const debouncedConditions = useDebounce(conditions, 400);
  const {
    data,
    queryConditions,
    setQueryConditions,
    page,
    setPage,
    totalPages,
    usageType,
  } = useCreditUsage();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const renderProvider = (provider: Provider[], rowIndex: number) => {
    const isExpanded = expandedRows.has(rowIndex);
    const hasMultiple = provider.length > 1;

    return (
      <Stack
        alignItems="center"
        direction="row"
        onClick={(e) => {
          if (hasMultiple) {
            e.stopPropagation();
            toggleRow(rowIndex);
          }
        }}
        spacing={0.5}
        sx={{ cursor: hasMultiple ? 'pointer' : 'default' }}
      >
        {provider.slice(0, 3).map((p, idx) => (
          <Avatar
            key={idx}
            src={p?.companyUrl}
            sx={{
              width: 18,
              height: 18,
              border: '1px solid #F8F8FA',
              ml: idx > 0 ? '-4px !important' : 0,
            }}
          />
        ))}
        <Typography sx={{ fontSize: 12, color: '#363440', ml: 1 }}>
          {provider.length} {provider.length === 1 ? 'provider' : 'providers'}
        </Typography>
        {hasMultiple && (
          <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
            {isExpanded ? (
              <KeyboardArrowUp sx={{ fontSize: 16, color: '#6F6C7D' }} />
            ) : (
              <KeyboardArrowDown sx={{ fontSize: 16, color: '#6F6C7D' }} />
            )}
          </Box>
        )}
      </Stack>
    );
  };

  const renderDetail = (row: any, rowIndex: number) => {
    const providers = row.providers as Provider[];
    const isExpanded = expandedRows.has(rowIndex);

    if (!providers?.length || providers.length <= 1 || !isExpanded) {
      return null;
    }

    return (
      <Stack width={'100%'}>
        {providers.map((provider, index) => (
          <Stack
            alignItems={'center'}
            direction={'row'}
            key={index}
            py={1.5}
            sx={{
              '&:hover': {
                bgcolor: '#F8F8FA',
              },
            }}
            width={'100%'}
          >
            {columns.map((col, colIndex) => {
              // Render provider details in the Provider column
              if (col.field === 'providers') {
                return (
                  <Stack
                    alignItems={'center'}
                    direction={'row'}
                    flex={col.flex}
                    gap={1}
                    key={colIndex}
                    minWidth={col.minWidth}
                    px={3}
                    width={col.width}
                  >
                    <Avatar
                      src={provider.companyUrl}
                      sx={{ width: 18, height: 18 }}
                    />
                    <Typography color={'#363440'} sx={{ fontSize: 12 }}>
                      {provider.companyName}
                    </Typography>
                  </Stack>
                );
              }

              // Render credits used in the Date column (or any other column you prefer)
              if (col.field === 'creditsUsed') {
                return (
                  <Stack
                    direction={'row'}
                    flex={col.flex}
                    gap={1}
                    key={colIndex}
                    minWidth={col.minWidth}
                    px={3}
                    width={col.width}
                  >
                    <Typography color={'#6F6C7D'} sx={{ fontSize: 12 }}>
                      {provider.creditsUsed}
                    </Typography>
                  </Stack>
                );
              }

              // Empty space for other columns
              return (
                <Box
                  flex={col.flex}
                  key={colIndex}
                  minWidth={col.minWidth}
                  width={col.width}
                />
              );
            })}
          </Stack>
        ))}
      </Stack>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'remainingCredits',
      headerName: 'Remaining Credits',
      width: 200,
    },
    {
      field: 'tableName',
      headerName: 'Table Name',
      width: 150,
    },
    {
      field: 'directory',
      headerName: 'Directory',
      width: 150,
    },
    {
      field: 'searchTime',
      headerName: 'Search Time',
      width: 220,
      renderCell: ({ value }) => {
        if (!value) {
          return '-';
        }
        try {
          return format(new Date(value), 'MMMM d, yyyy h:mma');
        } catch (_) {
          return value;
        }
      },
    },
    {
      field: 'providers',
      headerName: 'Providers',
      flex: 1,
      renderCell: ({ value, row }) => {
        const rowIndex = data?.data?.content?.indexOf(row) ?? -1;
        return renderProvider(value, rowIndex);
      },
    },
    {
      field: 'creditsUsed',
      headerName: 'Credits Used',
      width: 150,
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 220,
      renderCell: ({ value }) => {
        if (!value) {
          return '-';
        }
        try {
          return format(new Date(value), 'h:mma MMM d, yyyy');
        } catch (e) {
          return value;
        }
      },
    },
    {
      field: 'integrationName',
      headerName: 'Integration Name',
      width: 150,
    },
  ];
  return (
    <Stack
      sx={{
        bgcolor: 'white',
        border: '1px solid #E5E5E5',
        borderRadius: 4,
        p: 3,
        gap: 3,
      }}
    >
      <CreditUsageToolbar
        onChange={setQueryConditions}
        usageTypeList={usageType}
        value={queryConditions}
      />
      <Stack gap={1.5}>
        <CreditUsageGrid
          columns={columns}
          expandedRows={expandedRows}
          list={data?.data?.content || []}
          renderDetail={renderDetail}
        />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ pt: 1.5 }}
        >
          <Typography sx={{ fontSize: 12, color: '#7D7D7D' }}>
            {data?.data?.content?.length} records
          </Typography>
          <Stack direction={'row'} gap={1.5}>
            <StyledButton
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              size={'small'}
              variant={'outlined'}
            >
              Previous
            </StyledButton>
            <StyledButton
              color={'info'}
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              size={'small'}
              variant={'outlined'}
            >
              Next
            </StyledButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
