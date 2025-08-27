import { Icon, Stack, Typography } from '@mui/material';
import React, { FC, useEffect } from 'react';

import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';

import { useAsyncFn } from '@/hooks';

import { _updateTableColumnConfig } from '@/request';
import { HttpError } from '@/types';

import ICON_CLOSE from './assets/icon_close.svg';
import { useProspectTableStore } from '@/stores/Prospect';
import { TableColumnMenuEnum } from '@/components/molecules';

type DialogEditDescriptionProps = {
  cb?: () => Promise<void>;
};

export const DialogEditDescription: FC<DialogEditDescriptionProps> = ({
  cb,
}) => {
  const { columns, activeColumnId, dialogType, resetDialog } =
    useProspectTableStore((store) => store);

  const column = columns.find((col) => col.fieldId === activeColumnId);

  const [description, setDescription] = React.useState(
    column?.description || '',
  );

  const [state, updateDescription] = useAsyncFn(
    async (description: string) => {
      try {
        await _updateTableColumnConfig({
          fieldId: activeColumnId,
          description,
        });
        await cb?.();
        resetDialog();
      } catch (error) {
        const { message, header, variant } = error as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    [activeColumnId],
  );

  const handleClose = () => {
    resetDialog();
    setDescription('');
  };

  useEffect(() => {
    if (column?.description) {
      setDescription(column?.description);
    }
  }, [column?.description]);

  return (
    <StyledDialog
      content={
        <Stack gap={1} py={1.5}>
          <Typography color={'text.secondary'} variant={'body2'}>
            Add a description to help others understand what this view is for.
          </Typography>
          <StyledTextField
            multiline
            onChange={(e) => setDescription(e.target.value)}
            placeholder={'Briefly describe what this column contains'}
            rows={3}
            value={description}
          />
        </Stack>
      }
      footer={
        <Stack flexDirection={'row'} gap={1.5}>
          <StyledButton
            color={'info'}
            onClick={handleClose}
            size={'medium'}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            loading={state.loading}
            onClick={() => {
              updateDescription(description);
            }}
            size={'medium'}
            sx={{ width: 143 }}
            variant={'contained'}
          >
            Save description
          </StyledButton>
        </Stack>
      }
      header={
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <Typography
            color={'inherit'}
            fontSize={'inherit'}
            fontWeight={'inherit'}
          >
            Edit view description
          </Typography>
          <Icon
            component={ICON_CLOSE}
            onClick={handleClose}
            sx={{ width: 24, height: 24, cursor: 'pointer' }}
          />
        </Stack>
      }
      onClose={handleClose}
      open={dialogType === TableColumnMenuEnum.edit_description}
    />
  );
};
