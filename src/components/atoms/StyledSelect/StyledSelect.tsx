import { FC, useState } from 'react';
import {
  BaseSelectProps,
  //Box,
  FormControl,
  //FormHelperText,
  InputLabel,
  inputLabelClasses,
  MenuItem,
  Select,
  selectClasses,
  SxProps,
} from '@mui/material';

//import { useBreakpoints } from '@/hooks';

import { StyledTooltip } from '@/components/atoms';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

export interface StyledSelectProps extends BaseSelectProps {
  validate?: undefined | string[];
  options: TOption[];
  sxHelperText?: SxProps;
  sxList?: SxProps;
  tooltipTitle?: string;
  tooltipSx?: SxProps;
  isTooltip?: boolean;
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
  tooltipTitle = '',
  tooltipSx = { width: '100%' },
  isTooltip = false,
  //sxHelperText,
  ...rest
}) => {
  //const breakpoints = useBreakpoints();

  const [open, setOpen] = useState(false);

  return isTooltip ? (
    <StyledTooltip
      forSelectState={open}
      mode={'for-select'}
      placement={'top'}
      theme={'main'}
      title={tooltipTitle}
      tooltipSx={tooltipSx}
    >
      <FormControl
        error={!!(validate?.length && validate[0])}
        required={required}
        sx={{
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
            // transform: 'translate(14px, 8px) scale(1)',
          },
          ...sx,
        }}
        variant={'outlined'}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          disabled={disabled}
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
          MenuProps={{
            disableScrollLock: true,
          }}
          onChange={onChange}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          value={value}
          {...rest}
          // size={['xs', 'sm', 'md'].includes(breakpoints) ? 'small' : 'medium'}
        >
          {options.map((opt) => (
            <MenuItem key={opt.key} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {/*<Transitions>*/}
        {/*  {validate?.length && validate[0] && (*/}
        {/*    <FormHelperText*/}
        {/*      sx={{*/}
        {/*        p: 0,*/}
        {/*        m: 0,*/}
        {/*        fontSize: 12,*/}
        {/*        color: 'error.main',*/}
        {/*        ...sxHelperText,*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      {validate?.length*/}
        {/*        ? validate.map((item, index) => (*/}
        {/*            <Box*/}
        {/*              component={'span'}*/}
        {/*              key={item + '_' + index}*/}
        {/*              sx={{*/}
        {/*                display: 'block',*/}
        {/*                m: 0,*/}
        {/*                pl: 0.5,*/}
        {/*                '&:first-of-type': { mt: 0.5 },*/}
        {/*              }}*/}
        {/*            >*/}
        {/*              {item}*/}
        {/*            </Box>*/}
        {/*          ))*/}
        {/*        : validate*/}
        {/*          ? validate[0]*/}
        {/*          : undefined}*/}
        {/*    </FormHelperText>*/}
        {/*  )}*/}
        {/*</Transitions>*/}
      </FormControl>
    </StyledTooltip>
  ) : (
    <FormControl
      error={!!(validate?.length && validate[0])}
      required={required}
      // sx={{
      //   [disabled ? '& label' : '']: {
      //     color: 'text.disabled',
      //   },
      //   width: '100%',
      //   '& .Mui-disabled': {
      //     color: 'text.disabled',
      //     cursor: 'not-allowed',
      //   },
      //   '& .MuiInputBase-formControl': {
      //     borderRadius: 2,
      //   },
      //   '& .MuiInputLabel-formControl.Mui-focused': {
      //     color: 'text.primary',
      //   },
      //   '& .Mui-focused': {
      //     '& .MuiOutlinedInput-notchedOutline': {
      //       border: '1px solid #202939 !important',
      //     },
      //     '& .MuiOutlinedInput-input': {
      //       background: 'transparent',
      //     },
      //   },
      //   '& .MuiInputLabel-sizeMedium': {
      //     // transform: 'translate(14px, 8px) scale(1)',
      //   },
      //   '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      //     // transform:
      //     //   size === 'medium'
      //     //     ? 'translate(14px, -8px) scale(0.75)'
      //     //     : 'translate(12px, -8px) scale(0.75)',
      //   },
      //   ...sx,
      // }}
      variant={'outlined'}
    >
      <InputLabel
        size={size === 'medium' ? 'normal' : size}
        sx={{
          //large
          '&.MuiInputLabel-sizeLarge': {
            fontSize: 16,
            transform: 'translate(14px, 12px) scale(1)',
            height: 24,
          },
          [`&.${inputLabelClasses.shrink}.MuiInputLabel-sizeLarge}`]: {
            transform: 'translate(14px, -10px) scale(0.75) !important',
          },
          //medium
          transform: 'translate(14px, 10px) scale(1)',
          fontSize: 14,
          lineHeight: 1.5,
          height: 20,
          [`&.${inputLabelClasses.focused}`]: {
            color: 'text.primary',
          },
          [`&.${inputLabelClasses.shrink}}`]: {
            transform: 'translate(14px, -10px) scale(0.75)',
          },
          //sizeSmall
          [`&.${inputLabelClasses.sizeSmall}`]: {
            transform: 'translate(14px, 5px) scale(1)',
          },
          [`&.${inputLabelClasses.shrink}}`]: {
            transform: 'translate(14px, -10px) scale(0.75)',
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        disabled={disabled}
        inputProps={{
          className: size === 'large' ? 'MuiInputBase-inputSizeLarge' : '',
          sx: {
            //medium
            [`&.${selectClasses.select}`]: {
              paddingTop: '10px',
              paddingBottom: '10px',
              zIndex: 1,
              height: 20,
              minHeight: 'unset',
            },
            //small
            [`&.${outlinedInputClasses.inputSizeSmall}`]: {
              paddingTop: '6px',
              paddingBottom: '6px',
              height: 20,
            },
            //large
            '&.MuiInputBase-inputSizeLarge': {
              paddingTop: '12px',
              paddingBottom: '12px',
              fontSize: 16,
              height: 24,
            },
          },
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
        MenuProps={{
          disableScrollLock: true,
        }}
        onChange={onChange}
        size={size}
        value={value}
        {...rest}
        // size={['xs', 'sm', 'md'].includes(breakpoints) ? 'small' : 'medium'}
      >
        {options.map((opt) => (
          <MenuItem key={opt.key} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
