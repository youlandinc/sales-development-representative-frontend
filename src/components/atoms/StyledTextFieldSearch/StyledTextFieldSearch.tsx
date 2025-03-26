import { FC, useState } from 'react';
import {
  IconButton,
  InputAdornment,
  StandardTextFieldProps,
  SxProps,
} from '@mui/material';

import { StyledTextField } from '@/components/atoms';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

interface StyledTextFieldInputProps
  extends Omit<StandardTextFieldProps, 'variant'> {
  sx?: SxProps;
  disabledAutoFill?: boolean;
  variant?: 'outlined' | 'standard' | 'filled';
  handleClear?: () => void;
}

export const StyledTextFieldSearch: FC<StyledTextFieldInputProps> = ({
  handleClear,
  ...rest
}) => {
  const [focusVisible, setFocusVisible] = useState(false);

  return (
    <StyledTextField
      onBlur={() => {
        setFocusVisible(false);
      }}
      onFocus={() => {
        setFocusVisible(true);
      }}
      placeholder={focusVisible ? 'Search' : ''}
      size={'small'}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 16 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  handleClear?.();
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                sx={{ display: 'none', p: 0 }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={{
        width: focusVisible ? 340 : 200,
        transition: 'width 0.3s ease-in-out',
        '& .MuiInputBase-root:hover': {
          '& .MuiButtonBase-root': {
            display: 'flex',
          },
        },
      }}
      {...rest}
    />
  );
};
