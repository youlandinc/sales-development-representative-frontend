import { FC, ReactNode, useState } from 'react';
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  SxProps,
  Typography,
} from '@mui/material';
import { Clear } from '@mui/icons-material';

import { PanelIcon } from '../../PanelIcon';

export interface FilterSelectOption {
  label: string;
  value: string;
  key: string;
  icon?: ReactNode;
}

interface FilterSelectProps {
  options: FilterSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
  sx?: SxProps;
  clearable?: boolean;
  showIcon?: boolean;
}

export const FilterSelect: FC<FilterSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select',
  disabled = false,
  size = 'small',
  sx,
  clearable = false,
  showIcon = true,
}) => {
  const [showClear, setShowClear] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const onSelectChange = (e: SelectChangeEvent<string>) => {
    onChange(e.target.value);
  };

  const onClearSelect = () => {
    onChange('');
  };

  return (
    <FormControl
      disabled={disabled}
      onMouseEnter={() => setShowClear(true)}
      onMouseLeave={() => setShowClear(false)}
      size={size}
      sx={[
        {
          minWidth: 120,
          '& .MuiInputBase-formControl': {
            borderRadius: 2,
            bgcolor: '#fff',
          },
          '& .MuiSelect-outlined': {
            py: '7px',
            pl: '14px',
            fontSize: 12,
            lineHeight: 1.5,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(210, 214, 225, 0.60)',
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #202939 !important',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      variant="outlined"
    >
      <Select
        displayEmpty
        endAdornment={
          clearable &&
          showClear &&
          !!value && (
            <InputAdornment
              onClick={onClearSelect}
              position="end"
              sx={{ mr: 1.75, cursor: 'pointer' }}
            >
              <Clear sx={{ fontSize: 16 }} />
            </InputAdornment>
          )
        }
        IconComponent={(props) => (
          <PanelIcon.FilterArrowRaw
            style={{ marginRight: '2px', height: 16, width: 16 }}
            {...props}
          />
        )}
        inputProps={{
          MenuProps: {
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            MenuListProps: {
              sx: {
                p: 0,
                m: 0,
                minWidth: 300,
                '& .MuiMenuItem-root:hover': {
                  bgcolor: '#F4F5F9 !important',
                },
                '& .Mui-selected': {
                  bgcolor: 'transparent !important',
                },
                '& .Mui-selected:hover': {
                  bgcolor: ' !important',
                },
                '& .MuiMenuItem-root': {
                  fontSize: 14,
                  color: 'text.primary',
                  px: 1,
                  py: 0.5,
                  height: 36,
                },
              },
            },
            PaperProps: {
              style: { marginTop: 12, borderRadius: 8 },
            },
          },
        }}
        MenuProps={{
          disableScrollLock: true,
        }}
        onChange={onSelectChange}
        renderValue={(val) => {
          if (!val) {
            return (
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                {placeholder}
              </Typography>
            );
          }
          return (
            <Stack
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 0.5,
                fontSize: 14,
              }}
            >
              {showIcon && selectedOption?.icon}
              {selectedOption?.label}
            </Stack>
          );
        }}
        size={size}
        value={value}
      >
        {options.map((opt) => (
          <MenuItem key={opt.key} sx={{ gap: 2 }} value={opt.value}>
            <Stack
              sx={{
                flexDirection: 'row',
                gap: 0.5,
                alignItems: 'center',
                fontSize: 14,
                color: 'text.primary',
                px: 1,
                py: 0.5,
                height: 36,
              }}
            >
              {showIcon && opt.icon}
              {opt.label}
            </Stack>

            <Stack
              sx={{
                width: 16,
                ml: 'auto',
              }}
            >
              <PanelIcon.FilterTick
                sx={{
                  width: 16,
                  height: 16,
                  display: value === opt.value ? 'block' : 'none',
                }}
              />
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
