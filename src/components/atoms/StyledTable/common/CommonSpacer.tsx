import { FC } from 'react';
import { Stack } from '@mui/material';

import { TABLE_BORDERS } from '../styles';

interface CommonSpacerProps {
  width: number;
  borderRight?: boolean;
  bgcolor?: string;
}

export const CommonSpacer: FC<CommonSpacerProps> = ({
  width,
  borderRight = false,
  bgcolor,
}) => {
  return (
    <Stack
      sx={{
        width,
        flex: '0 0 auto',
        boxSizing: 'border-box',
        alignSelf: 'stretch',
        borderRight: borderRight ? TABLE_BORDERS.REGULAR : 'none',
        bgcolor: bgcolor ?? 'transparent',
      }}
    />
  );
};
