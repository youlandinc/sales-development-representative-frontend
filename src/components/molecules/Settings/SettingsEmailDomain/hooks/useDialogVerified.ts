import { useCallback } from 'react';

import { useSwitch } from '@/hooks';
import { SDRToast } from '@/components/atoms';
import { HttpError } from '@/types';

export const useDialogVerified = () => {
  const { open, close, visible } = useSwitch(false);

  const onClickSetupMailbox = useCallback(async () => {
    try {
      // Find the button inside mailboxes and simulate a click
      const addMailboxButtonEl = document.getElementById('add-mailbox-button');
      addMailboxButtonEl?.querySelector('button')?.click();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      close();
    }
  }, [close]);

  const onOpenVerified = useCallback(() => {
    open();
  }, [open]);

  return {
    onOpenVerified,
    close,
    visible,
    onClickSetupMailbox,
  };
};
