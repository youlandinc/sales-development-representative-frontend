import { FC } from 'react';
import { Box } from '@mui/material';

import { StyledTextField, StyledTextFieldProps } from '@/components/atoms';

export const CommonRenameTextField: FC<StyledTextFieldProps> = ({
  sx,
  value,
  ...rest
}) => {
  return (
    <Box height={'fit-content'} position={'relative'}>
      <Box
        component={'span'}
        display={'inline-block'}
        fontSize={20}
        fontWeight={600}
        lineHeight={1.5}
        minHeight={36}
        minWidth={'2em'}
        p={'2px 6px'}
        sx={{ opacity: 0 }}
      >
        {value as any}
      </Box>
      <StyledTextField
        sx={{
          '& .MuiOutlinedInput-input': {
            fontSize: 20,
            fontWeight: 600,
            py: '2px',
            px: '6px ',
            height: 'auto',
            lineHeight: '1.5 ',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          ...sx,
        }}
        value={value}
        {...rest}
      />
    </Box>
  );
};
