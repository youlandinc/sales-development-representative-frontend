import { FC } from 'react';

import { StyledSelect, StyledTextField } from '@/components/atoms';
import { Stack, Typography } from '@mui/material';

interface StyledSelectWithCustomProps {
  options: TOption[];
  selectValue: string;
  inputValue: string;
  onSelectChange: (e: any) => void;
}

export const StyledSelectWithCustom: FC<StyledSelectWithCustomProps> = ({
  options,
  selectValue,
  inputValue,
  onSelectChange,
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
          onChange={onSelectChange}
          options={options}
          value={selectValue}
        />
      )}
    </>
  );
};
