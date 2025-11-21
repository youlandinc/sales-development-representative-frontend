import { FC, useState } from 'react';
import {
  BaseSelectProps,
  FormControl,
  Icon,
  InputAdornment,
  InputLabel,
  inputLabelClasses,
  MenuItem,
  Select,
  SxProps,
  Typography,
} from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';

export interface StyledSelectProps extends BaseSelectProps {
  validate?: undefined | string[];
  options: TOption[];
  sxHelperText?: SxProps;
  sxList?: SxProps;
  tooltipTitle?: string;
  tooltipSx?: SxProps;
  isTooltip?: boolean;
  placeholder?: string;
  clearable?: boolean;
  onClear?: () => void;
  loading?: boolean;
  loadOptions?: () => Promise<void>;
  renderOption?: (option: TOption) => React.ReactNode;
}

export const StyledSelect: FC<StyledSelectProps> = ({
  options = [],
  validate,
  value = '',
  onChange,
  label,
  disabled,
  sxList,
  sx,
  size,
  required,
  //tooltipTitle = '',
  //tooltipSx = { width: '100%' },
  //isTooltip = false,
  placeholder,
  clearable = false,
  onClear,
  loading,
  loadOptions,
  renderOption,
  ...rest
  //sxHelperText,
}) => {
  //const breakpoints = useBreakpoints();

  const [showClear, setShowClear] = useState(false);

  return (
    <FormControl
      error={!!(validate?.length && validate[0])}
      onMouseEnter={() => {
        setShowClear(true);
      }}
      onMouseLeave={() => {
        setShowClear(false);
      }}
      onMouseOver={() => {
        setShowClear(true);
      }}
      required={required}
      size={size}
      sx={[
        {
          [disabled ? '& label' : '']: {
            color: 'text.disabled',
          },
          width: '100%',
          '& .Mui-disabled': {
            color: 'text.disabled',
            cursor: 'not-allowed',
          },
          '& .MuiInputBase-formControl': {
            borderRadius: 2,
          },
          '& .MuiInputLabel-formControl.Mui-focused': {
            color: 'text.primary',
          },
          '& .Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #202939 !important',
            },
            '& .MuiOutlinedInput-input': {
              background: 'transparent',
            },
          },
          '& .MuiInputLabel-sizeMedium': {
            transform: 'translate(14px, 8px) scale(1)',
          },
          '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
            transform:
              size === 'medium'
                ? 'translate(14px, -8px) scale(0.75)'
                : 'translate(12px, -8px) scale(0.75)',
            color: 'text.primary',
          },
          '& .MuiSelect-outlined': {
            py: '9.5px',
            fontSize: 14,
            lineHeight: 1.5,
          },
          '& .MuiInputBase-sizeSmall .MuiSelect-outlined': {
            py: '7px',
            fontSize: 12,
            lineHeight: 1.5,
          },
          '& .MuiInputBase-sizeLarge .MuiSelect-outlined': {
            py: '12px',
            fontSize: 16,
            lineHeight: 1.5,
          },
          //label
          '& .MuiInputLabel-root': {
            transform: 'translate(14px, 9px) scale(1)',
            fontSize: 14,
            lineHeight: 1.5,
          },
          //label - small
          [`& .${inputLabelClasses.sizeSmall}`]: {
            transform: 'translate(14px, 5px) scale(1)',
          },
          //large
          '& .MuiInputLabel-sizeLarge ': {
            transform: 'translate(14px, 12px) scale(1)',
            fontSize: 16,
            lineHeight: 1.5,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      variant={'outlined'}
    >
      <InputLabel id="styled-select-label">{label}</InputLabel>
      <Select
        disabled={disabled}
        // displayEmpty
        endAdornment={
          clearable &&
          showClear &&
          !!value && (
            <InputAdornment position="end" sx={{ mr: 3, cursor: 'pointer' }}>
              <ClearIcon
                onClick={() => {
                  onClear?.();
                }}
                sx={{ fontSize: 20 }}
              />
            </InputAdornment>
          )
        }
        id="styled-select"
        inputProps={{
          MenuProps: {
            MenuListProps: {
              sx: {
                p: 0,
                m: 0,
                '& .MuiMenuItem-root:hover': {
                  bgcolor: 'rgba(144, 149, 163, 0.1) !important',
                },
                '& .Mui-selected': {
                  bgcolor: '#EFE9FB !important',
                },
                '& .Mui-selected:hover': {
                  bgcolor: '#EFE9FB !important',
                },
                '& .MuiMenuItem-root': {
                  fontSize: 14,
                  color: 'text.primary',
                  p: 1.5,
                },
                ...sxList,
              },
            },
            PaperProps: {
              style: { marginTop: 12, borderRadius: 8 },
            },
          },
        }}
        label={label}
        labelId="styled-select-label"
        MenuProps={{
          disableScrollLock: true,
        }}
        onChange={onChange}
        onOpen={async () => {
          await loadOptions?.();
        }}
        renderValue={(value) => {
          if (!value) {
            return (
              <Typography
                color={'text.secondary'}
                sx={{ opacity: 0.7 }}
                variant={'body2'}
              >
                {placeholder}
              </Typography>
            );
          }
          return options.find((opt) => opt.value === value)?.label;
        }}
        size={size}
        value={value}
        {...rest}
        // size={['xs', 'sm', 'md'].includes(breakpoints) ? 'small' : 'medium'}
      >
        {!loading &&
          options.map((opt) =>
            renderOption ? (
              renderOption(opt)
            ) : (
              <MenuItem
                disabled={opt.disabled}
                key={opt.key}
                sx={{ gap: 1 }}
                value={opt.value}
              >
                {opt.icon && (
                  <Icon component={opt.icon} sx={{ width: 16, height: 16 }} />
                )}
                {opt.label}
              </MenuItem>
            ),
          )}
      </Select>
    </FormControl>
  );
};
