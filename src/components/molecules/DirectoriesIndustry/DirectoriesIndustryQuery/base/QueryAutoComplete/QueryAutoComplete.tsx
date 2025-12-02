import { FC, useCallback, useId, useMemo } from 'react';
import {
  Autocomplete,
  AutocompleteChangeReason,
  Box,
  createFilterOptions,
  FilterOptionsState,
  Icon,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Check } from '@mui/icons-material';

import { StyledTextField } from '@/components/atoms';
import { UTypeOf } from '@/utils/UTypeOf';

import { PLANS_ROUTE } from '@/components/molecules/Layout/Layout.data';

import { AutoCompleteOption, useQueryAutoComplete } from './hooks';
import { QueryAutoCompleteChip } from './index';

import ICON_ARROW from './assets/icon-arrow.svg';
import ICON_CLOSE from './assets/icon-close.svg';

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
    isLoadingMore,
    onOpenToTrigger,
    onCloseToReset,
    onChangeToUpdateValue,
    onInputChangeToSearch,
    onGetOptionLabel,
    onIsOptionEqualToValue,
    onListboxScroll,
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
      // Dynamic search: API already filtered, skip client-side filtering
      // Static only: use createFilterOptions for client-side filtering
      const filtered = url
        ? opts.filter((opt) => opt.inputValue !== '__loading_more__')
        : createFilterOptions<AutoCompleteOption>()(opts, state);

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
              ? `Delete ${state.inputValue}`
              : `Add "${state.inputValue}"`,
          });
        }
      }

      // Always keep loading indicator at the end
      if (opts.some((opt) => opt.inputValue === '__loading_more__')) {
        filtered.push({
          inputValue: '__loading_more__',
          label: 'Loading more...',
        });
      }

      return filtered;
    },
    [freeSolo, isAuth, multiple, value, url],
  );

  // Special option for loading more indicator
  const LOADING_MORE_OPTION: AutoCompleteOption = useMemo(
    () => ({
      inputValue: '__loading_more__',
      label: 'Loading more...',
    }),
    [],
  );

  // When static options are filtered to empty and user can't add new values,
  // pass empty options array to trigger MUI's noOptionsText
  const displayOptions = useMemo(() => {
    // Skip if not open or loading
    if (!open || loading) {
      return options;
    }
    // Check if user can add new values (freeSolo AND authenticated)
    const canAddNewValue = freeSolo && isAuth;
    // If user can't add new values and we have static options, check filter result
    if (!canAddNewValue && !url && options.length > 0 && inputValue) {
      const filtered = createFilterOptions<AutoCompleteOption>()(options, {
        inputValue,
        getOptionLabel: (opt) => opt.label,
      });
      if (filtered.length === 0) {
        // Return empty array to trigger noOptionsText
        return [];
      }
    }
    // Add loading indicator at the end when loading more
    if (isLoadingMore) {
      return [...options, LOADING_MORE_OPTION];
    }
    return options;
  }, [
    url,
    open,
    loading,
    freeSolo,
    isAuth,
    options,
    inputValue,
    isLoadingMore,
    LOADING_MORE_OPTION,
  ]);

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

        onChangeToUpdateValue(_, normalized);
      } else {
        const normalized = UTypeOf.isString(newValue)
          ? { inputValue: newValue, label: newValue }
          : (newValue as AutoCompleteOption | null);

        onChangeToUpdateValue(_, normalized);
      }
    },
    [multiple, onChangeToUpdateValue],
  );

  const tooltipContent = (
    <Typography sx={{ fontSize: 12 }}>
      Available in the <strong>Intelligence</strong> plan.{' '}
      <Link
        href={PLANS_ROUTE}
        sx={{ color: 'inherit', textDecoration: 'underline' }}
      >
        Upgrade to access.
      </Link>
    </Typography>
  );

  const id = useId();

  return (
    <Tooltip
      arrow
      disableHoverListener
      open={!isAuth && open}
      placement="top"
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: 'rgba(97, 97, 97, 0.92)',
            maxWidth: 280,
            py: 1,
            px: 1.5,
          },
        },
        arrow: {
          sx: {
            color: 'rgba(97, 97, 97, 0.92)',
          },
        },
      }}
      title={tooltipContent}
    >
      <Box>
        <Autocomplete<
          AutoCompleteOption,
          typeof multiple,
          false,
          typeof freeSolo
        >
          clearIcon={
            <Icon
              component={ICON_CLOSE}
              sx={{ width: 14, height: 14, cursor: 'pointer' }}
            />
          }
          disableCloseOnSelect={multiple}
          filterOptions={filterOptions}
          freeSolo={freeSolo && isAuth}
          getOptionDisabled={(option) => {
            if (!isAuth) {
              return true;
            }
            return option.inputValue === '__loading_more__';
          }}
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
          options={displayOptions}
          popupIcon={
            <Icon component={ICON_ARROW} sx={{ width: 14, height: 14 }} />
          }
          renderInput={(params) => (
            <StyledTextField
              {...params}
              id={id}
              placeholder={
                (multiple && (!value || (value as string[]).length === 0)) ||
                (!multiple && !value)
                  ? placeholder
                  : ''
              }
              size={'small'}
              slotProps={{
                htmlInput: {
                  ...params.inputProps,
                  autoComplete: 'off',
                  autoCorrect: 'off',
                  autoCapitalize: 'off',
                  spellCheck: false,
                  'data-form-type': 'other',
                  'data-lpignore': 'true',
                  'data-1p-ignore': 'true',
                },
              }}
            />
          )}
          renderOption={(props, option) => {
            const { key, ...rest } = props;

            // Loading more indicator - non-clickable
            if (option.inputValue === '__loading_more__') {
              return (
                <li
                  key={key}
                  style={{
                    padding: '8px 16px',
                    fontSize: 14,
                    color: '#999',
                    textAlign: 'center',
                    cursor: 'default',
                  }}
                >
                  Loading more...
                </li>
              );
            }

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
                  const { key, onDelete } = getItemProps({
                    index,
                  }) as unknown as {
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
              onScroll: onListboxScroll,
              sx: {
                py: 0,
                maxHeight: 300,
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
              gap: 0.5,
            },
            '& .MuiInputBase-input': {
              padding: '0 !important',
              minHeight: '24px',
              fontSize: '12px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              paddingLeft: '8px !important',
            },
            '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
              py: 0.5,
            },
          }}
          value={autocompleteValue}
        />
      </Box>
    </Tooltip>
  );
};
