import { FC } from 'react';
import { StandardTextFieldProps, SxProps, TextField } from '@mui/material';

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
  size = 'medium',
  ...rest
}) => {
  return (
    <TextField
      onChange={onChange}
      size={size}
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
        '& .MuiInputLabel-outlined': {
          transform: 'translate(14px, 12px) scale(1)',
        },
        '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
          transform: 'translate(14px, -8px) scale(0.75)',
        },
        '& .MuiOutlinedInput-input': {
          padding: '12.5px 14px',
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
