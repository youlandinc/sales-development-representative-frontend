import {
  Autocomplete,
  AutocompleteProps,
  Stack,
  Typography,
} from '@mui/material';
import { FC, ReactNode } from 'react';

import { StyledTextField } from '@/components/atoms';

import { useMergedColumns } from '@/components/molecules/EnrichmentDetail/hooks';

import {
  TableColumnProps,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

import { TypeIcon } from '../../Table/TableIcon';
import {
  DEFAULT_AUTOCOMPLETE_LISTBOX_SX,
  DEFAULT_AUTOCOMPLETE_PAPER_SX,
  DEFAULT_AUTOCOMPLETE_SX,
} from '@/styles';

import { DrawersIconConfig } from '../DrawersIconConfig';

const POPUP_ICON = <DrawersIconConfig.ArrowDown size={14} />;
const CLEAR_ICON = (
  <DrawersIconConfig.CloseThin size={14} sx={{ cursor: 'pointer' }} />
);

export const DialogWorkEmailCustomSelect: FC<
  { title?: string | ReactNode; required?: boolean } & Pick<
    AutocompleteProps<TOption, false, false, false>,
    'value' | 'onChange'
  >
> = ({ title, onChange, value, required }) => {
  // Get merged columns
  const columns = useMergedColumns();
  const options: TOption[] = columns.map((item: TableColumnProps) => ({
    label: item.fieldName,
    value: item.fieldId,
    key: item.fieldId,
  }));
  return (
    <Stack gap={0.5}>
      {title && (
        <Typography
          component={'div'}
          sx={{
            '&::after': {
              content: '"*"',
              color: 'red',
              pl: 0.5,
              visibility: required ? 'visible' : 'hidden',
              verticalAlign: 'middle',
            },
          }}
          variant={'body3'}
        >
          {title}
        </Typography>
      )}
      <Autocomplete
        clearIcon={CLEAR_ICON}
        fullWidth
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={onChange}
        options={options}
        popupIcon={POPUP_ICON}
        renderInput={(params) => {
          return (
            <StyledTextField
              {...params}
              fullWidth
              placeholder={'Start typing or select a column'}
              size={'small'}
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: !value?.value ? null : (
                    <TypeIcon
                      type={
                        (columns.find(
                          (col: TableColumnProps) =>
                            col.fieldId === value.value,
                        )?.fieldType as TableColumnTypeEnum) ||
                        TableColumnTypeEnum.text
                      }
                    />
                  ),
                },
              }}
            />
          );
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Stack
              alignItems={'center'}
              component={'li'}
              flexDirection={'row'}
              gap={1}
              key={key}
              {...optionProps}
            >
              <TypeIcon
                type={
                  (columns.find(
                    (col: TableColumnProps) => col.fieldId === option.value,
                  )?.fieldType as TableColumnTypeEnum) ||
                  TableColumnTypeEnum.text
                }
              />
              {option.label}
            </Stack>
          );
        }}
        slotProps={{
          listbox: {
            sx: DEFAULT_AUTOCOMPLETE_LISTBOX_SX,
          },
          paper: {
            sx: DEFAULT_AUTOCOMPLETE_PAPER_SX,
          },
        }}
        sx={DEFAULT_AUTOCOMPLETE_SX}
        value={value || null}
      />
    </Stack>
  );
};
