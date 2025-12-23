import { FC } from 'react';
import { Checkbox } from '@mui/material';

import { StyledImage } from '@/components/atoms/StyledImage';

interface HeadCellCheckboxProps {
  isAllRowsSelected?: boolean;
  isSomeRowsSelected?: boolean;
  onToggleAllRows: (event: unknown) => void;
}

export const HeadCellCheckbox: FC<HeadCellCheckboxProps> = ({
  isAllRowsSelected,
  isSomeRowsSelected,
  onToggleAllRows,
}) => {
  return (
    <Checkbox
      checked={isAllRowsSelected}
      checkedIcon={
        <StyledImage
          sx={{ width: 20, height: 20, position: 'relative' }}
          url={'/images/icon-checkbox-check.svg'}
        />
      }
      icon={
        <StyledImage
          sx={{ width: 20, height: 20, position: 'relative' }}
          url={'/images/icon-checkbox-static.svg'}
        />
      }
      indeterminate={isSomeRowsSelected}
      indeterminateIcon={
        <StyledImage
          sx={{ width: 20, height: 20, position: 'relative' }}
          url={'/images/icon-checkbox-intermediate.svg'}
        />
      }
      onChange={onToggleAllRows}
      onClick={(e) => e.stopPropagation()}
      size="small"
      sx={{ p: 0 }}
    />
  );
};
