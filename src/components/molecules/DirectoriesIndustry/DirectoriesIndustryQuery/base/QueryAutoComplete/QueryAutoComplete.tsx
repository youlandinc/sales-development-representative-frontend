import { FC, Fragment, ReactNode, useCallback, useId, useMemo } from 'react';
import {
  Autocomplete,
  AutocompleteChangeReason,
  Box,
  CircularProgress,
  createFilterOptions,
  Divider,
  FilterOptionsState,
  Icon,
  Tooltip,
  Typography,
} from '@mui/material';

import { StyledImage, StyledTextField } from '@/components/atoms';
import { UTypeOf } from '@/utils/UTypeOf';

import { AutoCompleteOption, useQueryAutoComplete } from './hooks';
import { QueryAutoCompleteChip } from './index';
import { QUERY_TOOLTIP_SLOT_PROPS, QueryTooltipAccessTitle } from '../index';

import ICON_ARROW from './assets/icon-arrow.svg';
import ICON_CLOSE from './assets/icon-close.svg';

const LOADING_MORE_OPTION: AutoCompleteOption = {
  inputValue: '__loading_more__',
  key: '__loading_more__',
  label: '',
};

const CLEAR_ICON = (
  <Icon
    component={ICON_CLOSE}
    sx={{ width: 14, height: 14, cursor: 'pointer' }}
  />
);

const POPUP_ICON = (
  <Icon component={ICON_ARROW} sx={{ width: 14, height: 14 }} />
);

const LOADING_SPINNER = (
  <CircularProgress size="20px" sx={{ color: '#D0CEDA' }} />
);

const OPTION_BASE_SX = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  fontSize: 14,
  gap: 1,
  '&.MuiAutocomplete-option[aria-selected="true"]:not(.Mui-focused)': {
    bgcolor: 'transparent !important',
  },
  '&.Mui-focused': {
    bgcolor: '#F4F5F9 !important',
  },
} as const;

const TICK_ICON_SX = {
  width: 16,
  height: 16,
  position: 'relative',
  flexShrink: 0,
} as const;

