import { useDescriptionDialogParam } from './useDescriptionDialogParam';

export const useColumnActionCollections = () => {
  const {
    descriptionShow,
    handleOpenDescriptionDialog,
    closeDescriptionDialog,
    fieldId,
    defaultValue,
  } = useDescriptionDialogParam();

  return {
    descriptionDialog: {
      descriptionShow,
      handleOpenDescriptionDialog,
      closeDescriptionDialog,
      fieldId,
      defaultValue,
    },
  };
};
