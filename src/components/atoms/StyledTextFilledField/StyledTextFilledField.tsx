import { FC } from 'react';
import { Stack, SxProps, TextFieldProps, Typography } from '@mui/material';

import { StyledTextField } from '@/components/atoms';

export const StyledTextFilledField: FC<TextFieldProps> = ({
  label,
  sx,
  ...rest
}) => {
  const { slotProps, ...otherProps } = rest || {};
  const { input, htmlInput, ...otherSlotProps } = slotProps || {};
  return (
    <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
      <Typography
        color={'#6F6C7D'}
        lineHeight={1.4}
        // position={'relative'}
        top={4}
        variant={'subtitle3'}
      >
        {label}
      </Typography>
      <StyledTextField
        slotProps={{
          input: {
            ...input,
          },
          htmlInput: htmlInput,
          ...otherSlotProps,
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
        {...otherProps}
      />
    </Stack>
  );
};
