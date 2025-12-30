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
  PAPPER_CONFIG,
  PAPPER_STACK_CONTAINER_SX,
  STACK_CONTAINER_SX,
} from './config';

import ICON_ROW from '../assets/head/icon-row.svg';

export const HeadRowsPanel = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Stack
        data-toolbar-button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={STACK_CONTAINER_SX}
      >
        <Icon component={ICON_ROW} sx={{ width: 20, height: 20 }} />
        <Typography fontSize={14} lineHeight={1.4}>
          0/0 rows
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
            <Paper {...PAPPER_CONFIG}>
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
