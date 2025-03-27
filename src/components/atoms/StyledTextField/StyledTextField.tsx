import { FC } from 'react';
import {
  InputBaseComponentProps,
  inputLabelClasses,
  InputLabelProps,
  outlinedInputClasses,
  StandardTextFieldProps,
  SxProps,
  TextField,
} from '@mui/material';

export interface StyledTextFieldProps
  extends Omit<StandardTextFieldProps, 'variant'> {
  sx?: SxProps;
  disabledAutoFill?: boolean;
  variant?: 'outlined' | 'standard' | 'filled';
}

export const StyledTextField: FC<StyledTextFieldProps> = ({
  onChange,
  variant = 'outlined',
  disabledAutoFill = true,
  size = 'medium',
  ...rest
}) => {
  const { slotProps = {} } = rest;
  const { htmlInput = {}, inputLabel = {} } = slotProps;
  const { sx: htmlInputSx = {}, ...htmlInputRest } =
    htmlInput as InputBaseComponentProps;
  const { sx: inputLabelSx = {}, ...inputLabelRest } =
    inputLabel as InputLabelProps;

  return (
    <TextField
      onChange={onChange}
      size={size}
      slotProps={{
        inputLabel: {
          sx: {
            color: 'text.primary',
            fontSize: 14,
            lineHeight: 1.5,
            //medium
            transform: 'translate(14px, 10px) scale(1)',
            '&.Mui-focused': {
              color: 'text.primary',
            },
            [`&.${inputLabelClasses.shrink}`]: {
              transform: 'translate(14px, -8px) scale(0.75)',
            },
            //large
            '&.MuiInputLabel-sizeLarge': {
              fontSize: 16,
              lineHeight: 1.5,
              transform: 'translate(14px, 12px) scale(1)',
            },
            [`&.${inputLabelClasses.shrink}.MuiInputLabel-sizeLarge`]: {
              fontSize: 16,
              lineHeight: 1.5,
              transform: 'translate(14px, -10px) scale(0.75)',
            },
            //small

            [`&.${inputLabelClasses.sizeSmall}`]: {
              fontSize: 14,
              lineHeight: 1.5,
              transform: 'translate(12px, 5px) scale(1)',
            },
            [`&.${inputLabelClasses.shrink}.${inputLabelClasses.sizeSmall}`]: {
              fontSize: 14,
              lineHeight: 1.5,
              transform: 'translate(12px, -9px) scale(0.75)',
            },
            ...inputLabelSx,
          },
          ...inputLabelRest,
        },

        htmlInput: {
          autoComplete: disabledAutoFill ? 'off' : '',
          sx: {
            //medium
            paddingTop: '10px',
            paddingBottom: '10px',
            zIndex: 1,

            //small
            [`&.${outlinedInputClasses.inputSizeSmall}`]: {
              paddingTop: '6px',
              paddingBottom: '6px',
            },
            //large
            ['&.MuiInputBase-sizeLarge']: {
              paddingTop: '12px',
              paddingBottom: '12px',
              fontSize: 16,
            },
            color: 'text.primary',
            lineHeight: 1.5,
            fontSize: 14,
            ...htmlInputSx,
          },
          ...htmlInputRest,
        },
        formHelperText: {
          component: 'div',
        },
      }}
      variant={variant}
      {...rest}
    />
  );
};
