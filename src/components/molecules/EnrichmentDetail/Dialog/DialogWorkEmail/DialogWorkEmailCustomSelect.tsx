import {
  Autocomplete,
  AutocompleteProps,
  Icon,
  Stack,
  Typography,
} from '@mui/material';
import { FC, ReactNode } from 'react';

import { StyledTextField } from '@/components/atoms';

import { useEnrichmentTableStore } from '@/stores/enrichment';

import { TableColumnTypeEnum } from '@/types/enrichment/table';

import { COLUMN_TYPE_ICONS } from '../../Table/config';
import { DEFAULT_AUTOCOMPLETE_SX } from '@/styles';

import ICON_ARROW from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_arrow_down.svg';
import ICON_CLOSE from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_close_thin.svg';

const POPUP_ICON = (
  <Icon component={ICON_ARROW} sx={{ width: 14, height: 14 }} />
);
const CLEAR_ICON = (
  <Icon
    component={ICON_CLOSE}
    sx={{ width: 14, height: 14, cursor: 'pointer' }}
  />
);

export const DialogWorkEmailCustomSelect: FC<
  { title?: string | ReactNode; required?: boolean } & Pick<
    AutocompleteProps<TOption, false, false, false>,
    'value' | 'onChange'
  >
> = ({ title, onChange, value, required }) => {
  const { columns } = useEnrichmentTableStore((store) => store);

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
