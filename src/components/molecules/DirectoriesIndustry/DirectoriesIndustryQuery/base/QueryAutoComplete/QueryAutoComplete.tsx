import { FC, useCallback } from 'react';
import {
  Autocomplete,
  AutocompleteChangeReason,
  Box,
  createFilterOptions,
  FilterOptionsState,
  Stack,
} from '@mui/material';
import { Check } from '@mui/icons-material';

import { StyledTextField } from '@/components/atoms';
import { UTypeOf } from '@/utils/UTypeOf';

import { AutoCompleteOption, useQueryAutoComplete } from './hooks';
import { QueryAutoCompleteChip } from './index';

interface QueryAutoCompletePropsBase {
  placeholder?: string;
  url?: string | null;
  options?: Array<{ key?: string; label: string; value?: string }>;
  freeSolo?: boolean;
  isAuth?: boolean;
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

export type QueryAutoCompleteProps =
  | (QueryAutoCompletePropsMultiple & Record<string, any>)
  | (QueryAutoCompletePropsSingle & Record<string, any>);

export const QueryAutoComplete: FC<QueryAutoCompleteProps> = ({
  onFormChange,
  placeholder,
  value,
  url,
  options: staticOptions = [],
  multiple = false,
  freeSolo = true,
  isAuth = true,
  loadingText = 'searching...',
  noOptionsText = 'No option',
  ...props
}) => {
  const {
    open,
    options,
    loading,
    inputValue,
    autocompleteValue,
    onOpenToTrigger,
    onCloseToReset,
    onChangeToUpdateValue,
    onInputChangeToSearch,
    onGetOptionLabel,
    onIsOptionEqualToValue,
  } = useQueryAutoComplete({
    url,
    staticOptions,
    value,
    multiple,
    freeSolo,
    isAuth,
    onFormChange,
  });

  const filterOptions = useCallback(
    (
      opts: AutoCompleteOption[],
      state: FilterOptionsState<AutoCompleteOption>,
    ) => {
      const filtered = createFilterOptions<AutoCompleteOption>()(opts, state);

      if (freeSolo && isAuth && state.inputValue !== '') {
        const currentValues = multiple
          ? ((value as string[]) ?? [])
          : value
            ? [value as string]
            : [];
        const isAlreadySelected = currentValues.includes(state.inputValue);
        const existsInOptions = opts.some(
          (opt) =>
            opt.inputValue === state.inputValue ||
            opt.label.toLowerCase() === state.inputValue.toLowerCase(),
        );

        if (!existsInOptions) {
          filtered.push({
            inputValue: state.inputValue,
            label: isAlreadySelected
              ? `Delete "${state.inputValue}"`
              : `Add "${state.inputValue}"`,
          });
        }
      }

      return filtered;
    },
    [freeSolo, isAuth, multiple, value],
  );

  const onChangeToHandleSelection = useCallback(
    (
      _: unknown,
      newValue:
        | string
        | AutoCompleteOption
        | (string | AutoCompleteOption)[]
        | null,
      _reason: AutocompleteChangeReason,
    ) => {
      if (multiple) {
        const normalized = (newValue as (string | AutoCompleteOption)[]).map(
          (v) => (UTypeOf.isString(v) ? { inputValue: v, label: v } : v),
        );

        const lastItem = normalized[normalized.length - 1];
        if (lastItem?.label.startsWith('Delete "')) {
          const valueToDelete = lastItem.inputValue;
          const currentValues = (value as string[]) ?? [];
          const newValues = currentValues.filter((v) => v !== valueToDelete);
          (onFormChange as (v: string[]) => void)(newValues);
          return;
        }

        onChangeToUpdateValue(_, normalized);
      } else {
        const normalized = UTypeOf.isString(newValue)
          ? { inputValue: newValue, label: newValue }
          : (newValue as AutoCompleteOption | null);

        if (normalized?.label.startsWith('Delete "')) {
          (onFormChange as (v: string | null) => void)(null);
          return;
        }

        onChangeToUpdateValue(_, normalized);
      }
    },
    [multiple, value, onFormChange, onChangeToUpdateValue],
  );

  return (
    <Autocomplete<AutoCompleteOption, typeof multiple, false, typeof freeSolo>
      disableCloseOnSelect={multiple}
      filterOptions={filterOptions}
      freeSolo={freeSolo}
      getOptionDisabled={isAuth ? undefined : () => true}
      getOptionKey={(option) =>
        UTypeOf.isString(option) ? option : option.inputValue
      }
      getOptionLabel={onGetOptionLabel}
      isOptionEqualToValue={onIsOptionEqualToValue}
      loading={loading}
      loadingText={loadingText}
      multiple={multiple}
      noOptionsText={noOptionsText}
      onChange={onChangeToHandleSelection}
      onClose={onCloseToReset}
      onInputChange={onInputChangeToSearch}
      onOpen={onOpenToTrigger}
      open={open}
      options={options}
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
        const { key, ...rest } = props;
        return (
          <li key={key} {...rest}>
            <Stack
              alignItems="center"
              bgcolor="transparent"
              flexDirection="row"
              gap={3}
              justifyContent="space-between"
              width="100%"
            >
              <Box fontSize={14}>{option.label}</Box>
              {rest['aria-selected'] && <Check fontSize="small" />}
            </Stack>
          </li>
        );
      }}
      renderValue={(renderValueItems, getItemProps) => {
        if (multiple) {
          return (renderValueItems as AutoCompleteOption[]).map(
            (item, index) => {
              const { key, onDelete } = getItemProps({ index }) as unknown as {
                key: number;
                onDelete: (event: any) => void;
              };
              return (
                <QueryAutoCompleteChip
                  key={key}
                  label={item.label || item.inputValue}
                  onDelete={isAuth ? onDelete : undefined}
                />
              );
            },
          );
        }
        return null;
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 0.5,
            borderRadius: 2,
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E0E0E0',
            '& .MuiAutocomplete-noOptions': {
              fontSize: 14,
              color: 'text.secondary',
              py: 2,
              px: 2,
            },
            '& .MuiAutocomplete-loading': {
              fontSize: 14,
              color: 'text.secondary',
              py: 2,
              px: 2,
            },
          },
        },
        listbox: {
          sx: {
            py: 0,
            '& .MuiAutocomplete-option': {
              px: 2,
              py: 1,
              fontSize: 14,
              minHeight: 'auto',
            },
          },
        },
      }}
      {...props}
      inputValue={inputValue}
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
      value={autocompleteValue}
    />
  );
};
