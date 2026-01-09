import { Icon, Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import {
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';

import {
  TableColumnMenuActionEnum,
  TableColumnProps,
} from '@/types/enrichment/table';

import { useAsyncFn } from '@/hooks';

import { useEnrichmentTableStore } from '@/stores/enrichment';
import { useMergedColumns } from '@/components/molecules/EnrichmentDetail/hooks';

import ICON_CLOSE from './assets/icon_close.svg';

type DialogEditDescriptionProps = {
  cb?: () => Promise<void>;
};

export const DialogEditDescription: FC<DialogEditDescriptionProps> = () => {
  const {
    activeColumnId,
    dialogType,
    closeDialog,
    updateColumnDescription,
    dialogVisible,
  } = useEnrichmentTableStore((store) => store);

  // Get merged columns
  const columns = useMergedColumns();
  const column = columns.find(
    (col: TableColumnProps) => col.fieldId === activeColumnId,
  );

  const [description, setDescription] = useState(column?.description || '');

  const [state, updateDescription] = useAsyncFn(
    async (description: string) => {
      await updateColumnDescription(description);
      closeDialog();
    },
    [activeColumnId],
  );

  const onDialogClose = () => {
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
            onClick={onDialogClose}
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
            onClick={onDialogClose}
            sx={{ width: 24, height: 24, cursor: 'pointer' }}
          />
        </Stack>
      }
      onClose={onDialogClose}
      open={
        dialogType === TableColumnMenuActionEnum.edit_description &&
        dialogVisible &&
        !!column
      }
    />
  );
};
