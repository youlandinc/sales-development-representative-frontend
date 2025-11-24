import { FC, useMemo } from 'react';
import {
  Icon,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { TableColumnTypeEnum } from '@/types/Prospect/table';
import {
  DirectoriesQueryTableBodyItem,
  DirectoriesQueryTableHeaderItem,
} from '@/types/directories';

import ICON_NO_RESULT from './assets/icon-no-result.svg';

const getRandomWidth = () => `${Math.floor(Math.random() * 50 + 40)}%`;

export interface PreviewTableProps {
  header: DirectoriesQueryTableHeaderItem[];
  body: DirectoriesQueryTableBodyItem[];
  loading: boolean;
  hasSearched: boolean;
}

export const PreviewTable: FC<PreviewTableProps> = ({
  header,
  body,
  loading,
  hasSearched,
}) => {
  const reducedHeader = useMemo(() => {
    return [
      {
        columnKey: 'inside_sort_number',
        columnName: '',
        columnType: TableColumnTypeEnum.number,
        groupLabel: null,
        groupOrder: null,
        width: 60,
      },
      ...header,
    ];
  }, [header]);

  // 为 Header 生成随机宽度
  const headerSkeletonWidths = useMemo(() => {
    return reducedHeader.map(() => getRandomWidth());
  }, [reducedHeader]);

  // 为 Body 每个单元格预生成随机宽度
  const bodySkeletonWidths = useMemo(() => {
    if (!loading) {
      return [];
    }
    const rows = body.length === 0 ? 5 : body.length;
    return Array.from({ length: rows }, () =>
      reducedHeader.map(() => getRandomWidth()),
    );
  }, [loading, body.length, reducedHeader]);

  return hasSearched ? (
    <Table
      sx={{
        '& .MuiTableCell-root': {
          height: '40px !important',
          minHeight: 'auto !important',
        },
        '& .MuiTableHead-root': {
          height: '40px !important',
          minHeight: 'auto !important',
        },
      }}
    >
      <TableHead>
        <TableRow>
          {reducedHeader.map((head, index) => (
            <TableCell
              key={`header-${index}`}
              sx={{
                py: 0,
                px: 1.5,
                borderTop: '1px solid #D0CEDA',
                borderRight: '1px solid #D0CEDA',
                fontSize: 14,
                fontWeight: 600,
                color: 'primary.main',
                whiteSpace: 'nowrap',
                width: head.width ? `${head.width}px` : 'auto',
                minWidth: head.width ? `${head.width}px` : 160,
                textAlign: index === 0 ? 'center' : 'left',
              }}
            >
              {loading ? (
                <Skeleton
                  animation="wave"
                  width={headerSkeletonWidths[index]}
                />
              ) : (
                head.columnName
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {(loading && body.length === 0
          ? (Array.from({ length: 5 }) as DirectoriesQueryTableBodyItem[])
          : body
        ).map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {reducedHeader.map((head, colIndex) => (
              <TableCell
                key={`${rowIndex}-${colIndex}`}
                sx={{
                  py: 0,
                  px: 1.5,
                  borderRight: '1px solid #D0CEDA',
                  borderBottom: '1px solid #D0CEDA',
                  fontSize: 14,
                  color: 'text.primary',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 300,
                  textAlign: colIndex === 0 ? 'center' : 'left',
                }}
              >
                {loading ? (
                  <Skeleton
                    animation="wave"
                    width={bodySkeletonWidths[rowIndex]?.[colIndex]}
                  />
                ) : colIndex === 0 ? (
                  rowIndex + 1
                ) : (
                  row[head.columnKey as keyof typeof row] || '-'
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <Stack
      sx={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon component={ICON_NO_RESULT} sx={{ width: 120, height: 93 }} />
      <Typography
        sx={{ mt: 1, fontSize: 14, fontWeight: 600, color: 'text.secondary' }}
      >
        No matching results
      </Typography>
      <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
        Try adjusting your filters or search terms.
      </Typography>
    </Stack>
  );
};
