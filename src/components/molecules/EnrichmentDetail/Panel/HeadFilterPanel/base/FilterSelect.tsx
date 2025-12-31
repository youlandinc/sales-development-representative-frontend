import { FC, useState } from 'react';
import {
  FormControl,
  Icon,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  SxProps,
  Typography,
} from '@mui/material';
import { Clear } from '@mui/icons-material';

import ICON_ARROW from '@/components/atoms/StyledSelect/assets/icon_arrow.svg';

export interface FilterSelectOption {
  label: string;
  value: string;
  key: string;
  icon?: FC<React.SVGProps<SVGSVGElement>>;
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
          <ICON_ARROW style={{ marginRight: '2px' }} {...props} />
        )}
        inputProps={{
          MenuProps: {
            MenuListProps: {
              sx: {
                p: 0,
                m: 0,
                '& .MuiMenuItem-root:hover': {
                  bgcolor: '#F4F5F9 !important',
                },
                '& .Mui-selected': {
                  bgcolor: '#F0F0F4 !important',
                },
                '& .Mui-selected:hover': {
                  bgcolor: '#F0F0F4 !important',
                },
                '& .MuiMenuItem-root': {
                  fontSize: 14,
                  color: 'text.primary',
                  p: 1.5,
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
              <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                {placeholder}
              </Typography>
            );
          }
          return (
            <Stack
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              {showIcon && selectedOption?.icon && (
                <Icon
                  component={selectedOption.icon}
                  sx={{ width: 16, height: 16 }}
                />
              )}
              <Typography sx={{ fontSize: 12 }}>
                {selectedOption?.label}
              </Typography>
            </Stack>
          );
        }}
        size={size}
        value={value}
      >
        {options.map((opt) => (
          <MenuItem key={opt.key} sx={{ gap: 1 }} value={opt.value}>
            {showIcon && opt.icon && (
              <Icon component={opt.icon} sx={{ width: 16, height: 16 }} />
            )}
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
