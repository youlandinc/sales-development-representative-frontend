import { Box, Icon, Stack, Typography } from '@mui/material';
import { FC, memo } from 'react';

import ICON_ARROW_LINE_RIGHT from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_arrow_line_right.svg';

export interface DialogHeaderProps {
  onClose: () => void;
}

export const DialogHeader: FC<DialogHeaderProps> = memo(({ onClose }) => (
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
      <Icon component={ICON_ARROW_LINE_RIGHT} sx={{ width: 20, height: 20 }} />
    </Box>
  </Stack>
));
