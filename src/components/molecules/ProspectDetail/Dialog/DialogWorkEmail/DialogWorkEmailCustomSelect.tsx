import {
  Autocomplete,
  AutocompleteProps,
  Icon,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ElementType, FC } from 'react';

import { useProspectTableStore } from '@/stores/Prospect';

import ICON_TEXT from '../../assets/dialog/icon_text.svg';

type OptionType = TOption & { icon?: ElementType };

export const DialogWorkEmailCustomSelect: FC<
  { title: string } & Pick<
    AutocompleteProps<OptionType, true, false, false>,
    'value' | 'onChange'
  >
> = ({ title, onChange, value }) => {
  const { columns } = useProspectTableStore((store) => store);
  return (
    <Stack gap={1.5}>
      <Typography variant={'body3'}>{title}</Typography>
      <Autocomplete
        fullWidth
        onChange={onChange}
        options={columns.map((item) => ({
          label: item.fieldName,
          value: item.fieldId,
          key: item.fieldId,
          icon: ICON_TEXT,
        }))}
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
              sx={{
                '&:hover': { bgcolor: '#F7F4FD !important' },
              }}
            >
              <Icon component={option.icon} sx={{ width: 16, height: 16 }} />
              {option.label}
            </Stack>
          );
        }}
        value={value}
      />
      {/* <StyledSelect
        {...rest}
        options={columns.map((item) => ({
          label: item.fieldName,
          value: item.fieldId,
          key: item.fieldId,
          icon: ICON_TEXT,
        }))}
      /> */}
    </Stack>
  );
};
