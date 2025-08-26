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
    descriptonDialog: {
      descriptionShow,
      handleOpenDescriptionDialog,
      closeDescriptionDialog,
      fieldId,
      defaultValue,
    },
  };
};
