import { FC, useState } from 'react';
import {
  BaseSelectProps,
  //Box,
  FormControl,
  //FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
} from '@mui/material';

//import { useBreakpoints } from '@/hooks';

import { StyledTooltip } from '@/components/atoms';

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
