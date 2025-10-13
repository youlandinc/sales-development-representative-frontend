import { useMemo } from 'react';
import { Drawer, Fade, Stack } from '@mui/material';

import {
  DialogWorkEmailFooter,
  DialogWorkEmailIntegrationAccount,
  DialogWorkEmailMain,
} from './index';

import { DialogHeader } from '../Common';

import { useWorkEmailStore } from '@/stores/Prospect';

export const DialogWorkEmail = () => {
  const { workEmailVisible, setWorkEmailVisible, displayType, setDisplayType } =
    useWorkEmailStore((store) => store);

  const computedHeader = useMemo(() => {
    switch (displayType) {
      case 'main':
        return (
          <DialogHeader
            handleBack={() => setWorkEmailVisible(false)}
            handleClose={() => setWorkEmailVisible(false)}
            title={'Work Email'}
          />
        );
      case 'integration':
        return (
          <DialogHeader
            handleBack={() => setDisplayType('main')}
            handleClose={() => setWorkEmailVisible(false)}
            title={'Find work email'}
          />
        );
      default:
        return null;
    }
  }, [displayType]);

  const computedContent = useMemo(() => {
    switch (displayType) {
      case 'main':
        return (
          <Fade in>
            <Stack flex={1} minHeight={0} overflow={'auto'} pb={3}>
              <DialogWorkEmailMain />
            </Stack>
          </Fade>
        );
      case 'integration':
        return (
          <Fade in>
            <Stack flex={1} minHeight={0} overflow={'auto'} pb={3}>
              <DialogWorkEmailIntegrationAccount />
            </Stack>
          </Fade>
        );
      default:
        return null;
    }
  }, [displayType]);

  return (
    <Drawer
      anchor={'right'}
      hideBackdrop
      onClose={() => setWorkEmailVisible(false)}
      open={workEmailVisible}
      slotProps={{
        paper: {
          sx: {
            maxWidth: 500,
            width: '100%',
          },
        },
      }}
      sx={{
        left: 'unset',
      }}
    >
      {computedHeader}
      {computedContent}
      <DialogWorkEmailFooter />
    </Drawer>
  );
};
