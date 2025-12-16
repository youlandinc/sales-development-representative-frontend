import { Fade, Stack } from '@mui/material';
import { FC, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { DialogAllIntegrations } from '../DialogAllIntegrations';
import {
  DialogWorkEmailFooter,
  DialogWorkEmailIntegrationAccount,
  DialogWorkEmailMain,
} from './index';

import { useWorkEmailStore } from '@/stores/enrichment';
import { WaterfallConfigTypeEnum } from '@/types/enrichment';

interface DialogWorkEmailProps {
  cb?: () => void;
}

export const DialogWorkEmail: FC<DialogWorkEmailProps> = ({ cb }) => {
  const { setWorkEmailVisible, displayType, setWaterfallConfigType } =
    useWorkEmailStore(
      useShallow((state) => ({
        workEmailVisible: state.workEmailVisible,
        setWorkEmailVisible: state.setWorkEmailVisible,
        displayType: state.displayType,
        setWaterfallConfigType: state.setWaterfallConfigType,
      })),
    );

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
    <Stack flex={1} minHeight={0}>
      {computedContent}
      <DialogWorkEmailFooter cb={cb} />
      <DialogAllIntegrations />
    </Stack>
  );
};
