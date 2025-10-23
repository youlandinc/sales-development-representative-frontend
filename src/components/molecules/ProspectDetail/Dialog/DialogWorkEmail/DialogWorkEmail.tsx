import { Drawer, Fade, Stack } from '@mui/material';
import { useEffect, useMemo } from 'react';

import {
  DialogWorkEmailFooter,
  DialogWorkEmailIntegrationAccount,
  DialogWorkEmailMain,
} from './index';

import { useWorkEmailStore } from '@/stores/Prospect';
import { WaterfallConfigTypeEnum } from '@/types/Prospect';

export const DialogWorkEmail = () => {
  const {
    workEmailVisible,
    setWorkEmailVisible,
    displayType,
    setWaterfallConfigType,
  } = useWorkEmailStore((store) => store);

  const computedContent = useMemo(() => {
    switch (displayType) {
      case 'main':
        return (
          <Fade in>
            <Stack flex={1} overflow={'hidden'}>
              <DialogWorkEmailMain />
            </Stack>
          </Fade>
        );
      case 'integration':
        return (
          <Fade in>
            <Stack flex={1} overflow={'hidden'}>
              <DialogWorkEmailIntegrationAccount />
            </Stack>
          </Fade>
        );
      default:
        return null;
    }
  }, [displayType]);

  useEffect(() => {
    setWaterfallConfigType(WaterfallConfigTypeEnum.setup);
    return () => {
      setWaterfallConfigType(WaterfallConfigTypeEnum.setup);
      setWorkEmailVisible(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {computedContent}
      <DialogWorkEmailFooter />
    </Drawer>
  );
};
