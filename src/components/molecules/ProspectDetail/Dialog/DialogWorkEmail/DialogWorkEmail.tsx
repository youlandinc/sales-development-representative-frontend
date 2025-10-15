import { Drawer, Fade, Stack } from '@mui/material';
import { useEffect, useMemo } from 'react';

import {
  DialogWorkEmailFooter,
  DialogWorkEmailIntegrationAccount,
  DialogWorkEmailMain,
} from './index';

import { useWorkEmailStore } from '@/stores/Prospect';
import { WaterfallConfigTypeEnum } from '@/types/Prospect/tableActions';
import { useParams } from 'next/navigation';

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
