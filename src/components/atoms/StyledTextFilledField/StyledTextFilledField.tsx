import { FC } from 'react';
import {
  InputAdornment,
  Stack,
  SxProps,
  TextFieldProps,
  Typography,
} from '@mui/material';

import { StyledTextField } from '@/components/atoms';

export const StyledTextFilledField: FC<TextFieldProps> = ({
  label,
  sx,
  ...rest
}) => {
  return (
    <Stack alignItems={'flex-start'} flexDirection={'row'} gap={1.25}>
      <StyledTextField
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  color={'#6F6C7D'}
                  lineHeight={1.4}
                  variant={'subtitle3'}
                >
                  {label}
                </Typography>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiInputBase-input': {
            p: '0 0 8px',
            fontSize: 12,
          },
          '& .MuiInputAdornment-root': {
            alignItems: 'flex-start',
            mr: 1.25,
          },
          ...(sx as SxProps),
        }}
        variant={'standard'}
        {...rest}
      />
    </Stack>
  );
};
