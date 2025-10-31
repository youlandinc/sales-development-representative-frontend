import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { useSwitch } from '@/hooks';
import { _deleteCustomEmailDomain } from '@/request';
import { EmailDomainDetails, HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';

interface UseDialogRemoveProps {
  onRefresh: () => Promise<void>;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export const useDialogRemove = ({
  onRefresh,
  setActiveStep,
}: UseDialogRemoveProps) => {
  const { open, close, visible } = useSwitch(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteItem, setDeleteItem] = useState<EmailDomainDetails>();

  const onClickToDelete = useCallback(async () => {
    if (!deleteItem) {
      return;
    }
    setDeleteLoading(true);
    try {
      await _deleteCustomEmailDomain(deleteItem.id);
      await onRefresh();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      close();
      setDeleteItem(void 0);
      setDeleteLoading(false);
      setTimeout(() => {
        setActiveStep(0);
        setDeleteItem(void 0);
      }, 200);
    }
  }, [close, deleteItem, onRefresh, setActiveStep]);

  const onRemove = useCallback(
    (item: EmailDomainDetails) => {
      open();
      setDeleteItem(item);
    },
    [open],
  );

  return {
    deleteItem,
    deleteLoading,
    onClickToDelete,
    close,
    visible,
    onRemove,
  };
};
