import {
  inputClasses,
  inputLabelClasses,
  SlotProps,
  StandardTextFieldProps,
  SxProps,
  TextField,
} from '@mui/material';
import { FC, useMemo } from 'react';

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
  slotProps,
  sx,
  ...rest
}) => {
  const mergedSlotProps: any = useMemo(
    () =>
      slotProps
        ? {
            ...slotProps,
            input: {
              ...slotProps?.input,
              sx: {
                '.MuiInputBase-inputMultiline': {
                  py: 1.5,
                },
                //border
                borderColor: 'border.default',
                borderRadius: 2,
                //border - focus
                [`&.${inputClasses.focused}`]: {
                  color: 'text.focus',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'border.hover',
                    borderWidth: '1px',
                  },
                },
                ...((slotProps?.input as any)?.sx || {}),
              },
              autoComplete: disabledAutoFill ? 'off' : '',
            },
            htmlInput: {
              ...slotProps?.htmlInput,
              autoComplete: disabledAutoFill ? 'off' : '',
              sx: {
                //medium
                lineHeight: 1.5,
                height: 24,
                color: 'red',
                '&::placeholder': {
                  color: 'text.secondary',
                },
                py: '8px',
                fontSize: 14,
                //small
                '&.MuiInputBase-inputSizeSmall': {
                  py: '6px',
                  height: 20,
                },
                ...((slotProps?.htmlInput as any)?.sx || {}),
              },
            },
            formHelperText: {
              component: 'div',
            },
            inputLabel: {
              ...slotProps?.inputLabel,
              sx: {
                //medium
                transform: 'translate(14px, 9px) scale(1)',
                fontSize: 14,
                lineHeight: 1.5,
                //small
                '&.MuiInputLabel-sizeSmall': {
                  transform: 'translate(14px, 5px) scale(1)',
                  fontSize: 14,
                },
                [`&.${inputLabelClasses.shrink}`]: {
                  transform: 'translate(14px, -8px) scale(0.75)',
                },
                ...((slotProps?.inputLabel as any)?.sx || {}),
              },
            },
          }
        : null,
    [disabledAutoFill, JSON.stringify(slotProps || {})],
  );
  console.log(mergedSlotProps);
  return (
    <TextField
      onChange={onChange}
      size={size}
      sx={{
        width: '100%',
        padding: 0,
        ...sx,
      }}
      variant={variant}
      {...rest}
      slotProps={mergedSlotProps}
    />
  );
};
