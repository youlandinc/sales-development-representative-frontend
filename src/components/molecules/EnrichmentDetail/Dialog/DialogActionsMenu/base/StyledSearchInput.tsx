import { FC } from 'react';
import { Box, InputBase, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { StyledTextField } from '@/components/atoms';

interface StyledSearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const StyledSearchInput: FC<StyledSearchInputProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
}) => {
  return (
    <StyledTextField
      size="small"
      slotProps={{
        input: {
          startAdornment: (
            <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          ),
        },
      }}
    />
  );
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: '#D0CEDA',
        borderRadius: 1,
        px: 1,
        py: 0.5,
        height: 32,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
        {/* <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} /> */}
        <StyledTextField
          slotProps={{
            input: {
              startAdornment: (
                <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              ),
            },
          }}
        />
        {/* <InputBase
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          sx={{
            flex: 1,
            fontSize: 12,
            lineHeight: 1.5,
            color: 'text.default',
            '& .MuiInputBase-input': {
              padding: 0,
              '&::placeholder': {
                color: '#B0ADBD',
                opacity: 1,
              },
            },
          }}
          value={value}
        /> */}
      </Stack>
    </Box>
  );
};
