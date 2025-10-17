import {
  Autocomplete,
  AutocompleteProps,
  Icon,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FC, ReactNode } from 'react';

import { useProspectTableStore } from '@/stores/Prospect';

import ICON_TEXT from '@/components/molecules/ProspectDetail/assets/dialog/icon_text.svg';

export const DialogWorkEmailCustomSelect: FC<
  { title?: string | ReactNode } & Pick<
    AutocompleteProps<TOption, false, false, false>,
    'value' | 'onChange'
  >
> = ({ title, onChange, value }) => {
  const { columns } = useProspectTableStore((store) => store);

  const options = columns.map((item) => ({
    label: item.fieldName,
    value: item.fieldId,
    key: item.fieldId,
  })) as TOption[];

  return (
    <Stack gap={1.5}>
      {title && (
        <Typography component={'div'} variant={'body3'}>
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
            <TextField
              {...params}
              fullWidth
              placeholder={'Start typing or select a column'}
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: !value ? null : (
                    <Icon
                      component={ICON_TEXT}
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
              <Icon component={ICON_TEXT} sx={{ width: 16, height: 16 }} />
              {option.label}
            </Stack>
          );
        }}
        value={value || null}
      />
    </Stack>
  );
};