interface QueryAutoCompletePropsBase {
  placeholder?: string;
  url?: string | null;
  options?: Array<{ key: string; label: string; value?: string }>;
  freeSolo?: boolean;
  isAuth?: boolean;
  noOptionsText?: string;
  requestParams?: Record<string, string[]>; // Cascade params: { state: ["CA", "NY"] }
  isShowRemark?: boolean;
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
  | (QueryAutoCompletePropsMultiple & Record<string, unknown>)
  | (QueryAutoCompletePropsSingle & Record<string, unknown>);

export const QueryAutoComplete: FC<QueryAutoCompleteProps> = ({
  onFormChange,
  placeholder,
  value,
  url,
  options: staticOptions = [],
  multiple = false,
  freeSolo = true,
  isAuth = true,
  noOptionsText = 'No option',
  requestParams,
  isShowRemark = false,
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
    requestParams,
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
        const isExistingInOptions = opts.some(
          (opt) =>
            opt.inputValue === state.inputValue ||
            opt.label.toLowerCase() === state.inputValue.toLowerCase(),
        );

        if (!isExistingInOptions) {
          filtered.push({
            inputValue: state.inputValue,
            key: state.inputValue,
            label: isAlreadySelected
              ? `Delete ${state.inputValue}`
              : `Add "${state.inputValue}"`,
          });
        }
      }

      // Always keep loading indicator at the end
      if (opts.some((opt) => opt.inputValue === '__loading_more__')) {
        filtered.push(LOADING_MORE_OPTION);
      }

      return filtered;
    },
    [freeSolo, isAuth, multiple, value, url],
  );

  const displayOptions = useMemo(() => {
    if (!open || loading) {
      return options;
    }
    if (!(freeSolo && isAuth) && !url && options.length > 0 && inputValue) {
      const filtered = createFilterOptions<AutoCompleteOption>()(options, {
        inputValue,
        getOptionLabel: (opt) => opt.label,
      });
      if (filtered.length === 0) {
        return [];
      }
    }
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
          (v) =>
            UTypeOf.isString(v) ? { inputValue: v, label: v, key: v } : v,
        );

        onChangeToUpdateValue(_, normalized);
      } else {
        const normalized = UTypeOf.isString(newValue)
          ? { inputValue: newValue, label: newValue, key: newValue }
          : (newValue as AutoCompleteOption | null);

        onChangeToUpdateValue(_, normalized);
      }
    },
    [multiple, onChangeToUpdateValue],
  );

  const id = useId();

  return (
    <Tooltip
      arrow
      disableHoverListener
      open={!isAuth && open}
      placement={'top'}
      slotProps={QUERY_TOOLTIP_SLOT_PROPS}
      title={<QueryTooltipAccessTitle />}
    >
      <Box>
        <Autocomplete<
          AutoCompleteOption,
          typeof multiple,
          false,
          typeof freeSolo
        >
          clearIcon={CLEAR_ICON}
          disableCloseOnSelect={multiple}
          filterOptions={filterOptions}
          freeSolo={freeSolo && isAuth}
          getOptionDisabled={(option) =>
            !isAuth || option.inputValue === '__loading_more__'
          }
          getOptionKey={(option) =>
            UTypeOf.isString(option) ? option : option.inputValue
          }
          getOptionLabel={onGetOptionLabel}
          isOptionEqualToValue={onIsOptionEqualToValue}
          loading={loading}
          loadingText={LOADING_SPINNER}
          multiple={multiple}
          noOptionsText={noOptionsText}
          onChange={onChangeToHandleSelection}
          onClose={onCloseToReset}
          onInputChange={onInputChangeToSearch}
          onOpen={onOpenToTrigger}
          open={open}
          options={displayOptions}
          popupIcon={POPUP_ICON}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              id={id}
              name={`notaform-${id}`}
              placeholder={
                !value || (Array.isArray(value) && value.length === 0)
                  ? placeholder
                  : ''
              }
              size={'small'}
              slotProps={{
                htmlInput: {
                  ...params.inputProps,
                  autoComplete: 'new-password',
                  'data-form-type': 'other',
                  'data-lpignore': 'true',
                  'aria-autocomplete': 'none',
                },
              }}
            />
          )}
          renderOption={(props, option, state) => {
            const { key, ...rest } = props;

            if (option.inputValue === '__loading_more__') {
              return (
                <Box
                  component="li"
                  key={option.label}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 1,
                    px: 2,
                    cursor: 'default',
                  }}
                >
                  {LOADING_SPINNER}
                </Box>
              );
            }

            const isSelected = props['aria-selected'] === true;

            const nextOption =
              state.index < displayOptions.length - 1
                ? displayOptions[state.index + 1]
                : null;
            const isRegion = option.remark?.toLowerCase() === 'region';
            const nextIsRegion = nextOption?.remark?.toLowerCase() === 'region';
            const isLastInRegionGroup =
              !inputValue &&
              isShowRemark &&
              isRegion &&
              nextOption &&
              nextOption.inputValue !== '__loading_more__' &&
              !nextIsRegion;

            return (
              <Fragment key={key}>
                <Box component="li" {...rest} sx={OPTION_BASE_SX}>
                  {option.label}
                  {isSelected && (
                    <StyledImage
                      sx={{
                        ...TICK_ICON_SX,
                        ml: isShowRemark ? 0.25 : 'auto',
                      }}
                      url={'/images/icon-tick.svg'}
                    />
                  )}
                  {isShowRemark && option.remark && (
                    <Typography
                      sx={{
                        ml: 'auto',
                        flexShrink: 0,
                        fontSize: 12,
                        color: '#B0ADBD',
                      }}
                    >
                      {option.remark}
                    </Typography>
                  )}
                </Box>
                {isLastInRegionGroup && (
                  <Divider sx={{ mx: 2, borderColor: '#F0F0F4' }} />
                )}
              </Fragment>
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
                    onDelete: () => void;
                  };
                  return (
                    <QueryAutoCompleteChip
                      key={key}
                      label={item.label || item.inputValue}
                      onDelete={isAuth ? onDelete : undefined}
                    />
                  ) as ReactNode;
                },
              );
            }
            return null;
          }}
          slotProps={{
            paper: {
              sx: {
                my: 0.5,
                borderRadius: 2,
                boxShadow: '0px 0px 6px 0px rgba(54, 52, 64, 0.14)',
                border: '1px solid #E9E9EF',
                bgcolor: '#fff',
                '& .MuiAutocomplete-noOptions,& .MuiAutocomplete-loading': {
                  height: 56,
                  display: 'flex',
                  fontSize: 14,
                  color: 'text.secondary',
                  alignItems: 'center',
                },
                '& .MuiAutocomplete-loading': {
                  justifyContent: 'center',
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
              gap: '4px 6px',
              '&:hover': {
                bgcolor: 'background.active',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'border.default',
                },
              },
            },
            '& .MuiInputBase-input': {
              padding: '0 !important',
              minHeight: '22px',
              fontSize: '12px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              pl: '-2px',
            },
            '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
              py: 0.5,
              pl: 1.75,
              pr: 1,
            },
            // When chips are present, reduce left padding and reserve space for endAdornment icons
            '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall:has(.query-autocomplete-chip)':
              {
                py: 0.5,
                pl: 0.75,
                pr: freeSolo ? 3.25 : 5.5,
              },
          }}
          value={autocompleteValue}
        />
      </Box>
    </Tooltip>
  );
};
