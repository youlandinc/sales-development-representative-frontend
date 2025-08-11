import { FC } from 'react';
import { Stack, SxProps } from '@mui/material';

interface StyledCustomButtonGroup {
  value: any;
  options: Option[];
  sx?: SxProps;
  onChange: (value: any) => void;
}

export const StyledCustomButtonGroup: FC<StyledCustomButtonGroup> = ({
  value,
  options,
  onChange,
  sx,
}) => {
  return (
    <Stack flexDirection={'row'} gap={1.5} sx={sx}>
      {options.map((option, index) => (
        <Stack
          border={'1px solid #DFDEE6'}
          borderRadius={2}
          key={`${option.label}-${index}`}
          onClick={() => onChange(option.value)}
          p={1.5}
          sx={{
            cursor: 'pointer',
            outline:
              option.value === value
                ? '1px solid #6E4EFB'
                : '1px solid transparent',
            borderColor: option.value === value ? '#6E4EFB' : '#DFDEE6',
            transition: 'all .2s',
          }}
        >
          {option.label}
        </Stack>
      ))}
    </Stack>
  );
};
