import { FC, useMemo } from 'react';

import { StyledTextField } from '@/components/atoms';

import { DrawersIconConfig } from '../DrawersIconConfig';

interface StyledSearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

export const StyledSearchInput: FC<StyledSearchInputProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  onClear,
}) => {
  // Search input adornment (memoized to prevent re-renders)
  const searchAdornment = useMemo(
    () => <DrawersIconConfig.ActionMenuSearch size={20} />,
    [],
  );
  const clearEndAdornment = useMemo(
    () => (
      <DrawersIconConfig.Close
        className={'icon_clear'}
        onClick={() => {
          onClear?.();
          onChange?.('');
        }}
        size={20}
        sx={{ width: 0, cursor: 'pointer' }}
      />
    ),
    [onClear, onChange],
  );
  return (
    <StyledTextField
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
      placeholder={placeholder}
      size={'small'}
      slotProps={{
        input: {
          startAdornment: searchAdornment,
          endAdornment: clearEndAdornment,
        },
      }}
      sx={{
        '&:hover .icon_clear': {
          width: 20,
        },
      }}
      value={value}
    />
  );
};
