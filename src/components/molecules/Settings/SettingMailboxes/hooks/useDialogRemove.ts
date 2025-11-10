import { useCallback, useState } from 'react';

import { useSwitch } from '@/hooks';
import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';

import { _deleteMailbox, Mailbox } from '../data';

interface UseDialogRemoveProps {
  onRefresh: () => Promise<void>;
}

export const useDialogRemove = ({ onRefresh }: UseDialogRemoveProps) => {
  const { open, close, visible } = useSwitch(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Mailbox>();

  const onClickToDelete = useCallback(async () => {
    if (!deleteItem) {
      return;
    }
    setDeleteLoading(true);
    try {
      await _deleteMailbox(deleteItem.id);
      await onRefresh();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      close();
      setDeleteItem(void 0);
      setDeleteLoading(false);
    }
  }, [close, deleteItem, onRefresh]);

  const onRemove = useCallback(
    (item: Mailbox) => {
      open();
      setDeleteItem(item);
    },
    [open],
  );

  return {
    deleteLoading,
    onClickToDelete,
    close,
    visible,
    onRemove,
  };
};
