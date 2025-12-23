import { FC, useMemo } from 'react';
import { Icon } from '@mui/material';

import { StyledTextField } from '@/components/atoms';

import ICON_SEARCH from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_search.svg';
import ICON_CLOSE from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_close.svg';

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
    () => <Icon component={ICON_SEARCH} sx={{ width: 20, height: 20 }} />,
    [],
  );
  const clearEndAdornment = useMemo(
    () => (
      <Icon
        className={'icon_clear'}
        component={ICON_CLOSE}
        onClick={() => {
          onClear?.();
          onChange?.('');
        }}
        sx={{ height: 20, width: 0, cursor: 'pointer' }}
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
