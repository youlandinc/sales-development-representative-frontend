import { Box, Collapse, Skeleton, Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { FC, ReactNode } from 'react';

type CreditUsageGridProps = {
  list?: Record<string, any>[];
  isLoading?: boolean;
  columns: GridColDef[];
  renderDetail?: (row: Record<string, any>, rowIndex: number) => ReactNode;
  expandedRows?: Set<number>;
};

const Row: FC<{
  row: Record<string, any>;
  columns: GridColDef[];
  renderDetail?: (row: Record<string, any>, rowIndex: number) => ReactNode;
  rowIndex: number;
  isExpanded: boolean;
}> = ({ row, columns, renderDetail, rowIndex, isExpanded }) => {
  return (
    <Stack width={'100%'}>
      <Stack
        alignItems={'center'}
        direction={'row'}
        sx={{
          '&:hover': {
            bgcolor: '#F8F8FA',
          },
        }}
        width={'100%'}
      >
        {columns.map((col, j) => (
          <Typography
            borderBottom={'1px solid #D0CEDA'}
            component={'div'}
            flex={col.flex}
            key={j}
            minWidth={col.minWidth}
            px={3}
            py={1.5}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            textAlign={col.align || 'left'}
            variant={'body3'}
            width={col.width}
          >
            {col?.renderCell?.({
              value: row[col.field],
              row: row,
            } as any) || row[col.field]}
          </Typography>
        ))}
      </Stack>
      {renderDetail && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ width: '100%' }}>{renderDetail(row, rowIndex)}</Box>
        </Collapse>
      )}
    </Stack>
  );
};

export const CreditUsageGrid: FC<CreditUsageGridProps> = ({
  list,
  isLoading,
  columns,
  renderDetail,
  expandedRows,
}) => {
  return (
    <Stack flex={1} minWidth={0}>
      {/*grid*/}
      {list?.length === 0 ? (
        <Typography margin={'auto'} textAlign={'center'} variant={'body2'}>
          No results found.
        </Typography>
      ) : (
        <Stack overflow={'auto'} width={'100%'}>
          {/*header*/}
          <Stack flexDirection={'row'} width={'100%'}>
            {columns.length === 0
              ? null
              : columns.map((col, i) => (
                  <Typography
                    borderBottom={'1px solid #D0CEDA'}
                    color={'text.secondary'}
                    flex={col.flex}
                    key={i}
                    lineHeight={1}
                    minWidth={col.minWidth}
                    pb={1}
                    px={3}
                    variant={'body3'}
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
                        color={'text.secondary'}
                        flex={col.flex}
                        key={i}
                        minWidth={col.minWidth}
                        px={3}
                        py={1.5}
                        textAlign={col.align || 'left'}
                        variant={'body3'}
                        width={col.width}
                      >
                        {col.field === 'id' ? j + 1 : <Skeleton />}
                      </Typography>
                    ))}
                  </Stack>
                ))
              : list?.map((row, i) => (
                  <Row
                    columns={columns}
                    isExpanded={expandedRows?.has(i) ?? false}
                    key={i}
                    renderDetail={renderDetail}
                    row={row}
                    rowIndex={i}
                  />
                ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
