import { Fade, Stack } from '@mui/material';
import { FC, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { DialogAllIntegrations } from '../DialogAllIntegrations';
import {
  DialogWorkEmailIntegrationAccount,
  DialogWorkEmailMain,
} from './index';

import { useWorkEmailStore } from '@/stores/enrichment';
import { WaterfallConfigTypeEnum } from '@/types/enrichment';

interface DialogWorkEmailProps {
  onCloseToCallback?: () => void;
}

export const DialogWorkEmail: FC<DialogWorkEmailProps> = ({
  onCloseToCallback,
}) => {
  const { setWorkEmailVisible, displayType, setWaterfallConfigType } =
    useWorkEmailStore(
      useShallow((state) => ({
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
              <DialogWorkEmailMain cb={onCloseToCallback} />
            </Stack>
          </Fade>
        );
      case 'integration':
        return (
          <Fade in>
            <Stack flex={1} overflow={'hidden'}>
              <DialogWorkEmailIntegrationAccount cb={onCloseToCallback} />
            </Stack>
          </Fade>
        );
      default:
        return null;
    }
  }, [displayType, onCloseToCallback]);

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
      {/* <DialogWorkEmailFooter cb={cb} /> */}
      <DialogAllIntegrations />
    </Stack>
  );
};
