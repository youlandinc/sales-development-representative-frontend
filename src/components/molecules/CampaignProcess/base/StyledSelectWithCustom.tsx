import { FC } from 'react';

import { StyledSelect, StyledTextField } from '@/components/atoms';
import { Stack, Typography } from '@mui/material';

interface StyledSelectWithCustomProps {
  options: TOption[];
  selectValue: string;
  inputValue: string;
  onSelectChange: (e: any) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const StyledSelectWithCustom: FC<StyledSelectWithCustomProps> = ({
  options,
  selectValue,
  //inputValue,
  placeholder,
  onSelectChange,
  onClear,
}) => {
  return (
    <>
      {selectValue === 'custom' ? (
        <Stack>
          <StyledTextField />
          <Typography>-&gt;</Typography>
          <StyledTextField />
        </Stack>
      ) : (
        <StyledSelect
          clearable
          onChange={onSelectChange}
          onClear={onClear}
          options={options}
          placeholder={placeholder}
          value={selectValue}
        />
      )}
    </>
  );
};
