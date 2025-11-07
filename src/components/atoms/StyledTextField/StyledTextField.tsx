import {
  inputClasses,
  inputLabelClasses,
  StandardTextFieldProps,
  SxProps,
  TextField,
} from '@mui/material';
import { FC } from 'react';
import { inputBaseClasses } from '@mui/material';

export interface StyledTextFieldProps
  extends Omit<StandardTextFieldProps, 'variant'> {
  sx?: SxProps;
  disabledAutoFill?: boolean;
  variant?: 'outlined' | 'standard' | 'filled';
}

export const DEFAULT_TEXTFIELD_STYLE: SxProps = {
  width: '100%',
  padding: 0,
  //  border
  borderColor: 'border.default',
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
  },
  //border - focus
  [`& .${inputClasses.focused}`]: {
    color: 'text.focus',
  },
  [`&  .MuiOutlinedInput-root.${inputClasses.focused} .MuiOutlinedInput-notchedOutline`]:
    {
      borderColor: 'border.hover',
      borderWidth: '1px',
    },
  [`& .${inputBaseClasses.input}`]: {
    // medium
    lineHeight: 1.5,
    height: 24,
    color: 'text.primary',
    '&::placeholder': {
      color: 'text.secondary',
    },
    paddingTop: '8px',
    paddingBottom: '8px',
    fontSize: 14,
  },
  //small
  '& .MuiInputBase-inputSizeSmall': {
    paddingTop: '6px',
    paddingBottom: '6px',
    height: '20px',
  },
  //large
  '& .MuiInputBase-sizeLarge .MuiInputBase-input': {
    paddingTop: '12px',
    paddingBottom: '12px',
    fontSize: 16,
  },
  //label
  [`& .${inputLabelClasses.root}`]: {
    transform: 'translate(14px, 9px) scale(1)',
    fontSize: 14,
    lineHeight: 1.5,
  },
  [`& .${inputLabelClasses.root}.Mui-focused`]: {
    color: 'text.primary',
  },
  //label - small
  [`& .${inputLabelClasses.sizeSmall}`]: {
    transform: 'translate(14px, 5px) scale(1)',
    fontSize: 14,
  },
  //large
  '& .MuiInputLabel-sizeLarge ': {
    transform: 'translate(14px, 12px) scale(1)',
    fontSize: 16,
    lineHeight: 1.5,
  },
  //label - shrink
  [`& .${inputLabelClasses.shrink}`]: {
    transform: 'translate(14px, -8px) scale(0.75)',
    color: 'text.primary',
  },
};

export const StyledTextField: FC<StyledTextFieldProps> = ({
  onChange,
  variant = 'outlined',
  disabledAutoFill = true,
  size = 'medium',
  sx,
  ...rest
}) => {
  return (
    <TextField
      onChange={onChange}
      size={size}
      sx={[DEFAULT_TEXTFIELD_STYLE, ...(Array.isArray(sx) ? sx : [sx])]}
      variant={variant}
      {...rest}
    />
  );
};
