import { FC } from 'react';
import { Box, Icon, Skeleton, Typography } from '@mui/material';

import { TableColumnTypeEnum } from '@/types/enrichment/table';
import { DirectoriesQueryTableHeaderItem } from '@/types/directories';
import { UFormatDate, UFormatDollar, UFormatNumber } from '@/utils';

import { OverflowTooltip } from './OverflowTooltip';

import ICON_REDIRECT_URL from './assets/icon-redirect-url.svg';

const FIXED_WIDTHS = [
  '65%',
  '80%',
  '45%',
  '70%',
  '55%',
  '75%',
  '60%',
  '85%',
  '50%',
  '72%',
];
const STABLE_BODY_WIDTHS = Array.from({ length: 20 }, (_, rowIndex) =>
  FIXED_WIDTHS.map(
    (_, colIndex) => FIXED_WIDTHS[(rowIndex + colIndex) % FIXED_WIDTHS.length],
  ),
);

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
    default:
      return String(value);
  }
};

interface PreviewBodyCellProps {
  head: DirectoriesQueryTableHeaderItem;
  row: Record<string, any> | null;
  rowIndex: number;
  colIndex: number;
  isLoading: boolean;
}

export const PreviewBodyCell: FC<PreviewBodyCellProps> = ({
  head,
  row,
  rowIndex,
  colIndex,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Skeleton
        animation="wave"
        width={
          STABLE_BODY_WIDTHS[rowIndex % STABLE_BODY_WIDTHS.length]?.[
            colIndex % STABLE_BODY_WIDTHS[0].length
          ]
        }
      />
    );
  }

  const isLocked = !head.isAuth;
  const value = row?.[head.columnKey as string];

  if (isLocked) {
    return (
      <Box
        sx={{
          filter: 'blur(4px)',
          opacity: 0.7,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {value || 'LOCKED INFORMATION'}
      </Box>
    );
  }

  if (colIndex === 0) {
    return <>{rowIndex + 1}</>;
  }

  if (head.columnType === TableColumnTypeEnum.url) {
    if (!value) {
      return <>-</>;
    }

    const onUrlClick = () => {
      const finalUrl =
        value.startsWith('http://') || value.startsWith('https://')
          ? value
          : `https://${value}`;
      window.open(finalUrl, '_blank');
    };

    return (
      <Box
        onClick={onUrlClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          width: 'fit-content',
        }}
      >
        <Icon
          component={ICON_REDIRECT_URL}
          sx={{
            width: 16,
            height: 16,
            flexShrink: 0,
            cursor: 'pointer',
            '& path': {
              fill: 'rgba(111, 108, 125, .8)',
            },
          }}
        />
        <Typography
          sx={{
            flex: 1,
            color: 'rgba(111, 108, 125, .8)',
            minWidth: 0,
            fontSize: 14,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textDecoration: 'underline',
            cursor: 'pointer',
            textDecorationColor: 'rgba(111, 108, 125, .5)',
            textUnderlineOffset: '2px',
          }}
        >
          {value}
        </Typography>
      </Box>
    );
  }

  if (head.columnType === TableColumnTypeEnum.img_url) {
    if (!value) {
      return <>-</>;
    }

    return (
      <Box
        alt=""
        component="img"
        src={value}
        sx={{
          width: 24,
          height: 24,
          objectFit: 'cover',
          borderRadius: 0.5,
        }}
      />
    );
  }

  return (
    <OverflowTooltip>{formatCellValue(value, head.columnType)}</OverflowTooltip>
  );
};
