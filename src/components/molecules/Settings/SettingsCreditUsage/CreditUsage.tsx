import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { FC, useCallback, useMemo, useState } from 'react';

import { CreditUsageGrid } from './CreditUsageGrid';

import { StyledButton } from '@/components/atoms';
import { PlanCategoryEnum } from '@/types';
import { GridColDef } from '@mui/x-data-grid';
import { CreditUsageToolbar } from './CreditUsageToolbar';
import { useCreditUsage } from './hooks';

interface Provider {
  companyName: string;
  companyUrl: string;
  creditsUsed: number;
}

interface CreditUsageRow {
  tableName?: string;
  directory?: string;
  integrationName?: string;
  providers?: Provider[];
  remainingCredits?: number;
  searchTime?: string;
  creditsUsed?: number;
  date?: string;
}

// Style constants
const AVATAR_SIZE = 18;
const AVATAR_OVERLAP = '-4px';
const BORDER_COLOR = '#F8F8FA';
const HOVER_BG_COLOR = '#F8F8FA';
const ROW_BORDER_COLOR = '#D0CEDA';
const TEXT_PRIMARY_COLOR = '#363440';
const TEXT_SECONDARY_COLOR = '#6F6C7D';
const NEUTRAL_BG_COLOR = '#F0F1F2';

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

  const toggleRow = useCallback((index: number) => {
    setExpandedRows((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(index)) {
        newExpanded.delete(index);
      } else {
        newExpanded.add(index);
      }
      return newExpanded;
    });
  }, []);

  const renderProvider = useCallback(
    (provider: Provider[], rowIndex: number) => {
      const isExpanded = expandedRows.has(rowIndex);
      const hasMultiple = provider.length > 1;
      const displayCount = Math.min(provider.length, 3);
      const remainingCount = provider.length - 3;

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
          sx={{
            cursor: hasMultiple ? 'pointer' : 'default',
            width: 'fit-content',
          }}
        >
          {provider.slice(0, displayCount).map((p, idx) => (
            <Avatar
              key={`${p.companyName}-${idx}`}
              src={p?.companyUrl}
              sx={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                border: `1px solid ${BORDER_COLOR}`,
                ml: idx > 0 ? `${AVATAR_OVERLAP} !important` : 0,
                position: 'relative',
                zIndex: displayCount - idx + 1,
              }}
            />
          ))}
          {remainingCount > 0 && (
            <Avatar
              sx={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                bgcolor: NEUTRAL_BG_COLOR,
                ml: `${AVATAR_OVERLAP} !important`,
                position: 'relative',
                zIndex: 1,
                fontSize: 10,
                color: 'text.primary',
              }}
            >
              +{remainingCount}
            </Avatar>
          )}
          <Typography
            sx={{
              fontSize: 12,
              color: TEXT_PRIMARY_COLOR,
              ml: 1,
              userSelect: 'none',
            }}
          >
            {provider.length} {provider.length === 1 ? 'provider' : 'providers'}
          </Typography>
          {hasMultiple && (
            <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
              {isExpanded ? (
                <KeyboardArrowUp
                  sx={{ fontSize: 16, color: TEXT_SECONDARY_COLOR }}
                />
              ) : (
                <KeyboardArrowDown
                  sx={{ fontSize: 16, color: TEXT_SECONDARY_COLOR }}
                />
              )}
            </Box>
          )}
        </Stack>
      );
    },
    [expandedRows, toggleRow],
  );

  // Create a stable row index map
  const rowIndexMap = useMemo(() => {
    const map = new Map<CreditUsageRow, number>();
    data?.data?.content?.forEach((row, index) => {
      map.set(row, index);
    });
    return map;
  }, [data?.data?.content]);

  const columns: GridColDef[] = useMemo(() => {
    const DIRECTORY_COLUMNS: GridColDef[] = [
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
    ];

    const ENRICHMENT_COLUMNS: GridColDef[] = [
      {
        field: 'integrationName',
        headerName: 'Enrichment service',
        width: 180,
      },
      {
        field: 'providers',
        headerName: 'Providers',
        flex: 1,
        renderCell: ({ value, row }) => {
          const rowIndex = rowIndexMap.get(row) ?? -1;
          return renderProvider(value, rowIndex);
        },
      },
    ];

    const DEFAULT_COLUMNS: GridColDef[] = [
      {
        field: 'remainingCredits',
        headerName: 'Remaining Credits',
        width: 160,
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
            return format(new Date(value), 'h:mma MMM d, yyyy');
          } catch (e) {
            return value;
          }
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

    if (
      [PlanCategoryEnum.enrichment].includes(
        (queryConditions.category || '') as PlanCategoryEnum,
      )
    ) {
      return [...ENRICHMENT_COLUMNS, ...DEFAULT_COLUMNS];
    }
    return [...DIRECTORY_COLUMNS, ...DEFAULT_COLUMNS];
  }, [queryConditions.category, rowIndexMap, renderProvider]);

  const renderDetail = useCallback(
    (row: CreditUsageRow, rowIndex: number) => {
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
              key={`${provider.companyName}-${index}`}
              py={1.5}
              sx={{
                '&:hover': {
                  bgcolor: HOVER_BG_COLOR,
                },
                borderBottom: `1px solid ${ROW_BORDER_COLOR}`,
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
                        sx={{
                          width: AVATAR_SIZE,
                          height: AVATAR_SIZE,
                        }}
                      />
                      <Typography
                        color={TEXT_PRIMARY_COLOR}
                        sx={{ fontSize: 12 }}
                      >
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
                      <Typography
                        color={TEXT_SECONDARY_COLOR}
                        sx={{ fontSize: 12 }}
                      >
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
    },
    [expandedRows, columns],
  );

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
