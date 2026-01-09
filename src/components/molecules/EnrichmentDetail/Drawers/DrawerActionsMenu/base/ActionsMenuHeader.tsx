import { Box, Stack, Typography } from '@mui/material';
import { FC, memo } from 'react';

import { DrawersIconConfig } from '../../DrawersIconConfig';

export interface ActionsMenuHeaderProps {
  onClose: () => void;
}

export const ActionsMenuHeader: FC<ActionsMenuHeaderProps> = memo(
  ({ onClose }) => (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      pt={3}
    >
      <Typography fontSize={16} fontWeight={600} lineHeight={1.2}>
        Actions
      </Typography>
      <Box
        onClick={onClose}
        sx={{
          border: '1px solid',
          borderColor: 'border.default',
          borderRadius: 2,
          p: 0.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'background.active',
          },
        }}
      >
        <DrawersIconConfig.ActionMenuArrowLineRight size={16} />
      </Box>
    </Stack>
  ),
);
