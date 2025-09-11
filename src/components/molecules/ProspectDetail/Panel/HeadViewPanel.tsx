import { useState } from 'react';
import {
  ClickAwayListener,
  Grow,
  Icon,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';

import ICON_VIEW from '../assets/head/icon-view.svg';

export const HeadViewPanel = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Stack
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          gap: 0.5,
          px: 1.5,
          borderRadius: 1,
          flexDirection: 'row',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': { bgcolor: '#EDEDED' },
        }}
      >
        <Icon component={ICON_VIEW} sx={{ width: 20, height: 20 }} />
        <Typography fontSize={14}>Default view</Typography>
      </Stack>

      <Popper
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={300}>
            <Paper
              sx={{
                boxShadow: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                minWidth: 260,
              }}
            >
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Stack gap={0} height={200}></Stack>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
