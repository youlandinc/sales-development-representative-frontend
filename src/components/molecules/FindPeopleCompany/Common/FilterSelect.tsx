import { FC, useMemo } from 'react';
import {
  Autocomplete,
  AutocompleteProps,
  Box,
  Stack,
  TextField,
} from '@mui/material';

import { StyledChip } from '@/components/molecules';
import { FilterContainer, FilterContainerProps } from './FilterContainer';

import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

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
          <TextField
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
            <StyledChip
              {...getTagProps({ index })}
              deleteIcon={<ClearIcon />}
              key={`${option.key}-chip-${index}-key`}
              label={`${option.label}`}
              variant="filled"
            />
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
