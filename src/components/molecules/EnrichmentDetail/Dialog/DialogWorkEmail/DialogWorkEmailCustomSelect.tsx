import {
  Autocomplete,
  AutocompleteProps,
  Icon,
  Stack,
  Typography,
} from '@mui/material';
import { FC, ReactNode } from 'react';

import { useProspectTableStore } from '@/stores/enrichment';

import { StyledTextField } from '@/components/atoms';
import { COLUMN_TYPE_ICONS } from '@/constants/table/iconsColumnType';
import { TableColumnTypeEnum } from '@/types/enrichment/table';
import { DEFAULT_AUTOCOMPLETE_SX } from '@/styles';

export const DialogWorkEmailCustomSelect: FC<
  { title?: string | ReactNode; required?: boolean } & Pick<
    AutocompleteProps<TOption, false, false, false>,
    'value' | 'onChange'
  >
> = ({ title, onChange, value, required }) => {
  const { columns } = useProspectTableStore((store) => store);

  const options: TOption[] = columns.map((item) => ({
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
        fullWidth
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={onChange}
        options={options}
        renderInput={(params) => {
          return (
            <StyledTextField
              {...params}
              fullWidth
              placeholder={'Start typing or select a column'}
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: !value ? null : (
                    <Icon
                      component={
                        COLUMN_TYPE_ICONS[
                          columns.find((col) => col.fieldId === value.value)
                            ?.fieldType as TableColumnTypeEnum
                        ] || COLUMN_TYPE_ICONS[TableColumnTypeEnum.text]
                      }
                      sx={{ width: 16, height: 16 }}
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
              <Icon
                component={
                  COLUMN_TYPE_ICONS[
                    columns.find((col) => col.fieldId === option.value)
                      ?.fieldType as TableColumnTypeEnum
                  ] || COLUMN_TYPE_ICONS[TableColumnTypeEnum.text]
                }
                sx={{ width: 16, height: 16 }}
              />
              {option.label}
            </Stack>
          );
        }}
        sx={DEFAULT_AUTOCOMPLETE_SX}
        value={value || null}
      />
    </Stack>
  );
};
