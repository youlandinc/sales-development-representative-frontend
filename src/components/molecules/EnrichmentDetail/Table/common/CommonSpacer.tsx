import { FC } from 'react';
import { Stack } from '@mui/material';

import { TABLE_BORDERS } from '../styles';

interface CommonSpacerProps {
  width: number;
  borderRight?: boolean;
  borderBottom?: boolean;
  bgcolor?: string;
}

export const CommonSpacer: FC<CommonSpacerProps> = ({
  width,
  borderRight = false,
  borderBottom = false,
  bgcolor,
}) => {
  return (
    <Stack
      sx={{
        width,
        flex: '0 0 auto',
        boxSizing: 'border-box',
        alignSelf: 'stretch',
        borderRight: borderRight ? TABLE_BORDERS.ROW : 'none',
        borderBottom: borderBottom ? TABLE_BORDERS.ROW : 'none',
        bgcolor: bgcolor ?? 'transparent',
      }}
    />
  );
};
