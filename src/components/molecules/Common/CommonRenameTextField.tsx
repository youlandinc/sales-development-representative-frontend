import { FC } from 'react';
import { Box } from '@mui/material';

import { StyledTextField, StyledTextFieldProps } from '@/components/atoms';

export const CommonRenameTextField: FC<StyledTextFieldProps> = ({
  sx,
  value,
  ...rest
}) => {
  return (
    <Box position={'relative'}>
      <Box
        fontSize={18}
        fontWeight={600}
        height={30}
        lineHeight={1}
        minHeight={30}
        minWidth={'2em'}
        p={'4px 6px'}
        sx={{
          opacity: 0,
          boxSizing: 'border-box',
        }}
      >
        {value as any}
      </Box>
      <StyledTextField
        sx={{
          '& .MuiOutlinedInput-input': {
            fontSize: 18,
            fontWeight: 600,
            py: '4px',
            px: '6px',
            height: 'auto',
            lineHeight: 1,
            boxSizing: 'border-box',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
          '& .MuiOutlinedInput-root': {
            boxSizing: 'border-box',
            minHeight: '30px',
            height: '30px',
            py: 0,
            '& input': {
              py: '4px',
              px: '6px',
              height: 'auto',
              lineHeight: 1,
            },
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
