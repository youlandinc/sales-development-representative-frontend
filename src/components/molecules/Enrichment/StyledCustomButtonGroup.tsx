import { FC, ReactNode } from 'react';
import { Stack, SxProps } from '@mui/material';

interface StyledCustomButtonGroupProps {
  value: any;
  options: { label: ReactNode; value: any }[];
  sx?: SxProps;
  onChange: (value: any) => void;
}

export const StyledCustomButtonGroup: FC<StyledCustomButtonGroupProps> = ({
  value,
  options,
  onChange,
  sx,
}) => {
  return (
    <Stack sx={{ flexDirection: 'row', gap: 1.5, ...sx }}>
      {options.map((option, index) => (
        <Stack
          key={`${index}`}
          onClick={() => onChange(option.value)}
          sx={{
            border: '1px solid #DFDEE6',
            borderRadius: 2,
            p: 1.5,
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
