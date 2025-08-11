import { FC } from 'react';
import { Stack } from '@mui/material';

interface StyledTableSpacerProps {
  width: number;
}

export const StyledTableSpacer: FC<StyledTableSpacerProps> = ({ width }) => {
  return <Stack sx={{ width, flex: '0 0 auto' }} />;
};
