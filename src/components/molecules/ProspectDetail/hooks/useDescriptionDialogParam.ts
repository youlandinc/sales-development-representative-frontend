import { useRef } from 'react';
import { useSwitch } from '@/hooks';

export const useDescriptionDialogParam = () => {
  const fieldRef = useRef<string>('');
  const defaultValueRef = useRef<string>('');
  const {
    visible: descriptionShow,
    open: openDescriptionDialog,
    close: closeDescriptionDialog,
  } = useSwitch();

  const handleOpenDescriptionDialog = (
    fieldId: string,
    defaultValue: string,
  ) => {
    openDescriptionDialog();
    fieldRef.current = fieldId;
    defaultValueRef.current = defaultValue;
  };

  return {
    descriptionShow,
    handleOpenDescriptionDialog,
    closeDescriptionDialog,
    fieldId: fieldRef.current,
    defaultValue: defaultValueRef.current,
  };
};
