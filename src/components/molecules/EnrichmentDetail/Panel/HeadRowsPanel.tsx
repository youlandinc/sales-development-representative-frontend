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

import ICON_ROW from '../assets/head/icon-row.svg';

export const HeadRowsPanel = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Stack
        data-toolbar-button
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
        <Icon component={ICON_ROW} sx={{ width: 20, height: 20 }} />
        <Typography fontSize={14}>0/0 rows</Typography>
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
                borderRadius: 2,
                boxShadow: ' 0 1px 4px 0 rgba(50, 43, 83, 0.16)',
                minWidth: 260,
              }}
            >
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Stack
                  alignItems={'center'}
                  color={'text.secondary'}
                  fontSize={14}
                  gap={0}
                  height={200}
                  justifyContent={'center'}
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
