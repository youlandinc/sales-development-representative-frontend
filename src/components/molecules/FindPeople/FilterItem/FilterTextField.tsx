import { FC, PropsWithChildren } from 'react';

import { FilterContainer, FilterContainerProps } from './FilterContainer';
import {
  Autocomplete,
  AutocompleteProps,
  createFilterOptions,
  TextField,
} from '@mui/material';
import { StyledChip } from '@/components/molecules';

export const FilterTextField: FC<
  PropsWithChildren<
    FilterContainerProps &
      Omit<
        AutocompleteProps<any, true, false, true>,
        'renderInput' | 'onChange' | 'options'
      > & { onChange?: (newValue: string[]) => void; placeholder?: string }
  >
> = ({ title, subTitle, onChange, placeholder, ...props }) => {
  return (
    <FilterContainer subTitle={subTitle} title={title}>
      <Autocomplete
        filterOptions={(options, params) => {
          const filtered = createFilterOptions<{
            inputValue?: string;
            label: string;
          }>()(options as any, params as any);
          const { inputValue } = params;
          // Suggest the creation of a new value
          if (inputValue !== '') {
            filtered.push({
              inputValue,
              label: `Add "${inputValue}"`,
            });
          }
          return filtered as any;
        }}
        freeSolo
        multiple
        onChange={(_, newValue) => {
          const value = [
            ...(new Set(
              (newValue as any[]).map((item) => {
                if (typeof item === 'string') {
                  return item;
                }
                return item.inputValue;
              }),
            ) as unknown as string[]),
          ];
          onChange?.(value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={
              !!props?.value &&
              Array.isArray(props?.value) &&
              props?.value.length === 0
                ? placeholder
                : ''
            }
          />
        )}
        renderValue={(value, getItemProps) => {
          return value.map((item, index) => (
            <StyledChip label={item} {...getItemProps({ index })} key={index} />
          ));
        }}
        {...props}
        options={[] as string[]}
      />
    </FilterContainer>
  );
};
