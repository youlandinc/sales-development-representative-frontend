import { FC, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
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

import ICON_LOCK from './assets/icon-lock.svg';
import ICON_NO_RESULT from './assets/icon-no-result.svg';
import ICON_REDIRECT_URL from './assets/icon-redirect-url.svg';

import { OverflowTooltip } from './OverflowTooltip';
import { COLUMN_TYPE_ICONS } from '@/constants';
import {
  UFormatDate,
  UFormatDollar,
  UFormatNumber,
  UFormatPhone,
} from '@/utils';

const getRandomWidth = () => `${Math.floor(Math.random() * 50 + 40)}%`;

const formatCellValue = (
  value: unknown,
  columnType: TableColumnTypeEnum,
): string => {
  if (value == null || value === '') {
    return '-';
  }

  switch (columnType) {
    case TableColumnTypeEnum.number:
      return UFormatNumber(value as string | number);
    case TableColumnTypeEnum.currency:
      return UFormatDollar(value as string | number);
    case TableColumnTypeEnum.date:
      return UFormatDate(value as string | Date);
    case TableColumnTypeEnum.phone:
      return UFormatPhone(value as string);
    default:
      return String(value);
  }
};

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

// Pre-generated stable widths to avoid skeleton flickering
const STABLE_HEADER_WIDTHS = Array.from({ length: 10 }, () => getRandomWidth());
const STABLE_BODY_WIDTHS = Array.from({ length: 20 }, () =>
  Array.from({ length: 10 }, () => getRandomWidth()),
);

const SKELETON_ROW_COUNT = 5;

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
  }, [reducedHeader, body, loading, hasLockedColumns]);

  if (!isShowResult) {
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
    <Box sx={{ position: 'relative', overflowX: 'auto', width: '100%' }}>
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
              {(loading ? skeletonColumns : reducedHeader).map(
                (head, index) => (
                  <TableCell
                    key={`header-${index}`}
                    ref={index === lockedStartIndex ? lockStartRef : null}
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
                      ...(index === 0 && { textAlign: 'center' }),
                    }}
                  >
                    {loading ? (
                      <Skeleton
                        animation="wave"
                        width={
                          STABLE_HEADER_WIDTHS[
                            index % STABLE_HEADER_WIDTHS.length
                          ]
                        }
                      />
                    ) : (
                      <Stack
                        sx={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        {index > 0 && (
                          <Icon
                            component={
                              COLUMN_TYPE_ICONS[
                                head.columnType as TableColumnTypeEnum
                              ] || COLUMN_TYPE_ICONS[TableColumnTypeEnum.text]
                            }
                            sx={{ width: 16, height: 16 }}
                          />
                        )}
                        <OverflowTooltip>{head.columnName}</OverflowTooltip>
                      </Stack>
                    )}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>

          <TableBody ref={bodyRef}>
            {(loading && body.length === 0
              ? Array.from<DirectoriesQueryTableBodyItem | null>({
                  length: SKELETON_ROW_COUNT,
                })
              : body
            ).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {(loading ? skeletonColumns : reducedHeader).map(
                  (head, colIndex) => {
                    const isLocked = !head.isAuth && !loading;

                    return (
                      <TableCell
                        key={`${rowIndex}-${colIndex}`}
                        sx={{
                          py: 0,
                          px: 1.5,
                          borderRight: '1px solid #D0CEDA',
                          borderBottom: '1px solid #D0CEDA',
                          fontSize: 14,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 300,
                          ...(colIndex === 0 && { textAlign: 'center' }),
                        }}
                      >
                        {loading ? (
                          <Skeleton
                            animation="wave"
                            width={
                              STABLE_BODY_WIDTHS[
                                rowIndex % STABLE_BODY_WIDTHS.length
                              ]?.[colIndex % STABLE_BODY_WIDTHS[0].length]
                            }
                          />
                        ) : isLocked ? (
                          <Box
                            sx={{
                              filter: 'blur(4px)',
                              opacity: 0.7,
                              userSelect: 'none',
                              pointerEvents: 'none',
                            }}
                          >
                            {row?.[head.columnKey as keyof typeof row] ||
                              'LOCKED INFORMATION'}
                          </Box>
                        ) : colIndex === 0 ? (
                          rowIndex + 1
                        ) : head.columnType === TableColumnTypeEnum.url ? (
                          row?.[head.columnKey as keyof typeof row] ? (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <Icon
                                component={ICON_REDIRECT_URL}
                                sx={{ width: 16, height: 16, flexShrink: 0 }}
                              />
                              <Typography
                                onClick={() => {
                                  window.open(
                                    row?.[head.columnKey as keyof typeof row],
                                    '_blank',
                                  );
                                }}
                                sx={{
                                  flex: 1,
                                  minWidth: 0,
                                  fontSize: 12,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                              >
                                {row?.[head.columnKey as keyof typeof row]}
                              </Typography>
                            </Box>
                          ) : (
                            '-'
                          )
                        ) : (
                          <OverflowTooltip>
                            {formatCellValue(
                              row?.[head.columnKey as keyof typeof row],
                              head.columnType,
                            )}
                          </OverflowTooltip>
                        )}
                      </TableCell>
                    );
                  },
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
