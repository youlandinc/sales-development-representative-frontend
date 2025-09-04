import { FC, memo } from 'react';
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
> = memo(
  ({ title, subTitle, placeholder, ...props }) => {
    return (
      <FilterContainer subTitle={subTitle} title={title}>
        <Autocomplete
          disableCloseOnSelect
          multiple
          renderInput={(params) => (
            <TextField {...params} placeholder={placeholder} />
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
                <Box fontSize={14}>{option.label}</Box>
                {props?.['aria-selected'] && <CheckIcon fontSize={'small'} />}
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
                '& .MuiAutocomplete-option': {
                  bgcolor: 'transparent !important',
                },
              },
            },
          }}
          {...props}
        />
      </FilterContainer>
    );
  },
  (prevProps, nextProps) => {
    if ((prevProps.value || []).join('') === (nextProps.value || []).join('')) {
      return true;
    }
    return false;
  },
);
