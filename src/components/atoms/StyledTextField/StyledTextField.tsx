import { FC } from 'react';
import { SxProps, TextField, StandardTextFieldProps } from '@mui/material';

import { useBreakpoints } from '@/hooks';

export interface StyledTextFieldProps
  extends Omit<StandardTextFieldProps, 'variant'> {
  sx?: SxProps;
  disabledAutoFill?: boolean;
  variant?: 'outlined' | 'standard' | 'filled';
}

export const StyledTextField: FC<StyledTextFieldProps> = ({
  sx,
  onChange,
  variant = 'outlined',
  disabledAutoFill = true,
  ...rest
}) => {
  const breakpoints = useBreakpoints();

  return (
    <TextField
      slotProps={{
        input: {
          ...rest.slotProps?.input,
          autoComplete: disabledAutoFill ? 'off' : '',
        },
        htmlInput: {
          ...rest.slotProps?.htmlInput,
          autoComplete: disabledAutoFill ? 'off' : '',
        },
        formHelperText: {
          component: 'div',
        },
      }}
      onChange={onChange}
      sx={{
        width: '100%',
        borderRadius: 2,
        padding: 0,
        '& label.Mui-focused': {
          color: 'text.focus',
          '& span': {
            color: 'text.focus',
          },
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          boxShadow: 'none',
          input: {
            '&::placeholder': {
              color: 'text.placeholder',
            },
            color: 'text.primary',
            lineHeight: 1,
          },
          '& fieldset': {
            borderColor: 'background.border_default',
          },
          '&:hover fieldset': {
            borderColor: 'background.border_hover',
            color: 'background.border_hover',
          },
          '&.Mui-focused fieldset': {
            border: '1px solid',
            borderColor: 'background.border_focus',
          },
        },
        '& .Mui-disabled.MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'background.border_disabled',
          },
        },
        '& .Mui-disabled': {
          cursor: 'not-allowed',
          '&:hover fieldset': {
            borderColor: 'background.border_default',
          },
        },
        '& .MuiFormHelperText-root': {
          margin: 0,
          fontSize: 12,
        },
        ...sx,
      }}
      variant={variant}
      {...rest}
    />
  );
};
