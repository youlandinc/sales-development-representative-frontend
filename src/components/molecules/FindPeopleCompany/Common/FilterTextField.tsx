import { FC, PropsWithChildren } from 'react';
import Image from 'next/image';
import {
  Autocomplete,
  AutocompleteProps,
  createFilterOptions,
  TextField,
} from '@mui/material';
import { createUseStyles } from 'react-jss';

import { FilterContainer, FilterContainerProps } from './index';

const useChipStyle = createUseStyles({
  container: {
    height: '22px',
    maxWidth: '160px',
    padding: '0 8px',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#F7F4FD',
  },
  buttonWrap: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'rgba(213, 203, 251, 0.50)',
    },
  },
  button: {
    width: '12px',
    height: '12px',
    position: 'relative',
  },
  content: {
    fontSize: 12,
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export const FilterTextField: FC<
  PropsWithChildren<
    FilterContainerProps &
      Omit<
        AutocompleteProps<any, true, false, true>,
        'renderInput' | 'onChange' | 'options'
      > & { onChange?: (newValue: string[]) => void; placeholder?: string }
  >
> = ({ title, subTitle, onChange, placeholder, value, ...props }) => {
  const controlledValue = value ?? [];
  const classes = useChipStyle();

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
              Array.isArray(controlledValue) && controlledValue.length === 0
                ? placeholder
                : ''
            }
          />
        )}
        renderValue={(value, getItemProps) => {
          return value.map((item, index) => {
            const { onDelete } = getItemProps({ index });
            return (
              <div className={classes.container} key={`${index}-${item}`}>
                <div
                  className={classes.buttonWrap}
                  onClick={(e) => onDelete(e)}
                >
                  <div className={classes.button}>
                    <Image
                      alt={''}
                      fill
                      sizes={'100%'}
                      src={'/images/icon-close.svg'}
                    />
                  </div>
                </div>
                <div className={classes.content}>{item}</div>
              </div>
            );
          });
        }}
        sx={{
          '& .MuiInputBase-root': {
            minHeight: '32px',
            padding: '4px 9px !important',
            gap: 1,
          },
          '& .MuiInputBase-input': {
            padding: '0 !important',
            minHeight: '24px',
            fontSize: '12px',
          },
          '& .MuiAutocomplete-endAdornment': {
            position: 'absolute',
            top: '16px !important',
            right: '8px !important',
          },
          '& .MuiAutocomplete-clearIndicator': {
            visibility: 'visible !important',
          },
        }}
        {...props}
        options={[] as string[]}
        value={controlledValue}
      />
    </FilterContainer>
  );
};
