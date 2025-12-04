import { FC } from 'react';
import { Box } from '@mui/material';

import { PATTERN_STYLES } from './constants';

export const DirectoriesPattern: FC = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...PATTERN_STYLES,
        WebkitMaskImage: PATTERN_STYLES.maskImage,
      }}
    />
  );
};
