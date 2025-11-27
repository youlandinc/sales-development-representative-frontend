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

// Skeleton config
const SKELETON_CONFIG = {
  COLUMNS: 6, // Default 6 columns
  ROWS: 5, // Default 5 rows
};

export interface PreviewTableProps {
  header: DirectoriesQueryTableHeaderItem[];
  body: DirectoriesQueryTableBodyItem[];
  loading: boolean;
  isShowResult: boolean;
}

export const PreviewTable: FC<PreviewTableProps> = ({
  header,
  body,
  loading,
  isShowResult,
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

  // Columns array for skeleton: use reducedHeader if header exists, otherwise use fixed count
  const skeletonColumns = useMemo(() => {
    if (header.length > 0) {
      return reducedHeader;
    }
    // Fixed skeleton columns: index column + N placeholder columns
    return [
      {
        columnKey: 'inside_sort_number',
        columnName: '',
        columnType: TableColumnTypeEnum.number,
        width: 60,
      },
      ...Array.from({ length: SKELETON_CONFIG.COLUMNS }, (_, i) => ({
        columnKey: `skeleton_${i}`,
        columnName: '',
        columnType: null,
        width: null,
      })),
    ];
  }, [header.length, reducedHeader]);

  const headerSkeletonWidths = useMemo(() => {
    return skeletonColumns.map(() => getRandomWidth());
  }, [skeletonColumns]);

  const bodySkeletonWidths = useMemo(() => {
    if (!loading) {
      return [];
    }
    const rows = body.length === 0 ? SKELETON_CONFIG.ROWS : body.length;
    return Array.from({ length: rows }, () =>
      skeletonColumns.map(() => getRandomWidth()),
    );
  }, [loading, body.length, skeletonColumns]);

  return isShowResult ? (
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
          {(loading ? skeletonColumns : reducedHeader).map((head, index) => (
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
          ? (Array.from({
              length: SKELETON_CONFIG.ROWS,
            }) as DirectoriesQueryTableBodyItem[])
          : body
        ).map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {(loading ? skeletonColumns : reducedHeader).map(
              (head, colIndex) => (
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
              ),
            )}
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
