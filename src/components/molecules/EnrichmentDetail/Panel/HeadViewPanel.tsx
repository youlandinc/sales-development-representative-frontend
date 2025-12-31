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

import {
  PAPPER_STACK_CONTAINER_SX,
  PAPPER_SX,
  STACK_CONTAINER_SX,
} from './config';

import ICON_VIEW from '../assets/head/icon-view.svg';

export const HeadViewPanel = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Stack
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={STACK_CONTAINER_SX}
      >
        <Icon component={ICON_VIEW} sx={{ width: 20, height: 20 }} />
        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1.4,
          }}
        >
          Default view
        </Typography>
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
            <Paper sx={PAPPER_SX}>
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Stack
                  sx={{
                    ...PAPPER_STACK_CONTAINER_SX,
                    color: 'text.secondary',
                    fontSize: 14,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 0,
                    height: 200,
                  }}
                >
                  No content available
                </Stack>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
