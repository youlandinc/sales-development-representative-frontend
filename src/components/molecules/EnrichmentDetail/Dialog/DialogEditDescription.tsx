import { Icon, Stack, Typography } from '@mui/material';
import React, { FC, useEffect } from 'react';

import {
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';

import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

import { useAsyncFn } from '@/hooks';

import { useEnrichmentTableStore } from '@/stores/enrichment';

import ICON_CLOSE from '../assets/dialog/icon_close.svg';

type DialogEditDescriptionProps = {
  cb?: () => Promise<void>;
};

export const DialogEditDescription: FC<DialogEditDescriptionProps> = () => {
  const {
    columns,
    activeColumnId,
    dialogType,
    closeDialog,
    updateColumnDescription,
    dialogVisible,
  } = useEnrichmentTableStore((store) => store);

  const column = columns.find((col) => col.fieldId === activeColumnId);

  const [description, setDescription] = React.useState(
    column?.description || '',
  );

  const [state, updateDescription] = useAsyncFn(
    async (description: string) => {
      await updateColumnDescription(description);
      closeDialog();
    },
    [activeColumnId],
  );

  const handleClose = () => {
    closeDialog();
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
            autoFocus
            multiline
            onChange={(e) => setDescription(e.target.value)}
            placeholder={'Add description...'}
            rows={4}
            sx={{
              '& .MuiInputBase-input': {
                padding: '0px',
              },
            }}
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
      open={
        dialogType === TableColumnMenuActionEnum.edit_description &&
        dialogVisible &&
        !!column
      }
    />
  );
};
