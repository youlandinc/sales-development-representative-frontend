import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { StyledButton } from '@/components/atoms';
import { TableColumnProps } from '@/types/enrichment/table';

import { FilterRow } from './index';
import { PanelIcon } from '../../PanelIcon';

export interface FilterGroupData {
  filters: FilterRowData[];
}

export interface FilterRowData {
  fieldId: string;
  conditionType: string;
  values: string | string[];
}

interface FilterGroupProps {
  groupIndex: number;
  data: FilterGroupData;
  columns: TableColumnProps[];
  onFilterRowChange: (
    groupIndex: number,
    rowIndex: number,
    field: keyof FilterRowData,
    value: FilterRowData[keyof FilterRowData],
  ) => void;
  onAddFilterRow: (groupIndex: number) => void;
  onDeleteFilterRow: (groupIndex: number, rowIndex: number) => void;
  onDuplicateFilterRow: (groupIndex: number, rowIndex: number) => void;
}

export const FilterGroup: FC<FilterGroupProps> = ({
  groupIndex,
  data,
  columns,
  onFilterRowChange,
  onAddFilterRow,
  onDeleteFilterRow,
  onDuplicateFilterRow,
}) => {
  return (
    <Stack
      sx={{
        py: 1,
        px: 1.5,
        border: '1px solid rgba(210, 214, 225, 0.60)',
        borderRadius: 2,
        bgcolor: '#F4F5F9',
        gap: 1.5,
      }}
    >
      {data.filters.map((filter, rowIndex) => {
        const isFirst = rowIndex === 0;
        return (
          <FilterRow
            columns={columns}
            data={filter}
            groupIndex={groupIndex}
            isFirst={isFirst}
            key={rowIndex}
            onDelete={() => onDeleteFilterRow(groupIndex, rowIndex)}
            onDuplicate={() => onDuplicateFilterRow(groupIndex, rowIndex)}
            onFieldChange={(
              field: keyof FilterRowData,
              value: FilterRowData[keyof FilterRowData],
            ) => onFilterRowChange(groupIndex, rowIndex, field, value)}
            rowIndex={rowIndex}
          />
        );
      })}

      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          sx={{
            width: 52,
            textAlign: 'right',
            color: 'text.secondary',
            fontSize: 14,
          }}
        >
          and
        </Typography>

        <StyledButton
          color={'info'}
          onClick={() => onAddFilterRow(groupIndex)}
          size={'small'}
          sx={{ bgcolor: '#fff !important' }}
          variant={'outlined'}
        >
          <PanelIcon.FilterAdd sx={{ mr: 0.5 }} />
          Add filter
        </StyledButton>
      </Stack>
    </Stack>
  );
};
