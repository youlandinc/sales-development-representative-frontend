import { FC, memo } from 'react';
import { Box, Checkbox, Stack } from '@mui/material';

import { StyledImage } from '../../StyledImage';

const CHECKBOX_ICON_CHECKED = (
  <StyledImage
    sx={{ width: 20, height: 20, position: 'relative' }}
    url="/images/icon-checkbox-check.svg"
  />
);

const CHECKBOX_ICON_UNCHECKED = (
  <StyledImage
    sx={{ width: 20, height: 20, position: 'relative' }}
    url="/images/icon-checkbox-static.svg"
  />
);

const CHECKBOX_ICON_INDETERMINATE = (
  <StyledImage
    sx={{ width: 20, height: 20, position: 'relative' }}
    url="/images/icon-checkbox-intermediate.svg"
  />
);

export interface BodyCellCheckboxProps {
  rowIndex: number;
  isRowSelected: boolean;
  isRowHovered: boolean;
  onToggleSelected: (selected: boolean) => void;
}

const BodyCellCheckboxComponent: FC<BodyCellCheckboxProps> = ({
  rowIndex,
  isRowSelected,
  isRowHovered,
  onToggleSelected,
}) => {
  const label = `${rowIndex + 1}`;
  const shouldShowCheckbox = isRowSelected || isRowHovered;

  return (
    <Stack
      flexDirection="row"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Box display={shouldShowCheckbox ? 'none' : 'block'}>{label}</Box>
      <Box display={shouldShowCheckbox ? 'block' : 'none'}>
        <Checkbox
          checked={isRowSelected}
          checkedIcon={CHECKBOX_ICON_CHECKED}
          icon={CHECKBOX_ICON_UNCHECKED}
          indeterminateIcon={CHECKBOX_ICON_INDETERMINATE}
          onChange={(_, next) => onToggleSelected(next)}
          onClick={(e) => e.stopPropagation()}
          size="small"
          sx={{ p: 0 }}
        />
      </Box>
    </Stack>
  );
};

export const BodyCellCheckbox = memo(BodyCellCheckboxComponent);
