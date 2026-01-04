import { ChangeEvent, FC, useMemo } from 'react';
import { Autocomplete, SxProps, TextField } from '@mui/material';
import { format, isValid, parseISO } from 'date-fns';

import {
  StyledChip,
  StyledDatePicker,
  StyledTextField,
} from '@/components/atoms';
import {
  TableColumnProps,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';
import { TableFilterConditionType } from '@/types/enrichment/tableFilter';

interface FilterValueInputProps {
  column: TableColumnProps | undefined;
  conditionType: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

const ANY_OF_CONDITIONS = [
  TableFilterConditionType.contains_any_of,
  TableFilterConditionType.does_not_contain_any_of,
];

const COMMON_SX: SxProps = {
  width: 180,
  '& .MuiOutlinedInput-root': {
    height: 32,
    borderRadius: 2,
    bgcolor: '#fff',
    '& input': {
      py: 0,
      fontSize: 14,
    },
  },
};

export const FilterValueInput: FC<FilterValueInputProps> = ({
  column,
  conditionType,
  value,
  onChange,
}) => {
  const fieldType = column?.fieldType;
  const isAnyOfCondition = ANY_OF_CONDITIONS.includes(
    conditionType as TableFilterConditionType,
  );

  const dateValue = useMemo(() => {
    if (typeof value === 'string' && value) {
      const parsed = parseISO(value);
      return isValid(parsed) ? parsed : null;
    }
    return null;
  }, [value]);

  if (!column) {
    return (
      <StyledTextField
        disabled
        placeholder="Value"
        size="small"
        sx={COMMON_SX}
      />
    );
  }

  // any_of conditions use Autocomplete for multiple values
  if (isAnyOfCondition) {
    return (
      <Autocomplete
        freeSolo
        multiple
        onChange={(_, newValue) => {
          onChange(newValue);
        }}
        options={[]}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={
              Array.isArray(value) && value.length > 0 ? '' : 'Value'
            }
            size="small"
            sx={{
              ...COMMON_SX,
              width: 'auto',
              minWidth: 180,
              '& .MuiOutlinedInput-root': {
                height: 'auto',
                minHeight: 32,
                py: 0.5,
                px: 1,
                borderRadius: 2,
                bgcolor: '#fff',
              },
            }}
          />
        )}
        renderValue={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { onDelete } = getTagProps({ index });
            return (
              <StyledChip key={index} label={option} onDelete={onDelete} />
            );
          })
        }
        size="small"
        sx={COMMON_SX}
        value={Array.isArray(value) ? value : value ? [value] : []}
      />
    );
  }

  // Other conditions use single value input based on column type
  switch (fieldType) {
    case TableColumnTypeEnum.date:
      return (
        <StyledDatePicker
          onChange={(date: Date | null) => {
            if (date && isValid(date)) {
              onChange(format(date, 'yyyy-MM-dd'));
            } else {
              onChange('');
            }
          }}
          slotProps={{
            textField: {
              size: 'small',
              placeholder: 'Value',
              sx: COMMON_SX,
            },
          }}
          value={dateValue}
        />
      );

    case TableColumnTypeEnum.number:
    case TableColumnTypeEnum.currency:
      return (
        <StyledTextField
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder="Value"
          size="small"
          sx={COMMON_SX}
          type="number"
          value={typeof value === 'string' ? value : ''}
        />
      );

    default:
      return (
        <StyledTextField
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder="Value"
          size="small"
          sx={COMMON_SX}
          value={typeof value === 'string' ? value : ''}
        />
      );
  }
};
