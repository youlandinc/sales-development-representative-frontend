import { FC } from 'react';
import { Skeleton, Stack } from '@mui/material';

import { TableColumnTypeEnum } from '@/types/enrichment/table';
import { DirectoriesQueryTableHeaderItem } from '@/types/directories';
import { TypeIcon } from '@/components/molecules/EnrichmentDetail/Table/TableIcon';

import { OverflowTooltip } from './OverflowTooltip';

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

interface PreviewHeaderCellProps {
  head: DirectoriesQueryTableHeaderItem;
  index: number;
  isLoading: boolean;
}

export const PreviewHeaderCell: FC<PreviewHeaderCellProps> = ({
  head,
  index,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Skeleton
        animation="wave"
        width={FIXED_WIDTHS[index % FIXED_WIDTHS.length]}
      />
    );
  }

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      {index > 0 && (
        <TypeIcon
          type={
            (head.columnType as TableColumnTypeEnum) || TableColumnTypeEnum.text
          }
        />
      )}
      <OverflowTooltip>{head.columnName}</OverflowTooltip>
    </Stack>
  );
};
