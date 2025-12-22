import {
  Autocomplete,
  AutocompleteProps,
  Box,
  Icon,
  Stack,
} from '@mui/material';
import { FC } from 'react';

import { StyledTextField } from '@/components/atoms';

import CheckIcon from './assets/icon_checked.svg';
import ICON_CLOSE from './assets/icon_close.svg';
import ICON_STATIC from './assets/icon_static.svg';

import ICON_ARROW from './assets/icon_arrow_down.svg';

import { DEFAULT_AUTOCOMPLETE_SX } from '@/styles';

const POPUP_ICON = (
  <Icon component={ICON_ARROW} sx={{ width: 14, height: 14 }} />
);
const CLEAR_ICON = (
  <Icon
    component={ICON_CLOSE}
    sx={{ width: 14, height: 14, cursor: 'pointer' }}
  />
);

export const StyledMultiSelect: FC<
  Omit<AutocompleteProps<any, true, false, false>, 'renderInput'> & {
    placeholder?: string;
  }
> = ({ placeholder, value, onChange, options, ...props }) => {
  return (
    <Autocomplete
      clearIcon={CLEAR_ICON}
      disableCloseOnSelect
      isOptionEqualToValue={(option, value) => option.value === value.value}
      multiple
      onChange={(_, newValue, reason) => {
        onChange?.(_, newValue, reason);
      }}
      options={options}
      popupIcon={POPUP_ICON}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          placeholder={
            !!value && Array.isArray(value) && value.length === 0
              ? placeholder
              : ''
          }
        />
      )}
      renderOption={(props, option) => {
        return (
          <Stack
            {...props}
            alignItems={'center'}
            bgcolor={'transparent'}
            component={'li'}
            flexDirection={'row'}
            gap={0.5}
            key={`${option.key}-checkbox-key`}
            px={'12px !important'}
            py={'12px !important'}
            width={'100%'}
          >
            {props?.['aria-selected'] ? (
              <Icon
                component={CheckIcon}
                key={`${option.key}-checked`}
                sx={{
                  width: 20,
                  height: 20,
                }}
              />
            ) : (
              <Icon
                component={ICON_STATIC}
                key={`${option.key}-static`}
                sx={{
                  width: 20,
                  height: 20,
                }}
              />
            )}
            <Box fontSize={14} key={`${option.key}-checkbox-key`}>
              {option.label}
            </Box>
          </Stack>
        );
      }}
      renderValue={(value, getTagProps) => {
        return value.map((option, index) => (
          <div
            {...getTagProps({ index })}
            key={`${option.key}-chip-${index}-key`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#F0F0F4',
              borderRadius: '4px',
              padding: '2px 8px',
            }}
          >
            <Icon
              component={ICON_CLOSE}
              onClick={(e: any) => {
                getTagProps({ index }).onDelete(e);
              }}
              sx={{
                width: 12,
                height: 12,
                cursor: 'pointer',
              }}
            />
            {option.label}
          </div>
        ));
      }}
      {...props}
      sx={[
        DEFAULT_AUTOCOMPLETE_SX,
        ...(Array.isArray(props?.sx) ? props.sx : [props?.sx]),
      ]}
      value={value}
    />
  );
};
