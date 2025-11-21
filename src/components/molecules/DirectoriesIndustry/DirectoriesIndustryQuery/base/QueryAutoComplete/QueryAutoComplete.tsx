import { FC } from 'react';
import { Autocomplete, Box, createFilterOptions, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { StyledTextField } from '@/components/atoms';

import { useQueryAutoComplete } from './hooks';
import { QueryAutoCompleteChip } from './index';

type AutoCompleteOption = {
  inputValue?: string;
  label: string;
};

interface QueryAutoCompletePropsBase {
  title?: string;
  subTitle?: string;
  placeholder?: string;
  url?: string | null;
  options?: Array<
    { key?: string; label: string; value?: string } | AutoCompleteOption
  >;
  freeSolo?: boolean;
  loadingText?: string;
  noOptionsText?: string;
}

interface QueryAutoCompletePropsMultiple extends QueryAutoCompletePropsBase {
  multiple: true;
  value?: string[];
  onFormChange: (newValue: string[]) => void;
}

interface QueryAutoCompletePropsSingle extends QueryAutoCompletePropsBase {
  multiple?: false;
  value?: string | null;
  onFormChange: (newValue: string | null) => void;
}

interface AdditionalAutocompleteProps {
  disabled?: boolean;
  readOnly?: boolean;
  sx?: any;
  className?: string;
  id?: string;
  [key: string]: any;
}

export type QueryAutoCompleteProps =
  | (QueryAutoCompletePropsMultiple & AdditionalAutocompleteProps)
  | (QueryAutoCompletePropsSingle & AdditionalAutocompleteProps);

export const QueryAutoComplete: FC<QueryAutoCompleteProps> = ({
  onFormChange,
  placeholder,
  value,
  url,
  options: staticOptions = [],
  multiple,
  freeSolo = true,
  loadingText = 'searching...',
  noOptionsText = 'No option',
  ...props
}) => {
  const {
    options: internalOptions,
    loading,
    autocompleteValue,
    onValueChange,
    onInputValueChange,
    onGetOptionLabel,
    onIsOptionEqualToValue,
  } = useQueryAutoComplete({
    url,
    staticOptions,
    value,
    multiple,
    onFormChange,
  });

  return (
    <Autocomplete
      disableCloseOnSelect
      filterOptions={(options, params) => {
        const filtered = createFilterOptions<AutoCompleteOption>()(
          options as AutoCompleteOption[],
          params,
        );
        const { inputValue } = params;
        // 只有在允许自定义输入时才添加 "Add" 选项
        if (freeSolo && inputValue !== '') {
          filtered.push({
            inputValue,
            label: `Add "${inputValue}"`,
          });
        }
        return filtered;
      }}
      freeSolo={freeSolo}
      getOptionLabel={onGetOptionLabel}
      isOptionEqualToValue={onIsOptionEqualToValue}
      loading={loading}
      loadingText={loadingText}
      multiple={multiple}
      noOptionsText={noOptionsText}
      onChange={onValueChange}
      onInputChange={onInputValueChange}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          placeholder={
            (multiple && (!value || (value as string[]).length === 0)) ||
            (!multiple && !value)
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
            key={`${option.inputValue}-checkbox-key`}
            width={'100%'}
          >
            <Box fontSize={14} key={`${option.inputValue}-checkbox-key`}>
              {option.label}
            </Box>
            {props?.['aria-selected'] && (
              <CheckIcon
                fontSize={'small'}
                key={`${option.inputValue}-checked`}
              />
            )}
          </Stack>
        );
      }}
      renderValue={(tagValue: any, getTagProps: any) => {
        if (multiple) {
          return tagValue.map((item: AutoCompleteOption, index: number) => {
            const { key, onDelete } = getTagProps({ index });
            return (
              <QueryAutoCompleteChip
                key={key}
                label={item.label || item.inputValue || ''}
                onDelete={onDelete}
              />
            );
          });
        }
        return tagValue;
      }}
      sx={{
        '& .MuiInputBase-root': {
          minHeight: '32px',
          padding: '4px 9px !important',
          gap: 0.5,
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
      }}
      {...props}
      options={internalOptions}
      value={autocompleteValue as any}
    />
  );
};
