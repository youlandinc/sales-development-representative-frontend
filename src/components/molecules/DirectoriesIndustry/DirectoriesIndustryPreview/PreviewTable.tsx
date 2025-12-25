import { FC, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  Box,
  Icon,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { useDirectoriesStore } from '@/stores/directories';
import { TableColumnTypeEnum } from '@/types/enrichment/table';
import {
  DirectoriesQueryTableBodyItem,
  DirectoriesQueryTableHeaderItem,
} from '@/types/directories';

import { PreviewHeaderCell } from './PreviewHeaderCell';
import { PreviewBodyCell } from './PreviewBodyCell';

import ICON_LOCK from './assets/icon-lock.svg';
import ICON_NO_RESULT from './assets/icon-no-result.svg';

const FALLBACK_SKELETON_COLUMNS: DirectoriesQueryTableHeaderItem[] = [
  {
    columnKey: 'inside_sort_number',
    columnName: '',
    columnType: TableColumnTypeEnum.number,
    groupLabel: null,
    groupOrder: null,
    width: 60,
    isAuth: true,
  },
  ...Array.from({ length: 6 }, (_, i) => ({
    columnKey: `skeleton_${i}`,
    columnName: '',
    columnType: TableColumnTypeEnum.text,
    groupLabel: null,
    groupOrder: null,
    width: undefined,
    isAuth: true,
  })),
];

const SKELETON_ROW_COUNT = 5;

export const PreviewTable: FC = () => {
  const {
    previewHeader: header,
    previewBody,
    isLoadingConfig,
    isLoadingPreview,
    hasSubmittedSearch,
  } = useDirectoriesStore(
    useShallow((state) => ({
      previewHeader: state.previewHeader,
      previewBody: state.previewBody,
      isLoadingConfig: state.isLoadingConfig,
      isLoadingPreview: state.isLoadingPreview,
      hasSubmittedSearch: state.hasSubmittedSearch,
    })),
  );

  const { findCount, findList: body } = previewBody;
  const isLoading = isLoadingPreview || isLoadingConfig || header.length === 0;

  const reducedHeader = useMemo((): DirectoriesQueryTableHeaderItem[] => {
    return [
      {
        columnKey: 'inside_sort_number',
        columnName: '',
        columnType: TableColumnTypeEnum.number,
        groupLabel: null,
        groupOrder: null,
        width: 60,
        isAuth: true,
      },
      ...header,
    ];
  }, [header]);

  const skeletonColumns =
    header.length > 0 ? reducedHeader : FALLBACK_SKELETON_COLUMNS;

  const lockedStartIndex = reducedHeader.findIndex((h) => !h.isAuth);
  const hasLockedColumns = lockedStartIndex > -1;

  const lockStartRef = useRef<HTMLTableCellElement>(null);
  const [blurLeft, setBlurLeft] = useState(0);
  const [blurWidth, setBlurWidth] = useState(0);

  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const [bodyTop, setBodyTop] = useState(0);
  const [bodyHeight, setBodyHeight] = useState(0);

  useLayoutEffect(() => {
    if (!hasLockedColumns || !lockStartRef.current || !bodyRef.current) {
      return;
    }

    const th = lockStartRef.current;
    const bodyEl = bodyRef.current;
    const table = th.closest('table') as HTMLTableElement;
    if (!table) {
      return;
    }

    const updatePositions = () => {
      const left = th.offsetLeft;
      const width = table.scrollWidth - left;
      const tableRect = table.getBoundingClientRect();
      const bodyRect = bodyEl.getBoundingClientRect();
      const relativeTop = bodyRect.top - tableRect.top;

      setBlurLeft(left);
      setBlurWidth(width);
      setBodyTop(relativeTop);
      setBodyHeight(bodyRect.height);
    };

    updatePositions();

    const resizeObserver = new ResizeObserver(updatePositions);
    resizeObserver.observe(table);

    return () => resizeObserver.disconnect();
  }, [reducedHeader, body, isLoading, hasLockedColumns]);

  if (!isLoading && hasSubmittedSearch && findCount === 0) {
    return (
      <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box sx={{ width: 'fit-content' }}>
        <Table
          sx={{
            '& .MuiTableCell-root': {
              height: '40px !important',
            },
          }}
        >
          <TableHead>
            <TableRow>
              {(isLoading ? skeletonColumns : reducedHeader).map(
                (head, index) => (
                  <TableCell
                    key={`header-${index}`}
                    ref={index === lockedStartIndex ? lockStartRef : null}
                    sx={{
                      py: 0,
                      px: 1.5,
                      borderTop: '1px solid #F0F0F4',
                      borderRight: '1px solid #F0F0F4',
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'primary.main',
                      whiteSpace: 'nowrap',
                      width: head.width ? `${head.width}px` : 'auto',
                      minWidth: head.width ? `${head.width}px` : 160,
                      ...(index === 0 && { textAlign: 'center' }),
                    }}
                  >
                    <PreviewHeaderCell
                      head={head}
                      index={index}
                      isLoading={isLoading}
                    />
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>

          <TableBody ref={bodyRef}>
            {(isLoading && body.length === 0
              ? Array.from<DirectoriesQueryTableBodyItem | null>({
                  length: SKELETON_ROW_COUNT,
                })
              : body
            ).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {(isLoading ? skeletonColumns : reducedHeader).map(
                  (head, colIndex) => (
                    <TableCell
                      key={`${rowIndex}-${colIndex}`}
                      sx={{
                        py: 0,
                        px: 1.5,
                        borderRight: '1px solid #F0F0F4',
                        borderBottom: '1px solid #F0F0F4',
                        fontSize: 14,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 300,
                        ...(colIndex === 0 && { textAlign: 'center' }),
                      }}
                    >
                      <PreviewBodyCell
                        colIndex={colIndex}
                        head={head}
                        isLoading={isLoading}
                        row={row}
                        rowIndex={rowIndex}
                      />
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {hasLockedColumns && (
        <Stack
          sx={{
            position: 'absolute',
            top: bodyTop,
            left: blurLeft,
            width: blurWidth,
            height: bodyHeight,

            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'none',

            pointerEvents: 'none',
            zIndex: 20,

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Stack
            sx={{
              ml: 3,
              maxWidth: 90,
              top: 30,
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Stack
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: 2,
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon component={ICON_LOCK} sx={{ width: 24, height: 24 }} />
            </Stack>

            <Typography
              sx={{
                fontSize: 12,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              Access records to view details
            </Typography>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};
