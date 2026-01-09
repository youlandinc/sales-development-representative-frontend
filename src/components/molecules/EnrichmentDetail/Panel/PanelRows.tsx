import {
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import {
  PAPPER_STACK_CONTAINER_SX,
  PAPPER_SX,
  STACK_CONTAINER_SX,
} from './config';

import { PanelIcon } from './PanelIcon';

export const PanelRows = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Stack
        data-toolbar-button
        onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
        sx={STACK_CONTAINER_SX}
      >
        <PanelIcon.RowIcon size={20} />
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
            <Paper sx={PAPPER_SX}>
              <ClickAwayListener
                mouseEvent={'onMouseDown'}
                onClickAway={() => setAnchorEl(null)}
                touchEvent={'onTouchStart'}
              >
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
