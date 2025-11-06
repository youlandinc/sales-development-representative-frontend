import {
  Autocomplete,
  AutocompleteProps,
  Box,
  Icon,
  Stack,
} from '@mui/material';
import { FC } from 'react';

import { FilterContainer, FilterContainerProps } from './FilterContainer';

import { StyledTextField } from '@/components/atoms';
import CheckIcon from '@mui/icons-material/Check';
import ICON_CLOSE from './assets/icon-close.svg';

export const FilterSelect: FC<
  Omit<AutocompleteProps<any, true, false, false>, 'renderInput'> &
    FilterContainerProps & { placeholder?: string }
> = ({ title, subTitle, placeholder, value, onChange, options, ...props }) => {
  // const memoOptions = useMemo(() => options, []);
  return (
    <FilterContainer subTitle={subTitle} title={title}>
      <Autocomplete
        disableCloseOnSelect
        multiple
        onChange={(_, newValue, reason) => {
          onChange?.(_, newValue, reason);
        }}
        options={options}
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
              gap={3}
              justifyContent={'space-between !important'}
              key={`${option.key}-checkbox-key`}
              width={'100%'}
            >
              <Box fontSize={14} key={`${option.key}-checkbox-key`}>
                {option.label}
              </Box>
              {props?.['aria-selected'] && (
                <CheckIcon fontSize={'small'} key={`${option.key}-checked`} />
              )}
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
                background: '#EFE9FB',
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
        slotProps={{
          listbox: {
            sx: {
              '& .MuiAutocomplete-option[aria-selected="true"]': {
                bgcolor: 'transparent',
              },
              '& .MuiAutocomplete-option[aria-selected="true"].Mui-focused': {
                bgcolor: 'action.hover',
              },
            },
          },
        }}
        {...props}
        sx={{
          '& .MuiAutocomplete-endAdornment': {
            top: 5,
            transform: 'none',
          },
          ...props?.sx,
        }}
        value={value}
      />
    </FilterContainer>
  );
};
// (prevProps, nextProps) => {
//   if (
//     JSON.stringify(prevProps.value || []) ===
//     JSON.stringify(nextProps.value || [])
//   ) {
//     return true;
//   }
//   return false;
// },
