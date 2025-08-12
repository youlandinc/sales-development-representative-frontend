import { FC } from 'react';
import { Stack } from '@mui/material';

interface StyledTableSpacerProps {
  width: number;
  borderRight?: boolean;
}

export const StyledTableSpacer: FC<StyledTableSpacerProps> = ({
  width,
  borderRight = false,
}) => {
  return (
    <Stack
      sx={{
        width,
        flex: '0 0 auto',
        boxSizing: 'border-box',
        alignSelf: 'stretch',
        borderRight: borderRight ? '0.5px solid #DFDEE6' : 'none',
      }}
    />
  );
};
