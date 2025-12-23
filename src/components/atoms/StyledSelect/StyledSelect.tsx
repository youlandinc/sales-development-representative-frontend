import { FC, ReactNode, useState } from 'react';
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

import { Clear } from '@mui/icons-material';
import ICON_ARROW from './assets/icon_arrow.svg';

export interface StyledSelectProps extends BaseSelectProps {
  validate?: undefined | string[];
  options: TOption[];
  sxHelperText?: SxProps;
  sxList?: SxProps;
  menuPaperSx?: SxProps;
  tooltipTitle?: string;
  tooltipSx?: SxProps;
  isTooltip?: boolean;
  placeholder?: string;
  clearable?: boolean;
  clearIcon?: ReactNode;
  onClear?: () => void;
  loading?: boolean;
  loadOptions?: () => Promise<void>;
  renderOption?: (option: TOption, index: number) => ReactNode;
}

export const StyledSelect: FC<StyledSelectProps> = ({
  options = [],
  validate,
  value = '',
  onChange,
  label,
  disabled,
  sxList,
  menuPaperSx,
  sx,
  size,
  required,
  //tooltipTitle = '',
  //tooltipSx = { width: '100%' },
  //isTooltip = false,
  placeholder,
  clearable = false,
  clearIcon,
  onClear,
  loading,
  loadOptions,
  renderOption,
  onOpen,
  IconComponent,
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
            '&.MuiInputLabel-sizeSmall': {
              transform: 'translate(14px, -8px) scale(0.75)',
            },
            transform: 'translate(14px, -9px) scale(0.75)',
            color: 'text.primary',
          },
          '& .MuiSelect-outlined': {
            py: '9.5px',
            fontSize: 14,
            lineHeight: 1.5,
          },
          '& legend': {
            fontSize: 14 * 0.75,
          },
          '& .MuiInputBase-sizeSmall ': {
            '& .MuiSelect-outlined': {
              py: '7px',
              pl: '14px',
              fontSize: 12,
              lineHeight: 1.5,
            },
            '& legend': {
              fontSize: 12 * 0.75,
            },
          },
          '& .MuiInputBase-sizeLarge': {
            '& .MuiSelect-outlined': {
              py: '12px',
              fontSize: 16,
              lineHeight: 1.5,
            },
            '& legend': {
              fontSize: 16 * 0.75,
            },
          },
          //label
          '& .MuiInputLabel-root': {
            transform: 'translate(14px, 9.5px) scale(1)',
            fontSize: 14,
            lineHeight: 1.5,
          },
          //label - small
          [`& .${inputLabelClasses.sizeSmall}`]: {
            transform: 'translate(14px, 7px) scale(1)',
            fontSize: 12,
            lineHeight: 1.5,
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
        displayEmpty
        endAdornment={
          clearable &&
          showClear &&
          !!value && (
            <InputAdornment
              onClick={() => {
                onClear?.();
              }}
              position={'end'}
              sx={{ mr: 1.75, cursor: 'pointer' }}
            >
              {clearIcon || <Clear sx={{ fontSize: 20 }} />}
            </InputAdornment>
          )
        }
        IconComponent={
          IconComponent ||
          ((props) => <ICON_ARROW style={{ marginRight: '2px' }} {...props} />)
        }
        id="styled-select"
        inputProps={{
          MenuProps: {
            MenuListProps: {
              sx: [
                {
                  p: 0,
                  m: 0,
                  '& .MuiMenuItem-root:hover': {
                    bgcolor: '#F4F5F9 !important',
                  },
                  '& .Mui-selected': {
                    bgcolor: '#F0F0F4 !important',
                  },
                  '& .Mui-selected:hover': {
                    bgcolor: '#F0F0F4 !important',
                  },
                  '& .MuiMenuItem-root': {
                    fontSize: 14,
                    color: 'text.primary',
                    p: 1.5,
                  },
                },
                ...(Array.isArray(sxList) ? sxList : [sxList]),
              ],
            },
            PaperProps: {
              style: { marginTop: 12, borderRadius: 8 },
              sx: menuPaperSx,
            },
          },
        }}
        label={label}
        labelId="styled-select-label"
        MenuProps={{
          disableScrollLock: true,
        }}
        onChange={onChange}
        onOpen={async (e) => {
          onOpen?.(e);
          await loadOptions?.();
        }}
        renderValue={(value) => {
          if (!value) {
            return (
              <Typography color={'text.secondary'} variant={'body2'}>
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
          options.map((opt, i) =>
            renderOption ? (
              renderOption(opt, i)
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
